const express = require('express');
const { Op } = require('sequelize');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require('../config/database');
const DigitalOfficeRecord = require('../models/DigitalOfficeRecord');
const DigitalOfficeAudit = require('../models/DigitalOfficeAudit');
const Member = require('../models/Member');
const Volunteer = require('../models/Volunteer');
const Donor = require('../models/Donor');
const InternshipApplication = require('../models/InternshipApplication');
const FinanceTransaction = require('../models/FinanceTransaction');

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

// Member profile photos are stored in the DigitalOfficeRecord JSONB data as data URLs.
// This avoids Render's ephemeral local filesystem, so photos survive restarts/redeploys.
const memberPhotoUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (new Set(['image/jpeg','image/png','image/webp']).has(file.mimetype)) return cb(null, true);
    return cb(new Error('Profile photo must be JPG, PNG or WebP.'));
  },
  limits: { fileSize: 2 * 1024 * 1024, files: 1 }
});

const prefix = { members:'MEM', volunteers:'VOL', donors:'DON', donations:'DNT', internships:'INT', beneficiaries:'BEN', events:'EVT', projects:'PRJ', documents:'DOC', expenses:'EXP', contribution:'CON', cash:'CSH', bank:'BNK', ledger:'LED', inward:'INW', outward:'OUT', meetings:'MTG', activities:'ACT', notifications:'NTF', users:'USR', inventory:'STK', assets:'AST', mou:'MOU', certificates:'CERT', idcards:'ID', chartOfAccounts:'COA', fyMaster:'FY', sahyog:'SYG', fundMaster:'FND', pettyCash:'PCT', grant:'GRN', transfer:'TRF', adjustment:'ADJ', auditedStatements:'AUD', auditObservations:'AOB', statutoryRegistrations:'REG', taxReturns:'TAX', form10bd:'10BD', depreciation:'DEP', corpusFund:'CRP', fundClassification:'FCL', procurement:'PRC', payroll:'PAY', honorarium:'HON', fundUtilisation:'FUT', fcra:'FCRA', donor80g:'80G', complianceCalendar:'CAL', legalCase:'LEG', propertyLease:'PRP', relatedParty:'RPT', licence:'LIC', agmMinutes:'AGM', ecMinutes:'ECM', resolution:'RES', delegation:'DOA', policy:'POL', memberRegister:'MBR', officeBearer:'OBR', donorMaster:'DMR', grantAgreement:'GRA', utilisationCertificate:'UC', donorReporting:'DRC', foreignDonor:'FDR', segregationOfDuties:'SOD', makerChecker:'MKC', accessLog:'ACL', whistleblower:'WBL', risk:'RSK', incomeExpenditure:'IEA', balanceSheet:'BS', trialBalance:'TB', corpusDonation:'CRD', inKind:'INK', csrFund:'CSR', interestIncome:'IIN', eventIncome:'EVI', anonymousDonation:'AND', fundWiseIncome:'FWI', pledge:'PLG', paymentVoucher:'PV', rent:'RNT', programmeExpense:'PEX', travel:'TRV', advance:'ADV', capitalExpenditure:'CAP', bankCharges:'BCH', securityDeposit:'SDP', creditors:'CRT', debtors:'DBT', reserveFund:'RSF', contingentLiability:'CTL', physicalVerification:'PHV', insurance:'INS', bankAccountMaster:'BAM', chequeIssue:'CHQ', chequeBook:'CBK', signatoryAuthority:'SGN', fdReceipt:'FD', budgetRevision:'BGR', cashFlow:'CFS', variance:'VAR', internalAudit:'INA', managementResponse:'MGR', employeeMaster:'EMP', attendance:'ATT', volunteerIntern:'VIN', reimbursementAdvance:'RMA', partyMaster:'PTY', costCentre:'CC', documentIndex:'DOCX' };
const _norm = (s) => String(s == null ? '' : s).toLowerCase().replace(/\s+/g, ' ').trim();
const _day = (d) => { try { return new Date(d).toISOString().slice(0, 10); } catch (_) { return String(d || '').slice(0, 10); } };
// Strong duplicate probe shared by the money workflows: same party + amount + day.
const findMoneyDuplicate = async (module, amount, day, partyField, partyValue, transaction) => {
  const recent = await DigitalOfficeRecord.findAll({ where: { module, status: { [Op.ne]: 'deleted' } }, order: [['createdAt', 'DESC']], limit: 500, transaction });
  return recent.find((x) => Number(x.amount) === Number(amount) && _day(x.recordDate) === day && _norm(x.data && x.data[partyField]) === _norm(partyValue)) || null;
};
const makeId = async (module, transaction) => {
  const p = prefix[module] || 'REC';
  const stamp = new Date().toISOString().slice(0,10).replace(/-/g,'');
  let sequence = (await DigitalOfficeRecord.count({ where: { module }, transaction })) + 1;
  let candidate = `SSF-${p}-${stamp}-${String(sequence).padStart(5,'0')}`;
  while (await DigitalOfficeRecord.findOne({ where: { recordId: candidate }, attributes: ['id'], transaction })) {
    sequence += 1;
    candidate = `SSF-${p}-${stamp}-${String(sequence).padStart(5,'0')}`;
  }
  return candidate;
};
// Canonical transaction id: FIN-YYYY-NNNNNN (financial year of the date).
const _fyOf = (value) => {
  const s = String(value || '').slice(0, 10);
  const y = Number(s.slice(0, 4)), m = Number(s.slice(5, 7));
  if (!y || !m) return '';
  const start = m >= 4 ? y : y - 1;
  return start + '-' + String((start + 1) % 100).padStart(2, '0');
};
const makeFinId = async (fy, t) => {
  const last = await FinanceTransaction.findOne({ where: { transactionId: { [Op.like]: 'FIN-' + fy + '-%' } }, order: [['transactionId', 'DESC']], transaction: t });
  let seq = last ? parseInt(String(last.transactionId).replace(/^.*-/, ''), 10) + 1 : 1;
  if (!isFinite(seq) || seq < 1) seq = 1;
  let candidate = 'FIN-' + fy + '-' + String(seq).padStart(6, '0');
  while (await FinanceTransaction.findOne({ where: { transactionId: candidate }, attributes: ['id'], transaction: t })) {
    seq += 1; candidate = 'FIN-' + fy + '-' + String(seq).padStart(6, '0');
  }
  return candidate;
};
const audit = async (action, module, recordId, req, details={}) => {
  await DigitalOfficeAudit.create({ action, module, recordId, actor: req.headers['x-office-actor'] || 'admin', details });
};


