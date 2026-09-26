const express = require('express');
const { Op } = require('sequelize');
const crypto = require('crypto');
const sequelize = require('../config/database');
const DigitalOfficeRecord = require('../models/DigitalOfficeRecord');
const DigitalOfficeAudit = require('../models/DigitalOfficeAudit');
const Member = require('../models/Member');
const Volunteer = require('../models/Volunteer');
const Donor = require('../models/Donor');
const InternshipApplication = require('../models/InternshipApplication');

const router = express.Router();
const GOOGLE_FRONTEND_URL = String(process.env.GOOGLE_FRONTEND_URL || 'https://swastiksrijan.in/SSFDigitalOffice').trim();
const GOOGLE_OAUTH_REDIRECT_URI = String(process.env.GOOGLE_OAUTH_REDIRECT_URI || 'https://swastiksrijan.in/api/digital-office/google/callback').trim();
const googleTokenKey = () => crypto.createHash('sha256').update(String(process.env.GOOGLE_TOKEN_ENCRYPTION_KEY || process.env.ADMIN_PORTAL_TOKEN || 'ssf-google-token-key').trim()).digest();
const encryptGoogleToken = (value) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', googleTokenKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  return [iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), encrypted.toString('base64url')].join('.');
};
const decryptGoogleToken = (value) => {
  const [iv, tag, encrypted] = String(value || '').split('.');
  if (!iv || !tag || !encrypted) throw new Error('Invalid Google token data.');
  const decipher = crypto.createDecipheriv('aes-256-gcm', googleTokenKey(), Buffer.from(iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64url')), decipher.final()]).toString('utf8');
};
const googleState = (payload) => {
  const raw = Buffer.from(JSON.stringify(Object.assign({ts:Date.now()}, payload))).toString('base64url');
  const sig = crypto.createHmac('sha256', googleTokenKey()).update(raw).digest('base64url');
  return raw + '.' + sig;
};
const verifyGoogleState = (state) => {
  const [raw, sig] = String(state || '').split('.');
  if (!raw || !sig) throw new Error('Invalid Google OAuth state.');
  const expected = crypto.createHmac('sha256', googleTokenKey()).update(raw).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) throw new Error('Invalid Google OAuth state.');
  const payload = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
  if (!payload.ts || Date.now() - Number(payload.ts) > 10 * 60 * 1000) throw new Error('Google OAuth state expired.');
  return payload;
};
const googleClientId = () => String(process.env.GOOGLE_CLIENT_ID || '').trim();
const googleClientSecret = () => String(process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECERT || '').trim();
const googleConfigReady = () => Boolean(googleClientId() && googleClientSecret());
const googleRedirectUri = () => GOOGLE_OAUTH_REDIRECT_URI;
const googleJson = async (url, options={}) => {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch (_) { body = { raw:text }; }
  if (!response.ok) throw new Error(body.error_description || body.error?.message || body.error || 'Google API request failed.');
  return body;
};
const getGoogleConnection = async () => {
  const row = await DigitalOfficeRecord.findOne({ where:{module:'googleOAuth',status:'active'}, order:[['updatedAt','DESC']] });
  if (!row || !row.data?.refreshToken) return null;
  return row;
};
const getGoogleAccessToken = async () => {
  const row = await getGoogleConnection();
  if (!row) throw new Error('Google account is not connected to SSF Digital Office.');
  try {
    const accessToken = row.data.accessToken ? decryptGoogleToken(row.data.accessToken) : '';
    if (accessToken && row.data.accessTokenExpiresAt && Date.now() < Number(row.data.accessTokenExpiresAt) - 60000) return accessToken;
  } catch (_) {}
  const refreshToken = decryptGoogleToken(row.data.refreshToken);
  const tokenBody = await googleJson('https://oauth2.googleapis.com/token', {
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({client_id:googleClientId(),client_secret:googleClientSecret(),refresh_token:refreshToken,grant_type:'refresh_token'})
  });
  row.data = Object.assign({}, row.data, {accessToken:encryptGoogleToken(tokenBody.access_token),accessTokenExpiresAt:Date.now()+Number(tokenBody.expires_in||3600)*1000});
  await row.save();
  return tokenBody.access_token;
};


const requireOfficeAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const expected = process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
  if (!token || token !== expected) return res.status(401).json({ message: 'Unauthorized digital office access' });
  next();
};

