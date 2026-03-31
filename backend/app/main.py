from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    ItemPlan,
    PositioningPlan,
    AugmentPlan,
    Recommendation,
    RecommendationResponse,
    RecommendationStagePlan,
    UserInputState,
)

app = FastAPI(
    title="Jinchanchan S17 Helper API",
    description="Backend API for Jinchanchan S17 composition and strategy recommendations.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@app.post("/recommend", response_model=RecommendationResponse)
async def recommend(user_input: UserInputState) -> RecommendationResponse:
    """
    目前为示例逻辑：
    - 根据是否有“龙王”/“小炮”等示例英雄，返回固定的一套假数据。
    - 后续可以在此处接入实际 S17 数据与大模型调用。
    """
    champion_names = {c.nameCn for c in user_input.selectedChampions}

    base_recommendations: list[Recommendation] = []

    # 示例 1：偏上分稳健阵容
    comp_name_1 = "示例：龙王大法（稳健上分）"
    tier_1 = "S"
    core_champions_1 = ["龙王", "主坦", "副 C"]
    traits_1 = ["龙", "法师", "护卫"]

    stages = [
        RecommendationStagePlan(
            stageLabel="2 阶（2-1～2-7）",
            board=["1 费前排 ×2", "1 费后排输出 ×2"],
            economyPlan="建议保持 10 金利息，不强行升人口，优先保血为主。",
            notes="以连胜为目标时可以小幅度刷牌补 2 星；血量安全时可以稍微卖血存利息。",
        ),
        RecommendationStagePlan(
            stageLabel="3 阶（3-1～3-7）",
            board=["2 费前排 ×2", "主 C 雏形", "补一个控制单位"],
            economyPlan="目标在 3-2 左右上 6 人口，根据血量选择是大 D 还是小搜补质量。",
            notes="如果血量较低，优先升人口和补质量稳住血量；血量健康则偏向攒钱上人口。",
        ),
        RecommendationStagePlan(
            stageLabel="4 阶（4-1～4-7）",
            board=["完整前排", "核心 C", "2～3 个功能/控制位"],
            economyPlan="4-1 上 7 人口，观察牌型与血量决定是否在 7 大搜一波，或直接速 8。",
            notes="这个阶段是阵容成型关键节点，优先保证主 C 和主坦 2 星。",
        ),
        RecommendationStagePlan(
            stageLabel="5 阶（5-1 以后）",
            board=["最终阵容成型", "补充橙卡/转职", "调整站位针对对手"],
            economyPlan="5-1 上 8 或 9 人口，大搜补齐 2 星与关键 5 费卡。",
            notes="灵活根据对手阵容微调站位，必要时可以放弃部分羁绊，确保主 C 能稳定输出。",
        ),
    ]

    items_plan_1 = {
        core_champions_1[0]: ItemPlan(
            core=["无尽之刃", "巨人杀手", "最后的轻语"],
            optional=["饮血剑", "正义之手"],
            avoid=["纯防御装"],
        ),
        "主坦": ItemPlan(
            core=["反曲之甲", "狂徒铠甲", "龙爪"],
            optional=["救赎", "日炎斗篷"],
            avoid=["三件输出装"],
        ),
    }

    augments_1 = AugmentPlan(
        highPriority=[
            "与核心羁绊直接相关的纹章或心、灵魂",
            "能加钱加经验的经济类强化（如果你偏稳运营）",
        ],
        mediumPriority=[
            "汎用战力强化（全队攻防提升）",
            "成装/组件强化（根据你已有装备决定）",
        ],
        lowPriority=[
            "完全不契合当前羁绊和阵容的专精强化",
            "会把你阵容硬拐向另一套，且你面板不支撑的路线",
        ],
    )

    positioning_1 = PositioningPlan(
        early="前期让前排分散站位，避免被对手单一角落集火；主 C 靠边但不要站角落，以免被对位刺客或抓取。",
        mid="中期根据对手主 C 站位微调前排，让控制位优先控到对面主 C 所在一侧；主 C 注意与对面前排保持足够距离。",
        late="后期每回合观察对手位置，适当对位；面对刺客集中后排站位，前排收拢保护主 C；面对法术爆发阵容，可以把主 C 稍微拆散避免被同一技能命中。",
    )

    match_score_base = 0.78
    if user_input.hpRange == "low":
        match_score_base += 0.05
    if user_input.playStyle == "risk":
        match_score_base -= 0.03
    match_score_1 = max(min(match_score_base, 0.97), 0.6)

    rec_1 = Recommendation(
        compName=comp_name_1,
        tier=tier_1,
        matchScore=match_score_1,
        winRate=0.21,
        top4Rate=0.63,
        pickRate=0.14,
        coreChampions=core_champions_1,
        traits=traits_1,
        stages=stages,
        itemsPlan=items_plan_1,
        augments=augments_1,
        positioning=positioning_1,
    )

    base_recommendations.append(rec_1)

    # 示例 2：偏吃鸡的高上限阵容（用小炮为主 C）
    comp_name_2 = "示例：约德尔射手小炮（上限吃鸡）"
    tier_2 = "S"
    core_champions_2 = ["小炮", "前排主坦", "补充控制"]
    traits_2 = ["约德尔人", "射手", "护卫"]

    items_plan_2 = {
        "小炮": ItemPlan(
            core=["无尽之刃", "飓风", "巨人杀手"],
            optional=["正义之手", "蓝霸符"],
            avoid=["纯肉装"],
        ),
        "前排主坦": ItemPlan(
            core=["反曲之甲", "狂徒铠甲", "龙爪"],
            optional=["救赎"],
            avoid=["三件输出装"],
        ),
    }

    augments_2 = AugmentPlan(
        highPriority=[
            "与射手/约德尔相关的纹章或专属强化",
            "能帮助连胜或快速升人口的经济类强化",
        ],
        mediumPriority=[
            "通用攻击力/攻速提升类强化",
            "给前排提供额外坦度的防御强化",
        ],
        lowPriority=[
            "和射手完全无关的法系爆发专精",
            "会强行把你拐去近战阵容的专精强化",
        ],
    )

    positioning_2 = PositioningPlan(
        early="小炮站在安全角落，前排均匀铺开，避免被单点突破；尽量保证至少两名前排挡在小炮前面。",
        mid="根据对手主 C 站位对位，把控制位靠近对手主 C 一侧；小炮与对面前排保持距离，避免被突进英雄直接切到。",
        late="多观察对手是否有刺客或勾子，根据情况调整小炮位置：有刺客时集中保护，无刺客时可以角落站位追求极限输出。",
    )

    match_score_2 = 0.75
    if "小炮" in champion_names:
        match_score_2 += 0.1
    if user_input.playStyle == "risk":
        match_score_2 += 0.05
    match_score_2 = max(min(match_score_2, 0.98), 0.55)

    rec_2 = Recommendation(
        compName=comp_name_2,
        tier=tier_2,
        matchScore=match_score_2,
        winRate=0.24,
        top4Rate=0.58,
        pickRate=0.11,
        coreChampions=core_champions_2,
        traits=traits_2,
        stages=stages,
        itemsPlan=items_plan_2,
        augments=augments_2,
        positioning=positioning_2,
    )

    base_recommendations.append(rec_2)

    # 示例 3：通用稳定过渡阵容（作为兜底选项）
    comp_name_3 = "示例：通用连胜过渡阵容"
    tier_3 = "A"
    core_champions_3 = ["打工 C", "主坦", "补控制"]
    traits_3 = ["随机羁绊 1", "随机羁绊 2"]

    rec_3 = Recommendation(
        compName=comp_name_3,
        tier=tier_3,
        matchScore=0.7,
        winRate=0.16,
        top4Rate=0.55,
        pickRate=0.2,
        coreChampions=core_champions_3,
        traits=traits_3,
        stages=stages,
        itemsPlan=items_plan_1,
        augments=augments_1,
        positioning=positioning_1,
    )

    base_recommendations.append(rec_3)

    return RecommendationResponse(recommendations=base_recommendations)

