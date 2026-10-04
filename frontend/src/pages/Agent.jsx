import { useEffect, useRef, useState } from 'react';
import { Bot, ArrowUpRight, Save, RotateCcw, ShieldCheck, Check, Circle, Radio } from 'lucide-react';
import { toast } from 'sonner';
import { api, useData } from '../lib/api';
import { useWallet } from '../components/WalletContext';
import { Loading, ErrorBox, TokenAvatar, Btn, Modal } from '../components/Kit';
import { ModelPicker, ModelSummary } from '../components/agent/ModelPicker';
import { AgentConfig } from '../components/agent/AgentConfig';
import { AgentBreakdown } from '../components/agent/AgentBreakdown';
import { AgentActivity } from '../components/agent/AgentActivity';
import { CAPABILITIES, draftKey, readDraft } from '../components/agent/agentData';

export default function Agent({ token }) {
  const remote = useData(`/tokens/${token.address}/agent`);
  const catalog = useData('/agent/models');
  const { wallet, openWallet } = useWallet();
  const [profile, setProfile] = useState(null), [saved, setSaved] = useState(false), [dirty, setDirty] = useState(false);
  const [view, setView] = useState('overview'), [picker, setPicker] = useState(false), [dialog, setDialog] = useState('');
  const [activity, setActivity] = useState([]), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const initialized = useRef(false);
  useEffect(() => {
    if (!remote.data || !catalog.data || initialized.current) return;
    initialized.current = true;
    const local = readDraft(token.address);
    const usable = local && catalog.data.models.some(m => m.id === local.profile.model_id) && local.profile.allocation && Array.isArray(local.profile.capabilities);
    setProfile(usable ? local.profile : remote.data.profile);
    setSaved(!!usable); setActivity(usable ? local.activity : []);
  }, [remote.data, catalog.data, token.address]);
  useEffect(() => {
    if (!dirty) return;
    const warn = e => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const set = (key, value) => { setProfile(p => ({ ...p, [key]: value })); setDirty(true); setError(''); };
  const changeView = next => { setView(next); setError(''); };
  async function save(e) {
    e?.preventDefault(); if (busy) return;
    setBusy(true); setError('');
    try {
      const normalized = await api('/agent/validate', { method: 'POST', body: profile });
      const entry = { id: crypto.randomUUID(), title: 'Agent configuration saved', kind: 'configuration', at: new Date().toISOString(), local: true };
      const updated = [entry, ...activity].slice(0, 30);
      localStorage.setItem(draftKey(token.address), JSON.stringify({ profile: normalized, activity: updated }));
      setProfile(normalized); setActivity(updated); setSaved(true); setDirty(false);
      toast.success('Draft saved in this browser. AI execution remains off.');
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function publish() {
    setBusy(true); setError('');
    try {
      const result = await api(`/tokens/${token.address}/agent`, { method: 'PATCH', body: profile });
      remote.setData(result); setProfile(result.profile); setDirty(false); setSaved(false); setActivity([]);
      try { localStorage.removeItem(draftKey(token.address)); } catch { /* Published profile remains canonical. */ }
      setDialog(''); toast.success('Agent profile published. AI execution remains off.');
    } catch(e) { setError(e.message); setDialog(''); } finally { setBusy(false); }
  }
  function reset() {
    try { localStorage.removeItem(draftKey(token.address)); setProfile(remote.data.profile); setSaved(false); setDirty(false); setActivity([]); setError(''); setDialog(''); toast.success('Local draft cleared.'); }
    catch { setError('Browser storage is unavailable. Your draft could not be cleared.'); setDialog(''); }
  }
  if (remote.error || catalog.error) return <div><ErrorBox error={remote.error || catalog.error} /><Btn secondary data-testid="agent-retry" onClick={() => { remote.reload(); catalog.reload(); }}>Try again</Btn></div>;
  if (!profile || remote.loading || catalog.loading) return <Loading />;
  const model = catalog.data.models.find(m => m.id === profile.model_id);
  const entries = [...activity, ...(remote.data?.activity || [])].sort((a, b) => new Date(b.at) - new Date(a.at));
  const status = dirty ? 'UNSAVED CHANGES' : saved ? 'LOCAL DRAFT' : remote.data.published ? 'PUBLIC PROFILE' : 'NOT CONFIGURED';
  const canPublish = wallet && token.claimed_by === wallet;
  return <div className="agent-studio" data-testid="agent-studio">
    <div className="agent-topline"><div><span className="agent-overline"><Bot size={13} /> THE NEXT LAYER OF YOUR TOKEN</span><h2 data-testid="agent-studio-title">Your token. A mind of its own<span className="green">.</span></h2></div><span className="agent-execution-badge" data-testid="agent-execution-status"><Circle size={7} fill="currentColor" />AI EXECUTION OFF</span></div>
    <div className="agent-workspace-nav"><div role="tablist" aria-label="Agent views">{['overview', 'configuration', 'activity'].map(v => <button key={v} type="button" role="tab" aria-selected={view === v} aria-controls="agent-view-panel" data-testid={`agent-view-${v}`} className={view === v ? 'active' : ''} onClick={() => changeView(v)}>{v[0].toUpperCase() + v.slice(1)}{v === 'activity' && entries.length > 0 && <small>{entries.length}</small>}</button>)}</div><span className={`agent-draft-status ${dirty ? 'unsaved' : ''}`} data-testid="agent-draft-status"><span />{status}</span></div>
    <ErrorBox error={error} />
    <div role="tabpanel" id="agent-view-panel" data-testid="agent-view-panel">
    {view === 'overview' && <>
      <div className="agent-intro-grid"><section className="agent-profile" data-testid="agent-profile-card"><div className="agent-profile-heading"><div className="agent-avatar"><TokenAvatar token={token} /><span><Bot size={16} /></span></div><div><span className="agent-overline" data-testid="agent-profile-role">{profile.role}</span><h3 data-testid="agent-profile-name">{profile.name}</h3><span className="agent-token-label" data-testid="agent-profile-token">Part of the ${token.symbol} ecosystem</span></div></div><div className="agent-mission"><span className="agent-overline">THE MISSION</span><p data-testid="agent-mission">{profile.mission}</p></div><div className="agent-profile-footer"><span data-testid="agent-posture"><ShieldCheck size={14} />{profile.risk} posture</span><button className="text-link" data-testid="agent-configure-profile" onClick={() => changeView('configuration')}>Configure agent<ArrowUpRight size={14} /></button></div></section><ModelSummary model={model} onChange={() => setPicker(true)} /></div>
      <section className="agent-capabilities" data-testid="agent-capabilities"><div className="agent-section-heading"><div><span className="agent-overline">THE OPERATING LOOP</span><h2>Built to do more than think.</h2></div><span className="agent-neutral-badge" data-testid="agent-capabilities-status">PLANNED CAPABILITIES</span></div><div className="agent-capability-grid">{CAPABILITIES.map((c, i) => <div key={c.id} className={`agent-capability ${profile.capabilities.includes(c.id) ? '' : 'excluded'}`} data-testid={`agent-capability-${c.id}`}><span className="agent-capability-number">0{i + 1}</span><c.icon size={21} /><h3>{c.name}</h3><p>{c.text}</p><span className="agent-capability-state">{profile.capabilities.includes(c.id) ? 'Standby' : 'Excluded'}</span></div>)}</div></section>
      <div className="agent-lower-grid"><AgentBreakdown profile={profile} token={token} ecosystem={remote.data.ecosystem} onConfigure={() => changeView('configuration')} /><AgentActivity entries={entries} compact onShowAll={() => changeView('activity')} /></div>
    </>}
    {view === 'configuration' && <AgentConfig profile={profile} set={set} model={model} onModel={() => setPicker(true)} onSave={save} busy={busy} />}
    {view === 'activity' && <AgentActivity entries={entries} />}
    </div>
    <div className="agent-save-bar"><div><ShieldCheck size={18} /><p data-testid="agent-draft-privacy">{saved || dirty ? 'Your draft. Your browser.' : 'Your token stays in your control.'}<span>Public profiles require verified token authority. Agents cannot move funds.</span></p></div><div className="agent-save-actions">{(saved || dirty) && <button type="button" className="icon-button" title="Discard local draft" aria-label="Discard local draft" data-testid="agent-reset-draft" onClick={() => setDialog('reset')} disabled={busy}><RotateCcw size={15} /></button>}<Btn secondary data-testid="agent-publish-profile" onClick={() => setDialog('publish')} disabled={busy}><Radio size={14} />Publish profile</Btn><Btn data-testid="agent-save-config-btn" onClick={save} busy={busy}><Save size={14} />Save draft</Btn></div></div>
    <ModelPicker open={picker} onClose={() => setPicker(false)} models={catalog.data.models} selected={profile.model_id} onSelect={id => set('model_id', id)} />
    <Modal open={!!dialog} onClose={() => !busy && setDialog('')} id="agent-confirm" title={dialog === 'reset' ? 'Discard your local draft?' : 'Publish your agent profile'} description={dialog === 'reset' ? 'Your local configuration and draft activity will be removed. The public profile stays unchanged.' : 'Publishing makes the profile visible to everyone in this Token Hub. It does not activate AI or authorize transactions.'}>
      {dialog === 'reset' ? <div className="agent-dialog-actions"><Btn secondary data-testid="agent-cancel-reset" onClick={() => setDialog('')}>Keep draft</Btn><Btn data-testid="agent-confirm-reset" onClick={reset}>Discard draft</Btn></div> : <>{canPublish ? <><p className="agent-small-note" data-testid="agent-publish-authority-note">Your current on-chain authority will be checked before publishing.</p><Btn data-testid="agent-confirm-publish" onClick={publish} busy={busy}><Check size={15} />Publish profile</Btn></> : <><div className="agent-publish-gate" data-testid="agent-publish-gate"><ShieldCheck size={27} /><h3>For verified token authorities.</h3><p>{wallet ? 'This wallet is not the verified authority for this token.' : 'Connect the verified token authority wallet to publish. Anyone can keep a private browser draft.'}</p></div>{!wallet && <Btn data-testid="agent-publish-connect" onClick={() => { setDialog(''); openWallet(); }}>Connect wallet<ArrowUpRight size={14} /></Btn>}</>}</>}
    </Modal>
  </div>;
}