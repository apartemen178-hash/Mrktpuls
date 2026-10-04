import { useState } from 'react';
import { Check, Search, Cpu, ArrowUpRight } from 'lucide-react';
import { Modal, Btn } from '../Kit';
import { providerMark } from './agentData';

export const ModelPicker = ({ open, onClose, models, selected, onSelect }) => {
  const [provider, setProvider] = useState('All');
  const [search, setSearch] = useState('');
  const providers = ['All', ...new Set(models.map(m => m.provider))];
  const filtered = models.filter(m => (provider === 'All' || m.provider === provider) && `${m.name} ${m.provider}`.toLowerCase().includes(search.toLowerCase()));
  return <Modal open={open} onClose={onClose} id="agent-model-picker" title="Choose a mind." description="Model catalog · Configuration only. No API connection or usage charges.">
    <div className="agent-model-search"><Search size={16} /><input aria-label="Search AI models" data-testid="agent-model-search" placeholder="Search models…" value={search} onChange={e => setSearch(e.target.value)} /></div>
    <div className="agent-provider-filters" data-testid="agent-provider-filters">{providers.map(p => <button type="button" key={p} data-testid={`agent-provider-${p.toLowerCase()}`} className={provider === p ? 'active' : ''} onClick={() => setProvider(p)}>{p}</button>)}</div>
    <div className="agent-model-options" role="radiogroup" aria-label="AI model" data-testid="agent-model-options">
      {filtered.map(m => <button type="button" role="radio" aria-checked={selected === m.id} key={m.id} data-testid={`agent-model-option-${m.id}`} className={`agent-model-option ${selected === m.id ? 'selected' : ''}`} onClick={() => { onSelect(m.id); onClose(); }}>
        <span className={`provider-mark provider-${m.provider.toLowerCase()}`}>{providerMark(m.provider)}</span>
        <span className="model-option-copy"><strong>{m.name}{m.recommended && <small>RECOMMENDED</small>}</strong><span>{m.description}</span><em>{m.provider} <i>·</i> {m.type} <i>·</i> {m.context} context</em></span>
        <span className="model-radio">{selected === m.id && <Check size={12} />}</span>
      </button>)}
      {!filtered.length && <p className="agent-no-results" data-testid="agent-model-empty">No models match your search.</p>}
    </div>
    <p className="agent-small-note" data-testid="agent-model-catalog-note">Catalog specifications are indicative; provider availability is checked when an integration is connected.</p>
  </Modal>;
};

export const ModelSummary = ({ model, onChange }) => <div className="agent-model-summary" data-testid="agent-selected-model">
  <div className="agent-section-title"><span><Cpu size={15} /> THE MIND</span><span className="agent-mini-tag">NOT CONNECTED</span></div>
  <div className="agent-model-identity"><span className={`provider-mark provider-${model?.provider?.toLowerCase()}`}>{providerMark(model?.provider)}</span><div><h3 data-testid="agent-model-name">{model?.name || 'Select a model'}</h3><p data-testid="agent-model-provider">{model?.provider || 'AI model catalog'}</p></div></div>
  <p className="agent-model-description" data-testid="agent-model-description">{model?.description}</p>
  <div className="agent-model-meta"><span data-testid="agent-model-context">{model?.context} context</span><span data-testid="agent-model-type">{model?.type}</span></div>
  <Btn secondary onClick={onChange} data-testid="agent-change-model">Change model<ArrowUpRight size={14} /></Btn>
</div>;