router.post('/digital-office/member-photo', requireOfficeAuth, (req, res) => {
  memberPhotoUpload.single('profilePhoto')(req, res, async (error) => {
    if (error) return res.status(400).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'Profile photo must be 2MB or smaller.' : (error.message || 'Unable to upload profile photo.') });
    const file = req.file;
    try {
      const memberId = String(req.body.memberId || '').trim();
      const recordId = String(req.body.recordId || '').trim();
      const sourceModule = String(req.body.sourceModule || 'members').trim();
      if (!memberId || !/^SSF-MBR-\d{5}$/i.test(memberId)) {
        return res.status(400).json({ message: 'Valid SSF Member ID is required.' });
      }
      if (!file?.buffer) {
        return res.status(400).json({ message: 'Profile photo file is required.' });
      }

      // Persist the actual image bytes in PostgreSQL JSONB. The frontend already
      // supports data:image/... URLs, so no filesystem or external storage is needed.
      const photoUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      let row = null;
      // The frontend may send either the database row id or the public recordId.
      if (recordId) {
        row = await DigitalOfficeRecord.findOne({ where: { recordId, status: { [Op.ne]: 'deleted' } } });
        if (!row) {
          row = await DigitalOfficeRecord.findOne({ where: { id: recordId, status: { [Op.ne]: 'deleted' } } });
        }
      }
      if (!row) {
        const candidates = await DigitalOfficeRecord.findAll({
          where: { module: sourceModule, status: { [Op.ne]: 'deleted' } },
          order: [['updatedAt','DESC']]
        });
        row = candidates.find(x => String(x.data?.memberId || '').toUpperCase() === memberId.toUpperCase()) || null;
      }
      if (!row && sourceModule === 'members') {
        return res.status(404).json({ message: 'Member master record not found. Save the Member Register record before uploading a photo.' });
      } else if (row) {
        row.data = Object.assign({}, row.data || {}, { photoUrl });
        await row.save();
      } else {
        return res.status(404).json({ message: 'Member master record not found. Save the member record first.' });
      }

      await audit('UPDATE', row.module, row.recordId, req, {
        field: 'photoUrl',
        memberId,
        storage: 'database'
      });
      return res.json({ message: 'Member photo updated successfully.', photoUrl, recordId: row.recordId, module: row.module });
    } catch (e) {
      console.error('Digital Office member photo upload error:', e);
      return res.status(500).json({ message: 'Unable to save member photo.' });
    }
  });
});

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
          await transporter.sendMail({from:process.env.EMAIL_FROM||process.env.EMAIL_USER,to,subject:'SSF Online Meeting: '+title,text:'Swastik Srijan Foundation Samiti\
\
Online Meeting: '+title+'\
Date: '+date+'\
Time: '+time+'\
Agenda: '+(agenda||'As per meeting notice')+'\
\
Join Meeting: '+meetingLink+'\
\
Please join using the link above.'});
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
            text:'Swastik Srijan Foundation Samiti\
\
Online Meeting: '+title+'\
Date: '+date+'\
Time: '+time+'\
Agenda: '+(agenda||'As per meeting notice')+'\
\
Join Meeting: '+meetingLink+'\
\
Please join using the link above.'
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
    // Website sign-up accounts are not official members. Keep them out of the Members Register count.
    const [memberCount, volunteerCount, donorCount, internshipCount] = await Promise.all([
      Member.count({ where: { memberType: { [Op.ne]: 'website_signup' } } }),
      Volunteer.count(), Donor.count(), InternshipApplication.count()
    ]);
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
      workflow: { pending, activeMous: rows.filter(r=>r.module==='mou' && String(r.status||'').toLowerCase()==='active').length, upcomingMeetings: rows.filter(r=>r.module==='meetings' && new Date(r.recordDate)>=new Date()).length, meetingCalendar: count('meetings'), onlineMeetings: count('onlineMeetings'), meetingResolutions: count('meetingResolutions'), totalMeetings: count('meetings') + count('onlineMeetings') + count('meetingResolutions') },
      recent: rows.slice(0,20)
    });
  } catch (e) { console.error(e); res.status(500).json({message:'Unable to load Digital Office summary.'}); }
});

