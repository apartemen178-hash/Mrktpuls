"""Optional agent profiles. No model execution, treasury custody or transactions."""
from typing import Literal
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, ConfigDict, model_validator
from core import db, user, now, uid
from hubs import get_hub
from chain import current_authority

router = APIRouter(prefix='/api', tags=['agent-profiles'])

MODELS = [
    {'id': 'claude-sonnet-4-5', 'name': 'Claude Sonnet 4.5', 'provider': 'Anthropic', 'type': 'Balanced', 'description': 'Thoughtful strategy, writing, and community conversations.', 'context': '200K', 'recommended': True},
    {'id': 'claude-opus-4-5', 'name': 'Claude Opus 4.5', 'provider': 'Anthropic', 'type': 'Reasoning', 'description': 'Complex research and considered, multi-step reasoning.', 'context': '200K'},
    {'id': 'claude-haiku-4-5', 'name': 'Claude Haiku 4.5', 'provider': 'Anthropic', 'type': 'Fast', 'description': 'Quick responses for everyday community activity.', 'context': '200K'},
    {'id': 'gpt-5.2', 'name': 'GPT-5.2', 'provider': 'OpenAI', 'type': 'Versatile', 'description': 'A versatile choice for analysis, creativity, and planning.', 'context': '400K'},
    {'id': 'gpt-5-mini', 'name': 'GPT-5 mini', 'provider': 'OpenAI', 'type': 'Efficient', 'description': 'Focused reasoning with a lightweight model profile.', 'context': '400K'},
    {'id': 'gemini-3-flash-preview', 'name': 'Gemini 3 Flash', 'provider': 'Google', 'type': 'Fast', 'description': 'Fast multimodal thinking with a large context window.', 'context': '1M'},
    {'id': 'gemini-2.5-pro', 'name': 'Gemini 2.5 Pro', 'provider': 'Google', 'type': 'Research', 'description': 'Long-context research and multimodal understanding.', 'context': '1M'},
    {'id': 'deepseek-reasoner', 'name': 'DeepSeek R1', 'provider': 'DeepSeek', 'type': 'Reasoning', 'description': 'A reasoning-focused profile for research and strategy.', 'context': '128K'},
    {'id': 'qwen3-235b', 'name': 'Qwen3 235B', 'provider': 'Qwen', 'type': 'Open model', 'description': 'Multilingual reasoning and open-model flexibility.', 'context': '128K'},
    {'id': 'mistral-large', 'name': 'Mistral Large', 'provider': 'Mistral', 'type': 'Multilingual', 'description': 'Multilingual communication and structured reasoning.', 'context': '128K'},
]
CAPABILITIES = ['observe', 'research', 'think', 'strategy', 'act', 'monitor', 'learn']

class Allocation(BaseModel):
    model_config = ConfigDict(extra='forbid')
    community: int = Field(default=30, ge=0, le=100, strict=True)
    liquidity: int = Field(default=25, ge=0, le=100, strict=True)
    creative: int = Field(default=20, ge=0, le=100, strict=True)
    buyback: int = Field(default=15, ge=0, le=100, strict=True)
    operations: int = Field(default=10, ge=0, le=100, strict=True)

    @model_validator(mode='after')
    def total(self):
        if sum(self.model_dump().values()) != 100:
            raise ValueError('Allocation must add up to 100%.')
        return self

class AgentProfile(BaseModel):
    model_config = ConfigDict(extra='forbid', str_strip_whitespace=True)
    name: str = Field(min_length=2, max_length=60)
    role: Literal['Community steward', 'Market analyst', 'Creative director'] = 'Community steward'
    mission: str = Field(min_length=10, max_length=1200)
    model_id: str = 'claude-sonnet-4-5'
    creativity: float = Field(default=0.7, ge=0, le=1)
    risk: Literal['Conservative', 'Balanced', 'Exploratory'] = 'Conservative'
    instructions: str = Field(default='', max_length=4000)
    capabilities: list[str] = Field(default_factory=lambda: CAPABILITIES.copy(), max_length=7)
    allocation: Allocation = Field(default_factory=Allocation)

    @model_validator(mode='after')
    def supported(self):
        if self.model_id not in {m['id'] for m in MODELS}:
            raise ValueError('Choose a model from the catalog.')
        if any(c not in CAPABILITIES for c in self.capabilities) or len(set(self.capabilities)) != len(self.capabilities):
            raise ValueError('Choose unique supported capabilities.')
        return self

class Activity(BaseModel):
    id: str
    title: str
    at: str
    kind: str

class AgentView(BaseModel):
    profile: AgentProfile
    published: bool = False
    execution_enabled: bool = False
    updated_at: str | None = None
    updated_by: str | None = None
    activity: list[Activity] = Field(default_factory=list)
    ecosystem: dict[str, int] = Field(default_factory=dict)

@router.get('/agent/models')
async def models():
    return {'models': MODELS, 'execution_enabled': False, 'mode': 'configuration-only'}

@router.post('/agent/validate', response_model=AgentProfile)
async def validate(body: AgentProfile):
    return body

@router.get('/tokens/{mint}/agent', response_model=AgentView)
async def agent(mint: str):
    hub = await get_hub(mint)
    row = await db.agents.find_one({'token': mint}, {'_id': 0})
    profile = row['profile'] if row else AgentProfile(
        name=f'{hub["symbol"][:48]} Agent',
        mission=f'Bring the {hub["name"][:100]} community together. Turn ideas into meaningful events, creative drops, and a thriving token ecosystem.').model_dump()
    ecosystem = {
        'listings': await db.listings.count_documents({'token': mint, 'active': True}),
        'events': await db.events.count_documents({'token': mint}),
        'posts': await db.posts.count_documents({'token': mint}),
    }
    return AgentView(profile=profile, published=bool(row), updated_at=row.get('updated_at') if row else None,
        updated_by=row.get('updated_by') if row else None, activity=row.get('activity', []) if row else [], ecosystem=ecosystem)

@router.patch('/tokens/{mint}/agent', response_model=AgentView)
async def publish(mint: str, body: AgentProfile, wallet: str = Depends(user)):
    hub = await get_hub(mint)
    if hub.get('claimed_by') != wallet:
        raise HTTPException(403, 'Only the verified token authority can publish an agent profile.')
    await current_authority(mint, wallet)
    stamp = now().isoformat()
    activity = Activity(id=uid(), title='Agent profile published', at=stamp, kind='configuration').model_dump()
    await db.agents.update_one({'token': mint}, {
        '$set': {'profile': body.model_dump(), 'updated_at': stamp, 'updated_by': wallet},
        '$push': {'activity': {'$each': [activity], '$position': 0, '$slice': 30}},
    }, upsert=True)
    return await agent(mint)