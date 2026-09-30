const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const LearningCertificate = require('../models/LearningCertificate');
const Member = require('../models/Member');

const getAdminToken = () => process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
const requireAdminAuth = (req,res,next) => {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/,'').trim();
  if (!token || token !== getAdminToken()) return res.status(401).json({ message:'Unauthorized admin access' });
  next();
};

const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));

router.post('/learning-certificates/request', async (req,res) => {
  try {
    const { accountId, learner, courseId, courseTitle, completionPercent, moduleAssessments, finalAssessment, learningHours } = req.body || {};
    if (!accountId || !learner?.email || !courseId || !courseTitle) {
      return res.status(400).json({ message:'Account, learner and course details are required.' });
    }
    if (!isUuid(accountId)) {
      return res.status(400).json({ message:'The learning account could not be verified. Please log in again.' });
    }
    const member = await Member.findByPk(accountId);
    if (!member || !member.passwordHash || String(member.email).trim().toLowerCase() !== String(learner.email).trim().toLowerCase()) {
      return res.status(401).json({ message:'Learning account could not be verified. Please log in again.' });
    }
    if (Number(completionPercent) !== 100) {
      return res.status(400).json({ message:'Course completion must be 100%.' });
    }

    const assessments = moduleAssessments && typeof moduleAssessments === 'object' ? moduleAssessments : {};
    const finalPassed = finalAssessment?.passed === true;
    const modulePassed = Object.keys(assessments).length > 0 && Object.values(assessments).every(v => v?.passed === true);
    if (!finalPassed || !modulePassed) {
      return res.status(400).json({ message:'All required assessments must be passed before requesting a certificate.' });
    }

    const existing = await LearningCertificate.findOne({ where:{ accountId, courseId } });
    if (existing && ['requested','approved','issued'].includes(String(existing.status))) {
      return res.json({ status:'success', request:existing });
    }

    const hours = learningHours === null || learningHours === undefined || learningHours === '' ? null : Number(learningHours);
    if (hours !== null && (!Number.isFinite(hours) || hours < 0)) {
      return res.status(400).json({ message:'Invalid learning-hours value.' });
    }

    const request = existing
      ? await existing.update({
          learnerName:member.fullName,
          learnerEmail:member.email,
          courseTitle,
          completionPercent:100,
          learningHours:hours,
          moduleAssessments:assessments,
          finalAssessment:finalAssessment || null,
          status:'requested'
        })
      : await LearningCertificate.create({
          accountId,
          learnerName:member.fullName,
          learnerEmail:member.email,
          courseId,
          courseTitle,
          completionPercent:100,
          learningHours:hours,
          moduleAssessments:assessments,
          finalAssessment:finalAssessment || null,
          status:'requested'
        });

    return res.status(existing ? 200 : 201).json({ status:'success', request });
  } catch(error) {
    console.error('Learning certificate request error:', error);
    return res.status(500).json({ message:'Certificate request could not be saved. Please try again.' });
  }
});

router.get('/learning-certificates/verify/:certificateId', async (req,res) => {
  try {
    const record=await LearningCertificate.findOne({
      where:{ certificateId:req.params.certificateId, status:{ [Op.in]:['approved','issued'] } }
    });
    if(!record) return res.status(404).json({valid:false,message:'Certificate not found or no longer valid.'});
    return res.json({
      valid:true,
      certificateId:record.certificateId,
      learnerName:record.learnerName,
      courseTitle:record.courseTitle,
      completionPercent:record.completionPercent,
      learningHours:record.learningHours,
      issuedAt:record.certificateIssuedAt,
      status:record.status
    });
  } catch(error){
    console.error('Learning certificate verification error:', error);
    return res.status(500).json({valid:false,message:'Certificate verification service is temporarily unavailable.'});
  }
});

router.get('/admin/learning-certificates', requireAdminAuth, async (_req,res) => {
  try {
    return res.json(await LearningCertificate.findAll({order:[['createdAt','DESC']]}));
  } catch(error){
    console.error('Learning certificate admin list error:', error);
    return res.status(500).json({message:'Unable to load certificate requests.'});
  }
});

router.patch('/admin/learning-certificates/:id/approve', requireAdminAuth, async (req,res) => {
  try {
    const record=await LearningCertificate.findByPk(req.params.id);
    if(!record) return res.status(404).json({message:'Certificate request not found.'});
    if(record.status==='issued' && record.certificateId) return res.json({status:'success',certificateId:record.certificateId});

    const count=await LearningCertificate.count({where:{status:{ [Op.in]:['approved','issued'] }}});
    const now=new Date();
    const certificateId='SSF-LCERT-'+String(now.getFullYear())+'-'+String(count+1).padStart(5,'0');
    await record.update({status:'issued',certificateId,certificateIssuedAt:now});
    const frontend=(process.env.FRONTEND_URL||'https://swastiksrijan.in').replace(/\/$/,'');
    return res.json({
      status:'success',
      certificateId,
      verificationUrl:frontend+'/LearningCertificateVerify?code='+encodeURIComponent(certificateId),
      issuedAt:now
    });
  } catch(error){
    console.error('Learning certificate issue error:', error);
    return res.status(500).json({message:'Certificate could not be issued. Please try again.'});
  }
});

module.exports=router;