router.get('/digital-office/archived-records', requireOfficeAuth, async (req, res) => {
  try {
    const where = { status: 'deleted' };
    if (req.query.module) where.module = String(req.query.module);
    const rows = await DigitalOfficeRecord.findAll({ where, order: [['recordDate','DESC'],['updatedAt','DESC']] });
    return res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({message:'Unable to load archived records.'}); }
});

router.get('/digital-office/records', requireOfficeAuth, async (req, res) => {
  try {
    const where = {};
    if (String(req.query.includeArchived || '') === '1') where.status = 'deleted';
    else where.status = { [Op.ne]: 'deleted' };
    if (req.query.module) where.module = String(req.query.module);
    if (req.query.search) where[Op.or] = [
      { recordId: { [Op.iLike]: '%' + String(req.query.search) + '%' } },
      { personId: { [Op.iLike]: '%' + String(req.query.search) + '%' } }
    ];

    let rows = await DigitalOfficeRecord.findAll({ where, order: [['recordDate','DESC'],['createdAt','DESC']] });

    // IMPORTANT: The official Member Register is a Digital Office master register.
    // Website login/signup accounts are a separate identity system and must NEVER
    // be mapped into this endpoint. This prevents a website account from replacing
    // or changing the official Member Register.
    if (String(req.query.module || '') === 'members') {
      const officeMembers = await DigitalOfficeRecord.findAll({
        where: { module:'members', status:{ [Op.ne]:'deleted' } },
        order: [['updatedAt','DESC'],['createdAt','DESC']]
      });
      const unique = new Map();
      officeMembers.forEach(row => {
        const d = row.data || {};
        const key = String(d.memberId || row.recordId || row.id).trim().toUpperCase();
        if (key && !unique.has(key)) unique.set(key, row);
      });
      rows = Array.from(unique.values());
    } else if (['volunteers','donors','internships'].includes(String(req.query.module || ''))) {
      const m = String(req.query.module);
      if (m === 'volunteers') {
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
const APPROVED_MANAGING_COMMITTEE_MEMBER_IDS = new Set([
  'SSF-MBR-00001','SSF-MBR-00014','SSF-MBR-00002','SSF-MBR-00003','SSF-MBR-00004',
  'SSF-MBR-00015','SSF-MBR-00016','SSF-MBR-00017','SSF-MBR-00018'
]);

const validateMemberIdForDigitalOffice = async (memberId, currentId=null) => {
  const value = String(memberId || '').trim();
  if (!value) return { ok: true, value: '' };
  if (!/^SSF-MBR-\d{5}$/i.test(value)) {
    return { ok: false, message: 'Invalid Member ID. Use the registered SSF Member ID format, e.g. SSF-MBR-00001.' };
  }

  const masterRows = await DigitalOfficeRecord.findAll({
    where: { module: 'members' },
    attributes: ['id','recordId','status','data']
  });
  const managingRows = await DigitalOfficeRecord.findAll({
    where: { module: 'managingCommittee', status: { [Op.ne]: 'deleted' } },
    attributes: ['id','recordId','status','data']
  });
  const websiteMembers = await Member.findAll({ attributes: ['id','memberId','status'] });

  const matches = masterRows.filter(row =>
    String(row.data?.memberId || '').trim().toLowerCase() === value.toLowerCase()
  );
  const committeeMatches = managingRows.filter(row =>
    String(row.data?.memberId || '').trim().toLowerCase() === value.toLowerCase()
  );
  const accountMatches = websiteMembers.filter(row =>
    String(row.memberId || '').trim().toLowerCase() === value.toLowerCase()
  );

  if (currentId === '__reference__') {
    if (APPROVED_MANAGING_COMMITTEE_MEMBER_IDS.has(value.toUpperCase())) return { ok: true, value };
    if (!matches.length && !committeeMatches.length && !accountMatches.length) {
      return { ok: false, message: 'Member ID not found in SSF member records. Select a valid registered SSF Member ID.' };
    }
    return { ok: true, value };
  }

  const duplicateMaster = matches.find(row => String(row.id) !== String(currentId || ''));
  // Website Member accounts may already use the same official SSF Member ID. They are
  // the identity source, not duplicate Digital Office member-register records.
  if (duplicateMaster) {
    return { ok: false, message: 'This Member ID is already registered. A duplicate Member ID cannot be created.' };
  }

  return { ok: true, value };
};

router.post('/digital-office/records', requireOfficeAuth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const body = req.body || {};
    if (!body.module) { await t.rollback(); return res.status(400).json({message:'module is required'}); }
    const incomingMemberId = body.data && typeof body.data === 'object' ? String(body.data.memberId || '').trim() : '';
    if (incomingMemberId && body.module === 'members') {
      const memberCheck = await validateMemberIdForDigitalOffice(incomingMemberId, null);
      if (!memberCheck.ok) { await t.rollback(); return res.status(409).json({message: memberCheck.message}); }
    }
    if (incomingMemberId && body.module !== 'members') {
      if (!/^SSF-MBR-\d{5}$/i.test(incomingMemberId)) {
        await t.rollback();
        return res.status(400).json({message:'Invalid Member ID. Use the registered SSF Member ID format, e.g. SSF-MBR-00001.'});
      }
    }
    if (incomingMemberId && body.module !== 'members') {
      const memberReferenceCheck = await validateMemberIdForDigitalOffice(incomingMemberId, '__reference__');
      if (!memberReferenceCheck.ok) { await t.rollback(); return res.status(409).json({message: memberReferenceCheck.message}); }
    }
    let existingMeeting = null;
    if (body.module === 'meetingResolutions' && body.data && typeof body.data === 'object') {
      const incoming = body.data;
      const title = String(incoming.meetingTitle || '').trim();
      const titleKey = title.toLowerCase();
      const date = String(incoming.meetingDate || body.recordDate || '').slice(0,10);
      const start = String(incoming.startTime || '').trim();
      const onlineId = String(incoming.onlineMeetingId || '').trim();
      if (title && date) {
        // Serialize every save for the same meeting identity. This closes the race where
        // two POSTs arrive together and both pass the duplicate check before either commits.
        const lockKey = ["meetingResolutions", titleKey, date, start || "*", onlineId || "*"].join("|");
        await sequelize.query(
          "SELECT pg_advisory_xact_lock(hashtext(:lockKey))",
          { replacements: { lockKey }, transaction: t }
        );
        const candidates = await DigitalOfficeRecord.findAll({
          where: { module: 'meetingResolutions', status: { [Op.ne]: 'deleted' } },
          order: [['updatedAt','DESC']]
        });
        existingMeeting = candidates.find(x => {
          const d = x.data || {};
          const savedTitle = String(d.meetingTitle || '').trim().toLowerCase();
          const savedDate = String(d.meetingDate || x.recordDate || '').slice(0,10);
          const savedStart = String(d.startTime || '').trim();
          const savedOnlineId = String(d.onlineMeetingId || '').trim();
          const sameTitle = savedTitle === titleKey;
          const sameDate = savedDate === date;
          const sameTime = start ? savedStart === start : !savedStart;
          const sameOnlineId = onlineId && savedOnlineId && onlineId === savedOnlineId;
          return sameTitle && sameDate && (sameOnlineId || sameTime);
        }) || null;
      }
    }
    if (existingMeeting) {
      existingMeeting.recordType = body.recordType || existingMeeting.recordType;
      existingMeeting.status = body.status || 'active';
      existingMeeting.recordDate = body.recordDate || existingMeeting.recordDate;
      existingMeeting.data = body.data || existingMeeting.data || {};
      await existingMeeting.save({ transaction: t });
      await DigitalOfficeAudit.create({ action:'update', module:body.module, recordId:existingMeeting.recordId, actor:req.headers['x-office-actor'] || 'admin', details:{deduplicatedSave:true} }, {transaction:t});
      await t.commit();
      return res.status(200).json(existingMeeting);
    }
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
    const incomingData = req.body.data && typeof req.body.data === 'object' ? req.body.data : row.data || {};
    const incomingMemberId = String(incomingData.memberId || '').trim();
    if (incomingMemberId && row.module === 'members') {
      const memberCheck = await validateMemberIdForDigitalOffice(incomingMemberId, row.id);
      if (!memberCheck.ok) return res.status(409).json({message: memberCheck.message});
    }
    if (incomingMemberId && !/^SSF-MBR-\d{5}$/i.test(incomingMemberId)) {
      return res.status(400).json({message:'Invalid Member ID. Use the registered SSF Member ID format, e.g. SSF-MBR-00001.'});
    }
    if (incomingMemberId && row.module !== 'members') {
      const memberReferenceCheck = await validateMemberIdForDigitalOffice(incomingMemberId, '__reference__');
      if (!memberReferenceCheck.ok) return res.status(409).json({message: memberReferenceCheck.message});
    }
    const allowed = ['recordType','status','recordDate','amount','paymentMode','direction','account','linkedRecordId','personId','data'];
    const before = {}; allowed.forEach(k => { before[k] = row[k]; });
    allowed.forEach(k => { if (Object.prototype.hasOwnProperty.call(req.body,k)) row[k] = req.body[k]; });
    await row.save();
    await audit('update', row.module, row.recordId, req, { fields:Object.keys(req.body), before });
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

router.delete('/digital-office/records/:id/permanent', requireOfficeAuth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const row = await DigitalOfficeRecord.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!row) { await t.rollback(); return res.status(404).json({message:'Record not found.'}); }
    if (row.status !== 'deleted') { await t.rollback(); return res.status(400).json({message:'Only archived records can be permanently deleted.'}); }
    await DigitalOfficeAudit.create({
      action:'permanent_delete',
      module:row.module,
      recordId:row.recordId,
      actor:req.headers['x-office-actor'] || 'admin',
      details:{permanentDelete:true}
    }, {transaction:t});
    await row.destroy({ transaction:t });
    await t.commit();
    return res.json({status:'success', recordId:row.recordId});
  } catch (e) {
    try { await t.rollback(); } catch (_) {}
    console.error('Digital Office permanent delete failed:', e);
    return res.status(500).json({message:'Unable to permanently delete record.'});
  }
});

router.post('/digital-office/donations', requireOfficeAuth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const b=req.body||{}; if(!b.donorName || !b.amount) { await t.rollback(); return res.status(400).json({message:'Donor name and amount are required.'}); }
    if(!b.allowDuplicate){
      const dupe=await findMoneyDuplicate('donations',b.amount,String(b.date||new Date().toISOString().slice(0,10)),'donorName',b.donorName,t);
      if(dupe){ await t.rollback(); return res.status(409).json({duplicate:true,message:'Possible duplicate donation.',existing:{recordId:dupe.recordId,amount:dupe.amount,date:_day(dupe.recordDate),donorName:(dupe.data||{}).donorName,receiptNo:(dupe.data||{}).receiptNo}}); }
    }
    const donationId=await makeId('donations');
    const donorId=b.donorId || await makeId('donors');
    const paid=['paid','offline','received'].includes(String(b.paymentStatus||'paid').toLowerCase());
    const txDate=b.date||new Date();
    const fy=_fyOf(txDate);
    const transactionId=await makeFinId(fy,t);
    const mode=b.paymentMode||'Cash';
    const bookModule=String(mode).toLowerCase()==='cash'?'cash':'bank';
    const linked=[
      {module:'donations',recordId:donationId},
      {module:'donors',recordId:donorId},
      {module:bookModule,recordId:null},
      {module:'ledger',recordId:null}
    ];
    await FinanceTransaction.create({transactionId,financialYear:fy,transactionDate:txDate,transactionType:'donation',amount:Number(b.amount),direction:'in',paymentMode:mode,accountId:b.account||mode,donorId,partyId:donorId,receiptId:donationId,referenceNumber:b.receiptNo||null,sourceModule:'donations',sourceRecordId:donationId,linkedRecords:linked,createdBy:req.headers['x-office-actor']||'admin',createdByName:req.headers['x-office-actor-name']||'SSF Admin',data:{donorName:b.donorName,purpose:b.purpose||'General donation'}},{transaction:t});
    await DigitalOfficeRecord.create({recordId:donorId,module:'donors',recordDate:txDate,personId:b.personId||null,data:{fullName:b.donorName,email:b.email||'',phone:b.phone||'',pan:b.pan||'',address:b.address||''}}, {transaction:t});
    const donation=await DigitalOfficeRecord.create({recordId:donationId,module:'donations',recordType:'donation',recordDate:txDate,amount:Number(b.amount),paymentMode:mode,account:b.account||mode,personId:b.personId||null,data:{donorId,donorName:b.donorName,purpose:b.purpose||'General donation',paymentStatus:b.paymentStatus||'paid',receiptNo:b.receiptNo||donationId,transactionId,pan:b.pan||'',address:b.address||'',email:b.email||'',notes:b.notes||''}}, {transaction:t});
    await DigitalOfficeRecord.create({recordId:await makeId('contribution'),module:'contribution',recordType:'donation',recordDate:txDate,amount:Number(b.amount),paymentMode:mode,account:b.account||'Cash',linkedRecordId:donationId,data:{source:'donation',donorId,transactionId}}, {transaction:t});
    if(paid){
      const ledgerId=await makeId('ledger');
      await DigitalOfficeRecord.create({recordId:ledgerId,module:'ledger',recordType:'donation',recordDate:txDate,amount:Number(b.amount),direction:'credit',account:b.account||mode,linkedRecordId:donationId,data:{description:`Donation from ${b.donorName}`,transactionId}}, {transaction:t});
      const bookId=await makeId(bookModule);
      await DigitalOfficeRecord.create({recordId:bookId,module:bookModule,recordType:'receipt',recordDate:txDate,amount:Number(b.amount),direction:'in',account:b.account||mode,linkedRecordId:donationId,data:{description:`Donation from ${b.donorName}`,transactionId}}, {transaction:t});
    }
    await DigitalOfficeAudit.create({action:'donation_create',module:'donations',recordId:donationId,actor:req.headers['x-office-actor']||'admin',details:{donorId,amount:b.amount,transactionId,paymentStatus:b.paymentStatus||'paid'}},{transaction:t});
    await t.commit(); return res.status(201).json({donationId,donorId,receiptId:donationId,transactionId});
  } catch(e){await t.rollback();console.error(e);return res.status(500).json({message:'Unable to save donation workflow.'});}
});

router.post('/digital-office/expenses', requireOfficeAuth, async (req,res)=>{
  const t=await sequelize.transaction();
  try{
    const b=req.body||{}; if(!b.payee || !b.amount){await t.rollback();return res.status(400).json({message:'Payee and amount are required.'});}
    if(!b.allowDuplicate){
      const dupe=await findMoneyDuplicate('expenses',b.amount,String(b.date||new Date().toISOString().slice(0,10)),'payee',b.payee,t);
      if(dupe){await t.rollback();return res.status(409).json({duplicate:true,message:'Possible duplicate expense.',existing:{recordId:dupe.recordId,amount:dupe.amount,date:_day(dupe.recordDate),payee:(dupe.data||{}).payee,category:(dupe.data||{}).category}});}
    }
    const expenseId=await makeId('expenses');
    const txDate=b.date||new Date();
    const fy=_fyOf(txDate);
    const transactionId=await makeFinId(fy,t);
    const mode=b.paymentMode||'Cash';
    const bookModule=String(mode).toLowerCase()==='cash'?'cash':'bank';
    await FinanceTransaction.create({transactionId,financialYear:fy,transactionDate:txDate,transactionType:'expense',amount:Number(b.amount),direction:'out',paymentMode:mode,accountId:b.account||mode,partyId:b.payee,projectId:b.projectId||null,sourceModule:'expenses',sourceRecordId:expenseId,linkedRecords:[{module:'expenses',recordId:expenseId},{module:bookModule,recordId:null},{module:'ledger',recordId:null}],createdBy:req.headers['x-office-actor']||'admin',createdByName:req.headers['x-office-actor-name']||'SSF Admin',data:{payee:b.payee,category:b.category||'General'}},{transaction:t});
    await DigitalOfficeRecord.create({recordId:expenseId,module:'expenses',recordType:b.category||'general',recordDate:txDate,amount:Number(b.amount),paymentMode:mode,account:b.account||mode,data:{payee:b.payee,category:b.category||'General',purpose:b.purpose||'',billNo:b.billNo||'',notes:b.notes||'',transactionId}}, {transaction:t});
    await DigitalOfficeRecord.create({recordId:await makeId('ledger'),module:'ledger',recordType:'expense',recordDate:txDate,amount:Number(b.amount),direction:'debit',account:b.account||mode,linkedRecordId:expenseId,data:{description:`Expense - ${b.payee}`,transactionId}}, {transaction:t});
    const bookId=await makeId(bookModule);
    await DigitalOfficeRecord.create({recordId:bookId,module:bookModule,recordType:'payment',recordDate:txDate,amount:Number(b.amount),direction:'out',account:b.account||mode,linkedRecordId:expenseId,data:{description:`Expense - ${b.payee}`,transactionId}}, {transaction:t});
    await DigitalOfficeAudit.create({action:'expense_create',module:'expenses',recordId:expenseId,actor:req.headers['x-office-actor']||'admin',details:{amount:b.amount,transactionId}},{transaction:t});
    await t.commit(); return res.status(201).json({expenseId,transactionId});
  }catch(e){await t.rollback();console.error(e);return res.status(500).json({message:'Unable to save expense workflow.'});}
});

// ---- Chart of Accounts (COA) seed ------------------------------------------
// Idempotent: creates any missing head master rows from data/chartOfAccounts.json.
// Re-running never duplicates — matched on the permanent head code.
router.post('/digital-office/chart-of-accounts/seed', requireOfficeAuth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let coa;
    try { coa = require('../data/chartOfAccounts.json'); }
    catch (_) { await t.rollback(); return res.status(404).json({ message: 'chartOfAccounts.json not found.' }); }
    const existing = await DigitalOfficeRecord.findAll({ where: { module: 'chartOfAccounts' }, transaction: t });
    // Include archived heads too: an archived head must never be resurrected by a re-seed.
    const have = new Set(existing.map((r) => String(r.data && r.data.code || '').toUpperCase()));
    let created = 0;
    for (const h of (coa.heads || [])) {
      if (have.has(String(h.code).toUpperCase())) continue;
      const recordId = await makeId('chartOfAccounts', t);
      await DigitalOfficeRecord.create({
        recordId, module: 'chartOfAccounts', recordType: h.type || 'head', status: 'active',
        recordDate: new Date(), personId: null, createdBy: req.headers['x-office-actor'] || 'admin',
        createdByName: req.headers['x-office-actor-name'] || 'SSF Admin',
        data: { code: h.code, nameEn: h.nameEn, nameHi: h.nameHi, type: h.type, group: h.group, status: 'Active', effectiveDate: new Date().toISOString().slice(0, 10), remarks: 'Seeded from SSF Chart of Accounts' }
      }, { transaction: t });
      created += 1;
    }
    await DigitalOfficeAudit.create({ action: 'seed', module: 'chartOfAccounts', recordId: 'COA', actor: req.headers['x-office-actor'] || 'admin', details: { created } }, { transaction: t });
    await t.commit();
    return res.json({ status: 'ok', created, skipped: (coa.heads || []).length - created });
  } catch (e) {
    try { await t.rollback(); } catch (_) {}
    console.error('COA seed failed:', e);
    return res.status(500).json({ message: 'COA seed failed.', detail: e.message });
  }
});

