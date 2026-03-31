from __future__ import annotations

from enum import Enum
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel


StageKey = Literal["2-1", "2-5", "3-2", "4-1", "5-1"]


class Champion(BaseModel):
    id: str
    nameCn: str
    cost: int
    traits: List[str]


class HpRange(str, Enum):
    HIGH = "high"
    MID = "mid"
    LOW = "low"


class PlayStyle(str, Enum):
    STABLE = "stable"
    RISK = "risk"


class UserInputState(BaseModel):
    selectedChampions: List[Champion]
    stage: StageKey
    hpRange: HpRange
    playStyle: PlayStyle


class RecommendationStagePlan(BaseModel):
    stageLabel: str
    board: List[str]
    economyPlan: str
    notes: str


class ItemPlan(BaseModel):
    core: List[str]
    optional: List[str]
    avoid: Optional[List[str]] = None


class AugmentPlan(BaseModel):
    highPriority: List[str]
    mediumPriority: List[str]
    lowPriority: List[str]


class PositioningPlan(BaseModel):
    early: str
    mid: str
    late: str


class Recommendation(BaseModel):
    compName: str
    tier: Literal["SS", "S", "A", "B"]
    matchScore: float
    winRate: float
    top4Rate: float
    pickRate: float
    coreChampions: List[str]
    traits: List[str]
    stages: List[RecommendationStagePlan]
    itemsPlan: Dict[str, ItemPlan]
    augments: AugmentPlan
    positioning: PositioningPlan


class RecommendationResponse(BaseModel):
    recommendations: List[Recommendation]

