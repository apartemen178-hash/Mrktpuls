# MART — Creator-Configured Ecosystem Agents

## LATEST CORRECTION — 2026-10-04 (supersedes the old Agent Studio design below)
User: "Lu salah bro ... penempatan agent itu bukan jadi sub menu di token hub, tapi jadi breakdown dengan chart dll ... semua di tentukan oleh kreator pas isi form token launch ... add token yg bukan launch di mart, juga ada form pilihan agent ... masukan fitur agent itu di landing page ... jangan gunakan kata kata seperti mind".

User confirmed: agent OPTIONAL in both Launch/Add Token. Additional request: after finishing, propose compute system so agents can operate like AgencyPad. Previous no-live-AI scope still applies.

### Corrected requirements and implementation
- Removed standalone agent page and all agent tabs/sub-tabs/public model editing. Legacy `/token/:mint/agent` redirects to the canonical token page.
- Main token page now integrates three columns: profile/activity, live DexScreener chart and trade links, compute/treasury. Original four ecosystem tabs remain below the overview. No extra agent tab.
- No configured agent means an honest empty state, not a default pseudo-agent. Public profile excludes private operating instructions. No browser draft is ever displayed as a token's real profile.
- Shared optional AgentCreatorFields inside Launch and a full Add Token form/page. Both default off; inline provider/model options, persona, mission, private instructions, capabilities, creativity and proposed allocation.
- Launch form accessible before wallet sign-in; upload/submission still require wallet. Existing Pump.fun transaction construction/signing/confirmation retained. Private agent snapshot saved at prepare; attached only after exact successful finalized transaction verification. No agent details leaked in public token metadata.
- No-agent imports remain public; imports with agent require signed wallet session and fresh Metaplex update-authority check BEFORE agent writes. Reimports never delete or replace an existing configured agent. Attachment idempotent under unique token index.
- Finalized original MART launch provenance is sufficient for its own chosen profile attachment; it does NOT claim that program-controlled metadata authority belongs to the creator. External renounced/program-controlled tokens need a different future verification path; current import fails closed.
- Landing now explains optional creator-configured agents and links to Launch/Add Token. MART branding retained; forbidden copied term removed from app copy.
- Added `/docs/ecosystem-agents`, `/docs/agent-compute` and `/app/memory/COMPUTE_PROPOSAL.md`. Compute roadmap only: hosted APIs + separate per-token usage ledger + creator topups first + bounded jobs + deterministic financial policy, no actual runtime/fee custody activated.
- Shared schema `/app/backend/agent_schema.py`; new attachment service in `agents.py`; creator snapshots integrated into `hubs.py` and `launch.py`. Auth core and transactions/send unchanged.
- Production build and initial external APIs passed. Desktop/mobile screenshots of Hub/forms/landing: zero overflow. New comprehensive correction tests pending.
- Found original DexScreener embed returns "No data here". Replaced integrated embed with real native candlestick+volume chart (lightweight-charts v5) backed by keyless GeckoTerminal OHLCV; four intervals, manual refresh, 60s Mongo cache, coalesced upstream access, explicit error/backoff, correct USD/mint orientation, public attribution. Kept DexScreener snapshot and external chart links. 160 real candles verified externally. Fixed chart locale to en-US because browser reports invalid en-US@posix.

### Current backlog
- P0: none outstanding in agreed correction scope; comprehensive verification completed below.
- P1 requested next: choose and implement actual compute funding/runtime only after user approves next phase/integrations.
- P2 optional enhancement: compute budget estimator; public run receipts and creator pause controls in live-runtime phase.

### Correction verification completed — 2026-10-04
- `/app/test_reports/iteration_5.json`: 13/13 correction backend tests passed; UI Launch/Add Token optional form, integrated chart, native chart interval/refresh, no Agent submenu, legacy route redirect, landing/docs and entry points passed.
- Iteration5 flagged a literal `/token/FARTCOIN` test URL due shorthand in my test brief. Actual user/source contract is mint-only canonical identity. `/token/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump` works; no ticker alias should be added. Iteration6 explicitly resolves this false positive.
- `/app/test_reports/iteration_6.json`: 10/10 additional executed isolated backend tests passed: private launch snapshot, exclusion from metadata, finalized exact-hash confirm gating, original creator provenance, idempotent attachment, rejected failed/unfinalized/wrong-wallet/wrong-hash cases, authority-only import, immutable conflict, no-agent non-destructive import, public private-field exclusion.
- Configured-profile browser rendering (60-character unbroken name and long mission) tested at 1920x800 and 390x844 using TEST-ONLY response interception, leaving real price chart untouched. No runtime mock or permanent profile fixture created. This is presentation coverage, not a claim of executing a real mainnet launch.
- Real native chart rendered candles/volume; mobile evidence `/app/test_reports/iteration5-native-chart-mobile-390x844.jpeg`. Desktop and mobile no horizontal overflow. Main-agent inspected mobile evidence and desktop candlesticks.
- Production build successful; only inherited upstream source-map warnings. No mainnet transaction submitted; authorized launch/authority-success paths use isolated fixtures. Real anonymous imports, rejected non-authority imports, public token/profile data and OHLCV exercised through external preview.
- Latest test reports list no outstanding app bugs. Old Agent Studio tests reflect superseded UX and are historical, not current acceptance criteria.
- Runtime AI, credits billing, scheduler, agent financial actions remain intentionally OFF. Current work is correction/configuration + requested compute proposal.

---
## Historical first implementation (SUPERSEDED by latest correction above)

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