const prefix = { members:'MEM', volunteers:'VOL', donors:'DON', donations:'DNT', internships:'INT', beneficiaries:'BEN', events:'EVT', projects:'PRJ', documents:'DOC', expenses:'EXP', contribution:'CON', cash:'CSH', bank:'BNK', ledger:'LED', inward:'INW', outward:'OUT', meetings:'MTG', activities:'ACT', notifications:'NTF', users:'USR', inventory:'STK', assets:'AST', mou:'MOU', certificates:'CERT', idcards:'ID', governanceActions:'GOV' };
const makeId = async (module) => {
  const p = prefix[module] || 'REC';
  const stamp = new Date().toISOString().slice(0,10).replace(/-/g,'');
  let sequence = (await DigitalOfficeRecord.count({ where: { module } })) + 1;
  let candidate = `SSF-${p}-${stamp}-${String(sequence).padStart(5,'0')}`;
  while (await DigitalOfficeRecord.findOne({ where: { recordId: candidate }, attributes: ['id'] })) {
    sequence += 1;
    candidate = `SSF-${p}-${stamp}-${String(sequence).padStart(5,'0')}`;
  }
  return candidate;
};
const audit = async (action, module, recordId, req, details={}) => {
  await DigitalOfficeAudit.create({ action, module, recordId, actor: req.headers['x-office-actor'] || 'admin', details });
};


router.get('/digital-office/google/connect-url', requireOfficeAuth, async (req, res) => {
  try {
    if (!googleConfigReady()) return res.status(503).json({message:'Google Meet integration is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the backend.'});
    const params = new URLSearchParams({
      client_id: googleClientId(),
      redirect_uri: googleRedirectUri(),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      scope: 'https://www.googleapis.com/auth/meetings.space.created'
    });
    const state = googleState({purpose:'ssf-google-meet'});
    return res.json({url:'https://accounts.google.com/o/oauth2/v2/auth?'+params.toString()+'&state='+encodeURIComponent(state)});
  } catch (e) { console.error(e); return res.status(500).json({message:'Unable to start Google authorization.'}); }
});

router.get('/digital-office/google/callback', async (req, res) => {
  try {
    if (!googleConfigReady()) throw new Error('Google Meet integration is not configured.');
    const state = verifyGoogleState(req.query.state);
    if (state.purpose !== 'ssf-google-meet') throw new Error('Invalid Google authorization request.');
    if (!req.query.code) throw new Error(req.query.error_description || 'Google authorization was cancelled.');
    const tokenBody = await googleJson('https://oauth2.googleapis.com/token', {
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({code:req.query.code,client_id:googleClientId(),client_secret:googleClientSecret(),redirect_uri:googleRedirectUri(),grant_type:'authorization_code'})
    });
    if (!tokenBody.refresh_token) throw new Error('Google did not return a refresh token. Please reconnect and approve offline access.');
    const old=await getGoogleConnection();
    const data={provider:'Google Meet',refreshToken:encryptGoogleToken(tokenBody.refresh_token),accessToken:tokenBody.access_token?encryptGoogleToken(tokenBody.access_token):null,accessTokenExpiresAt:Date.now()+Number(tokenBody.expires_in||3600)*1000,connectedAt:new Date().toISOString()};
    if(old){old.data=data;await old.save();}
    else await DigitalOfficeRecord.create({recordId:'SSF-GOOGLE-OAUTH-'+Date.now(),module:'googleOAuth',status:'active',recordDate:new Date(),data});
    return res.redirect(GOOGLE_FRONTEND_URL+'?google=connected');
  } catch (e) {
    console.error(e);
    return res.redirect(GOOGLE_FRONTEND_URL+'?google=error&message='+encodeURIComponent(e.message||'Google authorization failed.'));
  }
});

