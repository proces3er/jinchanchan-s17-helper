export type StageKey = "2-1" | "2-5" | "3-2" | "4-1" | "5-1";

export interface Champion {
  id: string;
  nameCn: string;
  cost: 1 | 2 | 3 | 4 | 5;
  traits: string[];
}

export interface UserInputState {
  selectedChampions: Champion[];
  stage: StageKey;
  hpRange: "high" | "mid" | "low";
  playStyle: "stable" | "risk";
}

export interface RecommendationStagePlan {
  stageLabel: string;
  board: string[];
  economyPlan: string;
  notes: string;
}

export interface Recommendation {
  compName: string;
  tier: "SS" | "S" | "A" | "B";
  matchScore: number;
  winRate: number;
  top4Rate: number;
  pickRate: number;
  coreChampions: string[];
  traits: string[];
  stages: RecommendationStagePlan[];
  itemsPlan: {
    [championName: string]: {
      core: string[];
      optional: string[];
      avoid?: string[];
    };
  };
  augments: {
    highPriority: string[];
    mediumPriority: string[];
    lowPriority: string[];
  };
  positioning: {
    early: string;
    mid: string;
    late: string;
  };
}

