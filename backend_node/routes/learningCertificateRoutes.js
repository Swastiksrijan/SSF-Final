const express = require('express');
const router = express.Router();
const LearningCertificate = require('../models/LearningCertificate');
const Member = require('../models/Member');

const getAdminToken = () => process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
const requireAdminAuth = (req,res,next) => {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/,'').trim();
  if (!token || token !== getAdminToken()) return res.status(401).json({ message:'Unauthorized admin access' });
  next();
};

router.post('/learning-certificates/request', async (req,res) => {
  try {
    const { accountId, learner, courseId, courseTitle, completionPercent, moduleAssessments, finalAssessment, learningHours } = req.body || {};
    if (!accountId || !learner?.email || !courseId || !courseTitle) return res.status(400).json({ message:'Account, learner and course details are required.' });
    const member = await Member.findByPk(accountId);
    if (!member || !member.passwordHash || String(member.email).toLowerCase() !== String(learner.email).toLowerCase()) return res.status(401).json({ message:'Learning account could not be verified.' });
    if (Number(completionPercent) !== 100) return res.status(400).json({ message:'Course completion must be 100%.' });
    const finalPassed = Boolean(finalAssessment?.passed);
    const modulePassed = Object.values(moduleAssessments || {}).every(v => v?.passed);
    if (!finalPassed || !modulePassed) return res.status(400).json({ message:'All required assessments must be passed before requesting a certificate.' });
    const existing = await LearningCertificate.findOne({ where:{ accountId, courseId, status:['requested','approved','issued'] } });
    if (existing) return res.json({ status:'success', request:existing });
    const request = await LearningCertificate.create({
      accountId, learnerName:member.fullName, learnerEmail:member.email, courseId, courseTitle,
      completionPercent:100, learningHours:learningHours || null, moduleAssessments:moduleAssessments || {}, finalAssessment:finalAssessment || null
    });
    res.status(201).json({ status:'success', request });
  } catch(error) { console.error('Learning certificate request error:',error); res.status(500).json({message:'Server Error'}); }
});

router.get('/learning-certificates/verify/:certificateId', async (req,res) => {
  try {
    const record=await LearningCertificate.findOne({where:{certificateId:req.params.certificateId,status:['approved','issued']}});
    if(!record) return res.status(404).json({valid:false,message:'Certificate not found or no longer valid.'});
    res.json({valid:true, certificateId:record.certificateId, learnerName:record.learnerName, courseTitle:record.courseTitle, completionPercent:record.completionPercent, learningHours:record.learningHours, issuedAt:record.certificateIssuedAt, status:record.status});
  } catch(error){ console.error(error); res.status(500).json({valid:false,message:'Server Error'}); }
});

router.get('/admin/learning-certificates', requireAdminAuth, async (_req,res) => {
  try { res.json(await LearningCertificate.findAll({order:[['createdAt','DESC']]})); }
  catch(error){ res.status(500).json({message:'Server Error'}); }
});

router.patch('/admin/learning-certificates/:id/approve', requireAdminAuth, async (req,res) => {
  try {
    const record=await LearningCertificate.findByPk(req.params.id);
    if(!record) return res.status(404).json({message:'Certificate request not found.'});
    if(record.status==='issued' && record.certificateId) return res.json({status:'success',certificateId:record.certificateId});
    const count=await LearningCertificate.count({where:{status:['approved','issued']}});
    const now=new Date();
    const certificateId='SSF-LCERT-'+String(now.getFullYear())+'-'+String(count+1).padStart(5,'0');
    await record.update({status:'issued',certificateId,certificateIssuedAt:now});
    const frontend=(process.env.FRONTEND_URL||'https://swastiksrijan.in').replace(/\/$/,'');
    res.json({status:'success',certificateId,verificationUrl:frontend+'/LearningCertificateVerify?code='+encodeURIComponent(certificateId),issuedAt:now});
  } catch(error){ console.error(error); res.status(500).json({message:'Server Error'}); }
});

module.exports=router;