router.get('/digital-office/google/status', requireOfficeAuth, async (_req,res) => {
  try { const row=await getGoogleConnection(); return res.json({connected:Boolean(row),provider:row?.data?.provider||null,connectedAt:row?.data?.connectedAt||null}); }
  catch(e){return res.status(500).json({message:'Unable to read Google connection status.'});}
});

router.post('/digital-office/google/create-meeting', requireOfficeAuth, async (req,res) => {
  try {
    if (!googleConfigReady()) return res.status(503).json({message:'Google Meet integration is not configured yet.'});
    const b=req.body||{};
    const title=String(b.title||'SSF Online Meeting').trim();
    const date=String(b.date||'').trim();
    const time=String(b.time||'').trim();
    const agenda=String(b.agenda||'').trim();
    const emails=Array.isArray(b.emails)?Array.from(new Set(b.emails.map(x=>String(x||'').trim().toLowerCase()).filter(x=>/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(x)))):[];
    const accessToken=await getGoogleAccessToken();
    const space=await googleJson('https://meet.googleapis.com/v2/spaces',{method:'POST',headers:{Authorization:'Bearer '+accessToken,'Content-Type':'application/json'},body:JSON.stringify({})});
    const meetingLink=space.meetingUri;
    let addedMembers=0;
    for(const email of emails){
      try{
        await googleJson('https://meet.googleapis.com/v2/'+space.name+'/members',{method:'POST',headers:{Authorization:'Bearer '+accessToken,'Content-Type':'application/json'},body:JSON.stringify({email})});
        addedMembers++;
      }catch(e){console.warn('Meet member add failed for',email,e.message);}
    }
    let emailed=0;
    const emailErrors=[];
    if(emails.length && process.env.EMAIL_USER && process.env.EMAIL_PASS){
      const nodemailer=require('nodemailer');
      const transporter=nodemailer.createTransport({host:process.env.EMAIL_HOST||'smtp.gmail.com',port:Number(process.env.EMAIL_PORT||465),secure:String(process.env.EMAIL_SECURE||'true')==='true',auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}});
      for(const to of emails){
        try{
          await transporter.sendMail({from:process.env.EMAIL_FROM||process.env.EMAIL_USER,to,subject:'SSF Online Meeting: '+title,text:'Swastik Srijan Foundation Samiti\\n\\nOnline Meeting: '+title+'\\nDate: '+date+'\\nTime: '+time+'\\nAgenda: '+(agenda||'As per meeting notice')+'\\n\\nJoin Meeting: '+meetingLink+'\\n\\nPlease join using the link above.'});
          emailed++;
        }catch(e){emailErrors.push(to);}
      }
    }
    return res.status(201).json({meetingLink,meetingName:space.name,addedMembers,emailed,emailErrors,emailConfigured:Boolean(process.env.EMAIL_USER&&process.env.EMAIL_PASS)});
  } catch(e) {
    console.error(e);
    return res.status(500).json({message:e.message||'Unable to create Google Meet.'});
  }
});

