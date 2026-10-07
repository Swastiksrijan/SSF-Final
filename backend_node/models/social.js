// SSF Social Awareness Publisher — data model.
// One place that plans, drafts, schedules and publishes daily awareness posts
// to every social channel. Additive only: it never touches existing tables.
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JSONB = DataTypes.JSONB;
const S = { timestamps: true };

// A connected social account (one row per platform account).
const SocialChannel = sequelize.define('SocialChannel', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  platform: { type: DataTypes.STRING, unique: true }, // facebook/instagram/telegram/linkedin/whatsapp/youtube/x/website
  accountName: DataTypes.STRING,
  enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  credentials: { type: JSONB, defaultValue: {} }, // tokens / ids (never returned to the browser)
  status: { type: DataTypes.STRING, defaultValue: 'not_connected' }, // not_connected/connected/error
  lastError: DataTypes.TEXT,
  lastPublishedAt: DataTypes.DATE,
}, S);

// One generated post (two per day: morning + evening, plus on-demand extras).
const SocialPost = sequelize.define('SocialPost', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  postRef: { type: DataTypes.STRING, unique: true }, // SOCIAL-2026-0001
  postDate: { type: DataTypes.DATEONLY },
  slot: { type: DataTypes.STRING, defaultValue: 'morning' }, // morning/evening/extra
  topicKey: DataTypes.STRING,
  category: DataTypes.STRING,
  titleEn: DataTypes.TEXT,
  titleHi: DataTypes.TEXT,
  bodyEn: DataTypes.TEXT,
  bodyHi: DataTypes.TEXT,
  hashtags: DataTypes.TEXT,
  imageUrl: DataTypes.TEXT,
  kind: { type: DataTypes.STRING, defaultValue: 'awareness' }, // awareness/programme/impact/day-to-day
  status: { type: DataTypes.STRING, defaultValue: 'draft' }, // draft/scheduled/published/partial/failed/skipped
  scheduledFor: DataTypes.DATE,
  publishedAt: DataTypes.DATE,
  platformResults: { type: JSONB, defaultValue: [] }, // [{platform, ok, url, error}]
  createdBy: DataTypes.STRING,
  data: { type: JSONB, defaultValue: {} },
}, S);

// Awareness-day calendar (seeded; editable later from the IMS screen).
const SocialAwarenessDay = sequelize.define('SocialAwarenessDay', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  month: DataTypes.INTEGER,
  day: DataTypes.INTEGER,
  key: { type: DataTypes.STRING, unique: true },
  titleEn: DataTypes.TEXT,
  titleHi: DataTypes.TEXT,
  category: DataTypes.STRING,
  hashtags: DataTypes.TEXT,
  angleEn: DataTypes.TEXT,
  angleHi: DataTypes.TEXT,
}, S);

// Simple key/value settings (times, auto-approve, org wording, default hashtags).
const SocialConfig = sequelize.define('SocialConfig', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.STRING, unique: true },
  value: { type: JSONB, defaultValue: {} },
}, S);

module.exports = { sequelize, SocialChannel, SocialPost, SocialAwarenessDay, SocialConfig };
