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

// Default IST slot times, spread across the day so a learner meets a different
// subject each time they open the phone. Nothing here removes any existing post.
const DEFAULT_SERIES_TIMES = {
  samvidhan: '07:00',
  swasthya: '09:00',
  yojana: '11:00',
  gk: '14:00',
  'english-word': '18:00',
  prerna: '20:00',
};

const SERIES = [samvidhan, swasthya, yojana, gk, englishWord, prerna];

const seriesByKey = {};
for (const s of SERIES) seriesByKey[s.key] = s;

module.exports = { SERIES, seriesByKey, DEFAULT_SERIES_TIMES };
