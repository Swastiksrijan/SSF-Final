// SSF Volunteer & Chapters — Pan-India network workspace.
// Shows how the volunteer network is spread across states/districts/blocks, the
// leadership ladder, what work is assigned vs done, and funds raised vs needed.
// Read-only overview over real IMS data; records are managed in their registers.
import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import ImsLayout from '../ImsLayout';
import { Card, SectionHero, Button, Spinner } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

const LEVEL_STYLE = {
  state: 'bg-purple-50 text-purple-700 ring-purple-100',
  district: 'bg-blue-50 text-blue-700 ring-blue-100',
  block: 'bg-teal-50 text-teal-700 ring-teal-100',
};

function Metric({ icon, en, hi, value, tone = 'text-[#002344]' }) {
  const { lang } = useLang();
  const I = Icons[icon] || Icons.Activity;
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-[#002344]"><I size={18} /></span>
        <div className="min-w-0">
          <div className={`text-2xl font-black leading-none ${tone}`}>{value}</div>
          <div className="mt-1 truncate text-[11px] font-semibold text-slate-500">{lang === 'hi' ? hi : en}</div>
        </div>
      </div>
    </Card>
  );
}

const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

export default function ImsVolunteerNetwork() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const hi = lang === 'hi';

  useEffect(() => {
    ims.volunteerNetwork().then(setData).catch((e) => setErr(e.message));
  }, []);

  const s = data && data.summary;

  return (
    <ImsLayout active="volunteer_network">
      <SectionHero
        eyebrow={hi ? 'स्वयंसेवक' : 'Volunteers'}
        title={hi ? 'स्वयंसेवक एवं अध्याय' : 'Volunteer & Chapters'}
        hi={hi ? undefined : 'स्वयंसेवक एवं अध्याय'}
        icon="HandHeart"
        tone="teal"
        actions={
          <>
            <Button variant="hero" icon="Users" onClick={() => navigate({ to: '/ims/r/$resource', params: { resource: 'chapters' } })}>{hi ? 'अध्याय' : 'Chapters'}</Button>
            <Button variant="hero" icon="ListChecks" onClick={() => navigate({ to: '/ims/r/$resource', params: { resource: 'volunteerTasks' } })}>{hi ? 'कार्य' : 'Tasks'}</Button>
            <Button variant="hero" icon="HandCoins" onClick={() => navigate({ to: '/ims/r/$resource', params: { resource: 'volunteerFunds' } })}>{hi ? 'निधि' : 'Funds'}</Button>
          </>
        }
      >
        <p className="max-w-2xl text-sm text-white/85">
          {hi
            ? 'पूरे भारत में अध्याय, नेतृत्व, कार्य और निधि — एक जगह से। “काम दिखे तो रुचि बने, धन आए तो काम दिखे।”'
            : 'Chapters, leadership, tasks and funds across India — in one place. “See the work, grow the interest; raise the funds, show the work.”'}
        </p>
      </SectionHero>

      {err && <Card className="mb-4 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</Card>}
      {!data && !err && <Spinner />}

      {data && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
            <Metric icon="MapPin" en="States" hi="राज्य" value={s.states} tone="text-purple-600" />
            <Metric icon="Landmark" en="Districts" hi="जिले" value={s.districts} />
            <Metric icon="Flag" en="Chapters" hi="अध्याय" value={s.chapters} />
            <Metric icon="Users" en="Members" hi="सदस्य" value={s.members} />
            <Metric icon="UserCog" en="Leaders" hi="नेतृत्व" value={s.leaders} tone="text-[#FF6600]" />
            <Metric icon="CheckCircle2" en="Tasks done" hi="पूर्ण कार्य" value={s.tasksDone} tone="text-emerald-600" />
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-3">
            <Card className="p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{hi ? 'निधि एकत्र' : 'Funds raised'}</div>
              <div className="mt-1 text-2xl font-black text-emerald-600">{inr(s.fundsRaised)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{hi ? 'कार्य हेतु आवश्यक' : 'Funds required'}</div>
              <div className="mt-1 text-2xl font-black text-[#002344]">{inr(s.fundTarget)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{hi ? 'खुले कार्य' : 'Open tasks'}</div>
              <div className="mt-1 text-2xl font-black text-amber-600">{s.tasksPending + s.tasksActive}</div>
            </Card>
          </div>

          {/* Chapters */}
          <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-500">{hi ? 'अध्याय (राज्य → जिला → ब्लॉक)' : 'Chapters (State → District → Block)'}</h2>
          <Card className="mb-6 overflow-hidden">
            {data.perChapter.length === 0 && <div className="p-6 text-center text-sm text-slate-400">{hi ? 'अभी कोई अध्याय दर्ज नहीं — “अध्याय” खोलकर जोड़ें।' : 'No chapters yet — open “Chapters” to add one.'}</div>}
            {data.perChapter.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 last:border-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${LEVEL_STYLE[c.level] || 'bg-slate-100 text-slate-600 ring-slate-200'}`}>{c.level}</span>
                    <span className="truncate text-sm font-bold text-[#002344]">{c.name}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    {[c.district, c.state].filter(Boolean).join(', ')}{c.coordinatorName ? ` • ${hi ? 'समन्वयक' : 'Coordinator'}: ${c.coordinatorName}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span title="members">👥 {c.members}</span>
                  <span title="leaders">🎖 {c.leaders}</span>
                  <span title="tasks done/total">{c.tasksDone}/{c.tasks}</span>
                  <span className="font-semibold text-emerald-600">{inr(c.funds)}</span>
                </div>
              </div>
            ))}
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Leadership */}
            <div>
              <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-500">{hi ? 'नेतृत्व' : 'Leadership ladder'}</h2>
              <Card className="divide-y divide-slate-100">
                {data.leaders.length === 0 && <div className="p-6 text-center text-sm text-slate-400">—</div>}
                {data.leaders.map((l) => (
                  <div key={l.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-[#002344]">{l.name}</div>
                      <div className="text-[11px] text-slate-400">{[l.designation, l.state].filter(Boolean).join(' • ')}</div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${LEVEL_STYLE[l.level] || 'bg-slate-100 text-slate-600 ring-slate-200'}`}>{l.level}</span>
                  </div>
                ))}
              </Card>
            </div>

            {/* Funds by chapter */}
            <div>
              <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-500">{hi ? 'निधि — अध्याय अनुसार' : 'Funds by chapter'}</h2>
              <Card className="divide-y divide-slate-100">
                {data.fundsByChapter.length === 0 && <div className="p-6 text-center text-sm text-slate-400">—</div>}
                {data.fundsByChapter.map((f) => (
                  <div key={f.chapterId} className="flex items-center justify-between gap-2 px-4 py-2.5">
                    <span className="truncate text-sm text-slate-600">{f.chapter}</span>
                    <span className="font-semibold text-emerald-600">{inr(f.amount)}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* Open tasks */}
          <h2 className="mb-3 mt-6 text-sm font-black uppercase tracking-wider text-slate-500">{hi ? 'खुले कार्य' : 'Open tasks'}</h2>
          <Card className="overflow-hidden">
            {data.openTasks.length === 0 && <div className="p-6 text-center text-sm text-slate-400">{hi ? 'कोई खुला कार्य नहीं।' : 'No open tasks.'}</div>}
            {data.openTasks.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-2.5 last:border-0">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-[#002344]">{t.title}</div>
                  <div className="text-[11px] text-slate-400">{[t.assigneeName, t.chapter, t.dueDate].filter(Boolean).join(' • ')}</div>
                </div>
                <div className="flex items-center gap-2">
                  {t.priority === 'high' && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">high</span>}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{t.taskStatus}</span>
                  {t.fundRequired > 0 && <span className="text-[11px] font-semibold text-emerald-600">{inr(t.fundRaised)}/{inr(t.fundRequired)}</span>}
                </div>
              </div>
            ))}
          </Card>

          <Card className="mt-6 p-4 text-xs text-slate-500">
            <b className="text-slate-700">{hi ? 'नोट' : 'Note'}:</b>{' '}
            {hi
              ? 'अध्याय, सदस्य, कार्य और निधि की प्रविष्टियाँ उनके रजिस्टरों से जुड़ती हैं (कुछ नहीं हटाया गया)। यह पृष्ठ पूरे नेटवर्क की एक झलक देता है।'
              : 'Chapters, members, tasks and funds connect to their registers (nothing removed). This page gives one snapshot of the whole network.'}
          </Card>
        </>
      )}
    </ImsLayout>
  );
}