router.post('/digital-office/online-meeting', requireOfficeAuth, async (req,res) => {
  try {
    const b=req.body||{};
    const title=String(b.title||'SSF Online Meeting').trim();
    const date=String(b.date||'').trim();
    const time=String(b.time||'').trim();
    const agenda=String(b.agenda||'').trim();
    const emails=Array.isArray(b.emails)?Array.from(new Set(b.emails.map(x=>String(x||'').trim().toLowerCase()).filter(x=>/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(x)))):[];
    if(!title || !date || !time) return res.status(400).json({message:'Meeting title, date and time are required.'});
    const safeTitle=title.replace(/[^A-Za-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50)||'SSF-Meeting';
    const room='SSF-'+safeTitle+'-'+Date.now().toString(36)+'-'+crypto.randomBytes(6).toString('hex');
    const meetingLink='https://meet.jit.si/'+room;
    let emailed=0;
    const emailErrors=[];
    if(emails.length && process.env.EMAIL_USER && process.env.EMAIL_PASS){
      const nodemailer=require('nodemailer');
      const transporter=nodemailer.createTransport({host:process.env.EMAIL_HOST||'smtp.gmail.com',port:Number(process.env.EMAIL_PORT||465),secure:String(process.env.EMAIL_SECURE||'true')==='true',auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}});
      for(const to of emails){
        try{
          await transporter.sendMail({
            from:process.env.EMAIL_FROM||process.env.EMAIL_USER,
            to,
            subject:'SSF Online Meeting: '+title,
            text:'Swastik Srijan Foundation Samiti\\n\\nOnline Meeting: '+title+'\\nDate: '+date+'\\nTime: '+time+'\\nAgenda: '+(agenda||'As per meeting notice')+'\\n\\nJoin Meeting: '+meetingLink+'\\n\\nPlease join using the link above.'
          });
          emailed++;
        }catch(e){emailErrors.push(to);}
      }
    }
    return res.status(201).json({meetingLink,room,emailed,emailErrors,emailConfigured:Boolean(process.env.EMAIL_USER&&process.env.EMAIL_PASS)});
  } catch(e) {
    console.error(e);
    return res.status(500).json({message:e.message||'Unable to create online meeting.'});
  }
});

router.get('/digital-office/summary', requireOfficeAuth, async (_req, res) => {
  try {
    const rows = await DigitalOfficeRecord.findAll({ where: { status: { [Op.ne]: 'deleted' } }, order: [['recordDate','DESC']] });
    const [memberCount, volunteerCount, donorCount, internshipCount] = await Promise.all([Member.count(), Volunteer.count(), Donor.count(), InternshipApplication.count()]);
    const sum = (module) => rows.filter(r => r.module === module).reduce((s,r)=>s+Number(r.amount||0),0);
    const balance = (module) => rows.filter(r => r.module === module).reduce((s,r)=>{
      const d=String(r.direction||'in').toLowerCase();
      const a=Number(r.amount||0);
      if(d==='out'||d==='debit') return s-a;
      return s+a;
    },0);
    const count = (module) => rows.filter(r => r.module === module).length;
    const pending = rows.filter(r => ['pending','under_review','submitted'].includes(String(r.status||'').toLowerCase())).length;
    const stockBalance = rows.filter(r => r.module === 'inventory').reduce((s,r)=>{ const q=Number(r.data?.qty||0); const d=String(r.direction||'in').toLowerCase(); return s + ((d==='out'||d==='debit') ? -q : q); },0);
    return res.json({
      counts: Object.assign(Object.fromEntries(Object.keys(prefix).map(m => [m, count(m)])), { members:memberCount, volunteers:volunteerCount, donors:donorCount, internships:internshipCount }),
      totals: { donations: sum('donations'), expenses: sum('expenses'), contributions: sum('contribution'), cash: balance('cash'), bank: balance('bank'), stockEntries: count('inventory'), stockBalance },
      workflow: { pending, activeMous: rows.filter(r=>r.module==='mou' && String(r.status||'').toLowerCase()==='active').length, upcomingMeetings: rows.filter(r=>r.module==='meetings' && new Date(r.recordDate)>=new Date()).length },
      recent: rows.slice(0,20)
    });
  } catch (e) { console.error(e); res.status(500).json({message:'Unable to load Digital Office summary.'}); }
});

