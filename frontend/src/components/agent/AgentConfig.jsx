import { Check, SlidersHorizontal, ShieldCheck, Cpu } from 'lucide-react';
import { Field, Choice } from '../Kit';
import { CAPABILITIES, ALLOCATIONS, ROLES, providerMark } from './agentData';
import { Switch } from '../ui/switch';

export const AgentConfig = ({ profile, set, model, onModel, onSave, busy }) => {
  const total = Object.values(profile.allocation).reduce((a, b) => a + Number(b || 0), 0);
  return <form className="agent-config" onSubmit={onSave} data-testid="agent-config-form">
    <fieldset disabled={busy} className="agent-config-main">
      <div className="agent-section-heading"><div><span className="agent-overline">IDENTITY & PURPOSE</span><h2>Make it your own.</h2></div><SlidersHorizontal size={19} /></div>
      <Field id="agent-name-input" label="Agent name" value={profile.name} onChange={e => set('name', e.target.value)} required minLength={2} maxLength={60} />
      <div className="agent-field-label" data-testid="agent-persona-label">Persona</div>
      <div className="agent-role-options" role="radiogroup" aria-label="Agent persona">{ROLES.map((r, i) => <button type="button" role="radio" aria-checked={profile.role === r.name} className={profile.role === r.name ? 'selected' : ''} key={r.name} data-testid={`agent-role-${i}`} onClick={() => { set('role', r.name); set('mission', r.mission); }}><span><strong>{r.name}</strong><small>{r.text}</small></span>{profile.role === r.name && <Check size={14} />}</button>)}</div>
      <Field textarea id="agent-mission-input" label="Mission" required minLength={10} maxLength={1200} value={profile.mission} onChange={e => set('mission', e.target.value)} />
      <Field textarea id="agent-instructions-input" label="Operating instructions (optional)" maxLength={4000} placeholder="Voice, values, boundaries, and what your agent should care about…" value={profile.instructions} onChange={e => set('instructions', e.target.value)} />
      <div className="agent-config-capabilities"><h3 data-testid="agent-capability-settings-title">Capability plan</h3>{CAPABILITIES.map(c => <div className="agent-capability-setting" key={c.id}><c.icon size={17} /><label htmlFor={`agent-toggle-${c.id}`}><strong>{c.name}</strong><span>{c.text}</span></label><Switch id={`agent-toggle-${c.id}`} data-testid={`agent-toggle-${c.id}`} checked={profile.capabilities.includes(c.id)} onCheckedChange={checked => set('capabilities', checked ? [...profile.capabilities, c.id] : profile.capabilities.filter(id => id !== c.id))} /></div>)}</div>
    </fieldset>
    <fieldset disabled={busy} className="agent-config-side">
      <div className="agent-section-heading"><div><span className="agent-overline">MODEL & BEHAVIOR</span><h2>The way it thinks.</h2></div><Cpu size={19} /></div>
      <button type="button" className="agent-config-model" onClick={onModel} data-testid="agent-config-change-model"><span className={`provider-mark provider-${model?.provider?.toLowerCase()}`}>{providerMark(model?.provider)}</span><span><strong>{model?.name}</strong><small>{model?.provider} · Change model</small></span><SlidersHorizontal size={16} /></button>
      <label className="agent-creativity"><span>Creativity<strong data-testid="agent-creativity-value">{Number(profile.creativity).toFixed(1)}</strong></span><input type="range" min="0" max="1" step="0.1" value={profile.creativity} onChange={e => set('creativity', Number(e.target.value))} data-testid="agent-creativity-input" aria-label="Creativity" /><small><span>Precise</span><span>Expressive</span></small></label>
      <Choice id="agent-risk-select" label="Strategy posture" value={profile.risk} onChange={v => set('risk', v)} options={['Conservative', 'Balanced', 'Exploratory']} />
      <div className="agent-config-allocation"><div className="agent-section-heading"><h3>Proposed allocation</h3><span className={total === 100 ? 'green' : 'negative'} data-testid="agent-allocation-total">{total}% / 100%</span></div>{ALLOCATIONS.map(a => <label key={a.id} className="agent-allocation-input"><span style={{ backgroundColor: a.color }} /><span>{a.name}</span><input type="number" aria-label={`${a.name} percentage`} min="0" max="100" step="1" required data-testid={`agent-allocation-input-${a.id}`} value={profile.allocation[a.id]} onChange={e => set('allocation', { ...profile.allocation, [a.id]: e.target.value === '' ? '' : Number(e.target.value) })} /><small>%</small></label>)}{total !== 100 && <p role="alert" className="negative" data-testid="agent-allocation-error">Allocation must add up to 100%.</p>}</div>
      <p className="agent-config-boundary" data-testid="agent-config-boundary"><ShieldCheck size={17} />Configuration only. No AI calls, wallet permissions, or automated transactions.</p>
      <button type="submit" className="btn btn-primary" disabled={busy || total !== 100} data-testid="agent-config-save">{busy ? 'Saving…' : 'Save configuration'}<Check size={15} /></button>
    </fieldset>
  </form>;
};