// ---- FY Master + Opening Balance seed ---------------------------------------
// Builds the financial-year master and its opening balances from the canonical
// audited dataset. Idempotent — matched on FY; a re-seed never duplicates.
// Opening = the previous audited year's closing (cash / bank / general fund).
router.post('/digital-office/fy-master/seed', requireOfficeAuth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let audit;
    try { audit = require('../data/auditReports.json'); }
    catch (_) { await t.rollback(); return res.status(404).json({ message: 'auditReports.json not found.' }); }
    const reports = [...(audit.reports || [])].sort((a, b) => String(a.financialYear).localeCompare(String(b.financialYear)));
    const existing = await DigitalOfficeRecord.findAll({ where: { module: 'fyMaster' }, transaction: t });
    const have = new Set(existing.map((r) => String((r.data && r.data.fy) || '').trim()));
    let created = 0;
    const fyEndDate = (fy) => { const [a, b] = String(fy).split('-'); const endY = 2000 + Number(b); return endY + '-03-31'; };
    const carryRows = [];
    for (const rep of reports) {
      const fy = rep.financialYear;
      const ob = rep.openingBalances || {};
      const cb = rep.closingBalances || {};
      const gf = rep.generalFund || {};
      carryRows.push({ fy, source: 'opening', opening: { cash: ob.cash || 0, bank: ob.bank || 0, total: ob.total || 0 }, closing: { cash: cb.cash || 0, bank: cb.bank || 0, total: cb.total || 0 }, generalFund: gf, status: rep.status || 'Audited', auditor: rep.auditor || null });
    }
    // The FY immediately after the last audited year opens with that year's closing.
    const last = reports[reports.length - 1];
    if (last) {
      const [a, b] = String(last.financialYear).split('-');
      const nextStart = 2000 + Number(b);
      const nextFy = nextStart + '-' + String((nextStart + 1) % 100).padStart(2, '0');
      const cb = last.closingBalances || {};
      carryRows.push({ fy: nextFy, source: 'opening', opening: { cash: cb.cash || 0, bank: cb.bank || 0, total: cb.total || 0 }, closing: null, generalFund: { opening: (last.generalFund || {}).closing || 0 }, status: 'Books', auditor: null });
    }
    for (const row of carryRows) {
      if (have.has(row.fy)) continue;
      const recordId = await makeId('fyMaster', t);
      await DigitalOfficeRecord.create({
        recordId, module: 'fyMaster', recordType: 'Financial Year', status: 'active',
        recordDate: new Date(fyEndDate(row.fy)), personId: null,
        createdBy: req.headers['x-office-actor'] || 'admin', createdByName: req.headers['x-office-actor-name'] || 'SSF Admin',
        data: {
          fy: row.fy,
          labelEn: 'Financial Year ' + row.fy,
          labelHi: 'वित्तीय वर्ष ' + row.fy,
          openingCash: row.opening.cash, openingBank: row.opening.bank, openingTotal: row.opening.total,
          closingCash: row.closing ? row.closing.cash : null, closingBank: row.closing ? row.closing.bank : null, closingTotal: row.closing ? row.closing.total : null,
          generalFundOpening: (row.generalFund || {}).opening || null, generalFundClosing: (row.generalFund || {}).closing || null,
          carrySource: 'Audited closing of previous year',
          fyStatus: row.status, lockState: 'Open',
          auditor: row.auditor ? (row.auditor.firm || '') : '',
          effectiveDate: fyEndDate(row.fy), remarks: 'Seeded from audited dataset'
        }
      }, { transaction: t });
      created += 1;
    }
    await DigitalOfficeAudit.create({ action: 'seed', module: 'fyMaster', recordId: 'FYMASTER', actor: req.headers['x-office-actor'] || 'admin', details: { created } }, { transaction: t });
    await t.commit();
    return res.json({ status: 'ok', created, skipped: carryRows.length - created });
  } catch (e) {
    try { await t.rollback(); } catch (_) {}
    console.error('FY master seed failed:', e);
    return res.status(500).json({ message: 'FY master seed failed.', detail: e.message });
  }
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