router.get('/digital-office/records', requireOfficeAuth, async (req, res) => {
  try {
    const where = { status: { [Op.ne]: 'deleted' } };
    if (req.query.module) where.module = String(req.query.module);
    if (req.query.search) where[Op.or] = [
      { recordId: { [Op.iLike]: `%${String(req.query.search)}%` } },
      { personId: { [Op.iLike]: `%${String(req.query.search)}%` } }
    ];
    let rows = await DigitalOfficeRecord.findAll({ where, order: [['recordDate','DESC'],['createdAt','DESC']] });
    // Existing website records are read into the office without copying or deleting them.
    if (['members','volunteers','donors','internships'].includes(String(req.query.module || ''))) {
      const m = String(req.query.module);
      if (m === 'members') {
        const existing = await Member.findAll({ order: [['createdAt','DESC']] });
        rows = existing.map(x => ({ id:x.id, recordId:x.memberId || 'ACCOUNT-'+String(x.id).slice(0,8), module:'members', recordType:x.memberType, status:x.status, recordDate:x.createdAt, amount:x.paymentAmount, personId:x.memberId, data:x.toJSON() }));
      } else if (m === 'volunteers') {
        const existing = await Volunteer.findAll({ order: [['createdAt','DESC']] });
        rows = existing.map(x => ({ id:x.id, recordId:x.volunteerId || 'VOL-'+String(x.id).slice(0,8), module:'volunteers', recordType:x.volunteerType, status:x.status, recordDate:x.createdAt, personId:x.volunteerId, data:x.toJSON() }));
      } else if (m === 'donors') {
        const existing = await Donor.findAll({ order: [['createdAt','DESC']] });
        rows = existing.map(x => ({ id:x.id, recordId:x.donorId || 'DON-'+String(x.id).slice(0,8), module:'donors', recordType:'donor', status:x.status, recordDate:x.createdAt, amount:x.amount, personId:x.donorId, data:x.toJSON() }));
      } else if (m === 'internships') {
        const existing = await InternshipApplication.findAll({ order: [['createdAt','DESC']] });
        rows = existing.map(x => ({ id:x.id, recordId:x.internId || 'INT-'+String(x.id).slice(0,8), module:'internships', recordType:x.internshipType, status:x.status, recordDate:x.createdAt, personId:x.internId, data:x.toJSON() }));
      }
    }
    return res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({message:'Unable to load records.'}); }
});

router.post('/digital-office/records', requireOfficeAuth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const body = req.body || {};
    if (!body.module) { await t.rollback(); return res.status(400).json({message:'module is required'}); }
    const recordId = body.recordId || await makeId(body.module);
    const row = await DigitalOfficeRecord.create({
      recordId, module: body.module, recordType: body.recordType || null,
      status: body.status || 'active', recordDate: body.recordDate || new Date(),
      amount: body.amount == null || body.amount === '' ? null : Number(body.amount),
      paymentMode: body.paymentMode || null, direction: body.direction || null,
      account: body.account || null, linkedRecordId: body.linkedRecordId || null,
      personId: body.personId || null, createdBy: req.headers['x-office-actor'] || 'admin',
      createdByName: req.headers['x-office-actor-name'] || 'SSF Admin', data: body.data || {}
    }, { transaction: t });
    await DigitalOfficeAudit.create({ action:'create', module:body.module, recordId, actor:req.headers['x-office-actor'] || 'admin', details:{recordType:body.recordType||null} }, {transaction:t});
    await t.commit();
    return res.status(201).json(row);
  } catch (e) {
    try { await t.rollback(); } catch (_) {}
    console.error('Digital Office record save failed:', e);
    const detail = e?.errors?.map(x => x.message).filter(Boolean).join('; ') || e?.message || 'Unknown database error.';
    res.status(500).json({message:'Unable to save record.', detail});
  }
});

router.put('/digital-office/records/:id', requireOfficeAuth, async (req, res) => {
  try {
    const row = await DigitalOfficeRecord.findByPk(req.params.id);
    if (!row) return res.status(404).json({message:'Record not found.'});
    const allowed = ['recordType','status','recordDate','amount','paymentMode','direction','account','linkedRecordId','personId','data'];
    allowed.forEach(k => { if (Object.prototype.hasOwnProperty.call(req.body,k)) row[k] = req.body[k]; });
    await row.save();
    await audit('update', row.module, row.recordId, req, { fields:Object.keys(req.body) });
    return res.json(row);
  } catch (e) { console.error(e); res.status(500).json({message:'Unable to update record.'}); }
});

