# MART — Optional Agent Studio

## Original problem statement
Bro gue mau lu clone github repo ini semuanya https://market-pulse-2620.preview.emergentagent.com/
Lalu gue mau lu menambahkan konsep agent kaya https://www.agencypad.fun/ di token hubnya dan pilihan model ai nya breakdown token hubnya kaya gini https://www.agencypad.fun/coin/H7TuvDxEKygh27zGfGcjKG8JGWgrbyKpPtvJEpGosfas
Tapi jangan hilangkan konsep utama di github repo ini https://market-pulse-2620.preview.emergentagent.com/launch
Fitur agent yang seperti https://www.agencypad.fun/ hanya sebagai tambahan fitur saja

## Explicit user choices
- Source repo: https://github.com/banyakinaja13-prog/Mrkepulse
- First phase: agent presentation, profiles, model choices, token-hub breakdown.
- No real AI integration; focus on additional feature and appearance.
- Keep original MART and its launch concept. Do not replace it with AgencyPad.

## Personas
- Visitors/holders explore token markets, community and agent profiles.
- Creators configure an agent persona and allocation draft.
- Verified on-chain token authorities can publish a public profile.

## Core requirements (static)
- Import entire app source and preserve original routes, branding, components, launch, wallet, commerce, events and community.
- Add optional `/token/:address/agent`; retain Market as original default Hub tab.
- Agent identity, role, mission, provider/model selection, capabilities, treasury/allocation and activity breakdown.
- Clear separation of browser-local drafts, published profiles, live market data and inactive AI/treasury functions.
- Responsive desktop/mobile and no autonomous fund movements.

## Architecture decisions
- Imported public main branch commit `1642d3a2f9ba590e8261027399f124081cf651c3`; preserved existing environment/dependency management; source PRD saved separately.
- React 19, React Router, existing shadcn/Radix, original dark emerald MART design. New isolated `agent.css` and agent components.
- FastAPI/Motor/MongoDB with additive `agents.py`. No LLM SDK calls or agent task scheduling.
- Public GET model catalog and agent profile; POST validation; authority-gated PATCH publication. Pydantic validation and response models; Mongo `_id` excluded. Unique agents.token index.
- Browser-local draft per token; real local save history. Published configuration history stored in MongoDB. Never manufacture operational agent activity or balances.
- Existing wallet signature authentication reused unchanged. Publication validates claimed_by and fresh on-chain authority, fail-closed.
- Existing image upload contract preserved; new files use Emergent Object Storage and only metadata in MongoDB. Legacy image reads remain compatible.
- All API addresses from existing environment; public Solana RPC, DexScreener, PumpPortal infrastructure preserved.

## Implemented — 2026-10-04
- Full source imported (135 files); original home, Explore, Launch, Trade, Market, Events, Community, Wallet, Docs retained.
- Added Agent tab, compact Hub discovery strip, overview/configuration/activity views.
- Profile persona presets, editable mission/instructions, strategy posture/creativity controls, seven capability toggles.
- Searchable model picker: 10 catalog entries across Anthropic, OpenAI, Google, DeepSeek, Qwen, Mistral. Catalog-only, no real provider integration.
- Proposed five-part treasury allocation with 100% validation, unlinked balances shown as unavailable, real marketplace/event/post counts.
- Save/reload/reset local drafts; public publish confirmation and authority gating; actual configuration activity history.
- Backend validation: bounded inputs, supported model IDs/capabilities, total allocation, explicit execution_enabled=false.
- Image upload migrated to object storage while keeping source API paths.
- Production build passed with only pre-existing upstream Solana/superstruct source-map warnings. Desktop 1920x800/mobile 390x844 screenshots: zero horizontal overflow.

## Availability boundaries
- AI intentionally off, no connected model providers, no chat/generation or autonomous actions.
- Allocation is a proposal, not funded treasury accounting. No simulated balance or trading returns.
- Browser drafts are private to the browser, not cross-device/server-synced. Verified authority required for public profile storage.
- NFT minting/trading remains unavailable as in source. Paid mainnet launch/checkout and actual extension approval are not executed during tests.
- Public RPC/indexer may rate limit. Source handling remains intact.

## Prioritized backlog
- P0: none outstanding in agreed agent-configuration scope.
- P1: no additional required features beyond agreed first phase.
- P2 optional: export/import agent configurations; shareable agent profile card; side-by-side model comparison.
- Live AI and treasury automation intentionally outside requested scope, not pending setup.

## Verification — 2026-10-04
- Testing report `/app/test_reports/iteration_4.json`: 22/22 backend tests passed. New suite `/app/backend/tests/test_agent_storage_regression.py`.
- Verified real catalog/default profile APIs, validation rejections, unauthenticated/non-authority gates, off-chain signed challenge/replay rejection, object storage upload/download and metadata-only database records.
- Authority-success and failure logic verified in ISOLATED fixtures only; no mainnet metadata changed and no real authority-owned profile published during tests.
- Browser tests passed model/provider filtering, no-results, draft save/reload/isolation, reset confirmation, invalid allocations, persona/config fields, actual configuration history, publish/connect flow, and source-page regression checks.
- Follow-up self-test completed real backend off-chain authentication using a browser-injected ephemeral Ed25519 wallet. Connected non-authority publication was blocked, publish action absent. This resolves the test agent's remaining UI coverage gap. No transaction signed or sent.
- Source `Launch.jsx` is byte-identical to imported original. Its connected-wallet launch form also verified at desktop/mobile without submitting a transaction.
- Explore sort already has `data-testid="explore-sort"` via the shared Choice component. Follow-up browser verified the trigger and `explore-sort-market-cap` option work; report suggestion required no code change.
- Tested all required viewports at exact 1920x800 and 390x844; final model modal, config form, long-text profile, overview, home and connected-wallet launch had zero horizontal overflow.
- DexScreener iframe may emit a third-party analytics CORS warning; preserved original chart integration and existing external chart link. MART market data and core flows were unaffected.
- No production runtime mock API. Agent is deliberately configuration-only, not fake AI. No permanent test accounts or public profile seed data added.

## Next tasks
Await user feedback on this additive Agent Studio. Optional next additions: shareable profile card, configuration export/import, model comparison. Keep live AI and treasury automation out of scope unless explicitly requested.