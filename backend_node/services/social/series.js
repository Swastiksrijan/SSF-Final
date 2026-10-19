// Registry of the daily awareness series (one chapter per series per day).
// Additive to the existing awareness/festival and course posts. Each series is
// independently switchable from config (`seriesEnabled: { <key>: false }`) and
// its slot time from config (`seriesTimes: { <key>: 'HH:MM' }`).
const samvidhan = require('./constitutionSeries');
const yojana = require('./schemesSeries');
const swasthya = require('./healthWisdom');
const gk = require('./discussionPrompts');
const englishWord = require('./englishWordSeries');
const prerna = require('./manavMulyaSeries');
const join = require('./joinSeries');

// Default IST slot times, spread across the day so a learner meets a different
// subject each time they open the phone. Nothing here removes any existing post.
// A value may be a single 'HH:MM' or an ARRAY of 'HH:MM' — an array publishes the
// same chapter in each of those slots (e.g. Join SSF goes out morning + evening).
const DEFAULT_SERIES_TIMES = {
  samvidhan: '07:00',
  swasthya: '09:00',
  yojana: '11:00',
  gk: '14:00',
  'english-word': '18:00',
  prerna: '20:00',
  // The Join stream is the "ask": it goes out twice a day (morning + evening) so
  // the invitation is seen by both audiences.
  join: ['07:00', '19:00'],
};

// Safe default: only FOUR series are ON out of the box (the three original
// awareness streams plus Join SSF, which the foundation wants running daily).
// Flooding the account with a dozen posts/day suppresses reach, so the rest are
// shipped ready-but-OFF and can be switched on any time from the IMS Series tab
// (config `seriesEnabled`).
const DEFAULT_SERIES_ENABLED = {
  samvidhan: true,
  yojana: true,
  swasthya: true,
  gk: false,
  'english-word': false,
  prerna: false,
  join: true,
};

const SERIES = [samvidhan, swasthya, yojana, gk, englishWord, prerna, join];

const seriesByKey = {};
for (const s of SERIES) seriesByKey[s.key] = s;

module.exports = { SERIES, seriesByKey, DEFAULT_SERIES_TIMES, DEFAULT_SERIES_ENABLED };