router.delete('/digital-office/records/:id', requireOfficeAuth, async (req, res) => {
  try {
    const row = await DigitalOfficeRecord.findByPk(req.params.id);
    if (!row) return res.status(404).json({message:'Record not found.'});
    row.status = 'deleted';
    await row.save();
    await audit('archive', row.module, row.recordId, req);
    return res.json({status:'success', recordId:row.recordId});
  } catch (e) { console.error(e); res.status(500).json({message:'Unable to archive record.'}); }
});

router.post('/digital-office/donations', requireOfficeAuth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const b=req.body||{}; if(!b.donorName || !b.amount) { await t.rollback(); return res.status(400).json({message:'Donor name and amount are required.'}); }
    const donationId=await makeId('donations');
    const donorId=b.donorId || await makeId('donors');
    const paid=['paid','offline','received'].includes(String(b.paymentStatus||'paid').toLowerCase());
    await DigitalOfficeRecord.create({recordId:donorId,module:'donors',recordDate:b.date||new Date(),personId:b.personId||null,data:{fullName:b.donorName,email:b.email||'',phone:b.phone||'',pan:b.pan||'',address:b.address||''}}, {transaction:t});
    const donation=await DigitalOfficeRecord.create({recordId:donationId,module:'donations',recordType:'donation',recordDate:b.date||new Date(),amount:Number(b.amount),paymentMode:b.paymentMode||'Cash',account:b.account||b.paymentMode||'Cash',personId:b.personId||null,data:{donorId,donorName:b.donorName,purpose:b.purpose||'General donation',paymentStatus:b.paymentStatus||'paid',receiptNo:b.receiptNo||donationId,pan:b.pan||'',address:b.address||'',email:b.email||'',notes:b.notes||''}}, {transaction:t});
    await DigitalOfficeRecord.create({recordId:await makeId('contribution'),module:'contribution',recordType:'donation',recordDate:b.date||new Date(),amount:Number(b.amount),paymentMode:b.paymentMode||'Cash',account:b.account||'Cash',linkedRecordId:donationId,data:{source:'donation',donorId}}, {transaction:t});
    if(paid){
      const ledgerId=await makeId('ledger');
      await DigitalOfficeRecord.create({recordId:ledgerId,module:'ledger',recordType:'donation',recordDate:b.date||new Date(),amount:Number(b.amount),direction:'credit',account:b.account||b.paymentMode||'Cash',linkedRecordId:donationId,data:{description:`Donation from ${b.donorName}`}}, {transaction:t});
      const bookModule=String(b.paymentMode||'Cash').toLowerCase()==='cash'?'cash':'bank';
      await DigitalOfficeRecord.create({recordId:await makeId(bookModule),module:bookModule,recordType:'receipt',recordDate:b.date||new Date(),amount:Number(b.amount),direction:'in',account:b.account||b.paymentMode||'Cash',linkedRecordId:donationId,data:{description:`Donation from ${b.donorName}`}}, {transaction:t});
    }
    await DigitalOfficeAudit.create({action:'donation_create',module:'donations',recordId:donationId,actor:req.headers['x-office-actor']||'admin',details:{donorId,amount:b.amount,paymentStatus:b.paymentStatus||'paid'}},{transaction:t});
    await t.commit(); return res.status(201).json({donationId,donorId,receiptId:donationId});
  } catch(e){await t.rollback();console.error(e);return res.status(500).json({message:'Unable to save donation workflow.'});}
});

