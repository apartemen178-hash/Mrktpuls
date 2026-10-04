import { Eye, ScanSearch, Brain, Waypoints, Zap, Activity, BookOpen } from 'lucide-react';

export const CAPABILITIES = [
  { id: 'observe', name: 'Observe', icon: Eye, text: 'Market & ecosystem signals' },
  { id: 'research', name: 'Research', icon: ScanSearch, text: 'Context & community insights' },
  { id: 'think', name: 'Think', icon: Brain, text: 'Reasoning with a purpose' },
  { id: 'strategy', name: 'Strategy', icon: Waypoints, text: 'Ideas into thoughtful plans' },
  { id: 'act', name: 'Act', icon: Zap, text: 'Proposals for human approval' },
  { id: 'monitor', name: 'Monitor', icon: Activity, text: 'Outcomes & feedback' },
  { id: 'learn', name: 'Learn', icon: BookOpen, text: 'Memory & lessons' },
];
export const ALLOCATIONS = [
  { id: 'community', name: 'Community rewards', color: '#00efa0' },
  { id: 'liquidity', name: 'Liquidity reserve', color: '#76b8e8' },
  { id: 'creative', name: 'Creative & marketing', color: '#dcaa78' },
  { id: 'buyback', name: 'Buyback reserve', color: '#b1c576' },
  { id: 'operations', name: 'Operations', color: '#9ba3ab' },
];
export const ROLES = [
  { name: 'Community steward', text: 'Community first. Always.', mission: 'Bring the community together with meaningful events, thoughtful updates, and ideas that give every holder a place to belong.' },
  { name: 'Market analyst', text: 'Signals, not noise.', mission: 'Research market signals, track ecosystem activity, and turn observations into transparent proposals for the community. Never promise returns or execute trades.' },
  { name: 'Creative director', text: 'Give the token a voice.', mission: 'Shape a distinctive creative identity. Propose artwork, meme concepts, and community drops that build a culture beyond the chart.' },
];
export const providerMark = name => ({ Anthropic: 'A', OpenAI: '◎', Google: 'G', DeepSeek: 'D', Qwen: 'Q', Mistral: 'M' }[name] || 'AI');
export const draftKey = address => `mart:agent-draft:v1:${address}`;
export function readDraft(address) {
  try {
    const value = JSON.parse(localStorage.getItem(draftKey(address)) || 'null');
    return value?.profile && Array.isArray(value?.activity) ? value : null;
  } catch { return null; }
}