router.post('/digital-office/expenses', requireOfficeAuth, async (req,res)=>{
  const t=await sequelize.transaction();
  try{
    const b=req.body||{}; if(!b.payee || !b.amount){await t.rollback();return res.status(400).json({message:'Payee and amount are required.'});}
    const expenseId=await makeId('expenses');
    await DigitalOfficeRecord.create({recordId:expenseId,module:'expenses',recordType:b.category||'general',recordDate:b.date||new Date(),amount:Number(b.amount),paymentMode:b.paymentMode||'Cash',account:b.account||b.paymentMode||'Cash',data:{payee:b.payee,category:b.category||'General',purpose:b.purpose||'',billNo:b.billNo||'',notes:b.notes||''}}, {transaction:t});
    await DigitalOfficeRecord.create({recordId:await makeId('ledger'),module:'ledger',recordType:'expense',recordDate:b.date||new Date(),amount:Number(b.amount),direction:'debit',account:b.account||b.paymentMode||'Cash',linkedRecordId:expenseId,data:{description:`Expense - ${b.payee}`}}, {transaction:t});
    const bookModule=String(b.paymentMode||'Cash').toLowerCase()==='cash'?'cash':'bank';
    await DigitalOfficeRecord.create({recordId:await makeId(bookModule),module:bookModule,recordType:'payment',recordDate:b.date||new Date(),amount:Number(b.amount),direction:'out',account:b.account||b.paymentMode||'Cash',linkedRecordId:expenseId,data:{description:`Expense - ${b.payee}`}}, {transaction:t});
    await DigitalOfficeAudit.create({action:'expense_create',module:'expenses',recordId:expenseId,actor:req.headers['x-office-actor']||'admin',details:{amount:b.amount}},{transaction:t});
    await t.commit(); return res.status(201).json({expenseId});
  }catch(e){await t.rollback();console.error(e);return res.status(500).json({message:'Unable to save expense workflow.'});}
});

router.get('/digital-office/audit', requireOfficeAuth, async (_req,res)=>{
  try{return res.json(await DigitalOfficeAudit.findAll({order:[['createdAt','DESC']],limit:500}));}
  catch(e){console.error(e);res.status(500).json({message:'Unable to load audit trail.'});}
});

router.get('/digital-office/reports', requireOfficeAuth, async (req,res)=>{
  try{
    const rows=await DigitalOfficeRecord.findAll({where:{status:{[Op.ne]:'deleted'}},order:[['recordDate','DESC']]});
    const from=req.query.from?new Date(req.query.from):null, to=req.query.to?new Date(req.query.to):null;
    const filtered=rows.filter(r=>(!from||new Date(r.recordDate)>=from)&&(!to||new Date(r.recordDate)<=to));
    const total=(m)=>filtered.filter(r=>r.module===m).reduce((s,r)=>s+Number(r.amount||0),0);
    const byProject={};
    filtered.filter(r=>r.module==='projects').forEach(p=>{byProject[p.recordId]={project:p.data?.name||p.recordId,amount:0};});
    filtered.filter(r=>['donations','expenses'].includes(r.module)&&r.data?.projectId).forEach(r=>{if(!byProject[r.data.projectId])byProject[r.data.projectId]={project:r.data.projectId,amount:0};byProject[r.data.projectId].amount+=(r.module==='donations'?1:-1)*Number(r.amount||0);});
    return res.json({from:req.query.from||null,to:req.query.to||null,summary:{donations:total('donations'),expenses:total('expenses'),contributions:total('contribution'),cashIn:filtered.filter(r=>r.module==='cash'&&r.direction==='in').reduce((s,r)=>s+Number(r.amount||0),0),cashOut:filtered.filter(r=>r.module==='cash'&&r.direction==='out').reduce((s,r)=>s+Number(r.amount||0),0),bankIn:filtered.filter(r=>r.module==='bank'&&r.direction==='in').reduce((s,r)=>s+Number(r.amount||0),0),bankOut:filtered.filter(r=>r.module==='bank'&&r.direction==='out').reduce((s,r)=>s+Number(r.amount||0),0)},counts:Object.fromEntries(Object.keys(prefix).map(m=>[m,filtered.filter(r=>r.module===m).length])),projectWise:Object.values(byProject),rows:filtered});
  }catch(e){console.error(e);res.status(500).json({message:'Unable to generate report.'});}
});

module.exports=router;
