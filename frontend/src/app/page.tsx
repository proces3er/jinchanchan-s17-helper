"use client";

import { useState } from "react";
import type {
  Champion,
  Recommendation,
  StageKey,
  UserInputState,
} from "../types";

const MOCK_CHAMPIONS: Champion[] = [
  {
    id: "c1",
    nameCn: "小炮",
    cost: 1,
    traits: ["约德尔人", "射手"],
  },
  {
    id: "c2",
    nameCn: "女枪",
    cost: 2,
    traits: ["枪手", "海盗"],
  },
  {
    id: "c3",
    nameCn: "龙王",
    cost: 4,
    traits: ["龙", "法师"],
  },
];

const STAGE_OPTIONS: { label: string; value: StageKey }[] = [
  { label: "2-1", value: "2-1" },
  { label: "2-5", value: "2-5" },
  { label: "3-2", value: "3-2" },
  { label: "4-1", value: "4-1" },
  { label: "5-1", value: "5-1" },
];

export default function HomePage() {
  const [userInput, setUserInput] = useState<UserInputState>({
    selectedChampions: [],
    stage: "2-1",
    hpRange: "high",
    playStyle: "stable",
  });
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleChampion = (champion: Champion) => {
    setUserInput((prev) => {
      const exists = prev.selectedChampions.find((c) => c.id === champion.id);
      if (exists) {
        return {
          ...prev,
          selectedChampions: prev.selectedChampions.filter(
            (c) => c.id !== champion.id,
          ),
        };
      }
      return {
        ...prev,
        selectedChampions: [...prev.selectedChampions, champion],
      };
    });
  };

  const handleRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInput),
      });

      if (!res.ok) {
        throw new Error(`请求失败：${res.status}`);
      }

      const data = (await res.json()) as { recommendations: Recommendation[] };
      setRecommendations(data.recommendations);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "请求失败，请稍后重试。";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-black/80">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-primary via-amber-300 to-white bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              金铲铲 S17 阵容推荐助手
            </h1>
            <p className="mt-3 text-sm text-gray-300 md:text-base">
              选择你的开局英雄和局内情况，由 AI 帮你规划最终阵容、分阶段过渡、装备与强化选择。
            </p>
          </div>
          <div className="pill border border-primary/40 bg-primary/10 text-xs text-primary md:text-sm">
            目前为演示版本，后端使用样例数据与逻辑
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)]">
          <section className="card p-5 md:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              一、选择当前场上英雄
            </h2>
            <p className="mb-4 text-xs text-gray-400">
              后续会接入完整 S17 英雄数据，目前为少量示例。
            </p>
            <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              {MOCK_CHAMPIONS.map((champ) => {
                const selected = userInput.selectedChampions.some(
                  (c) => c.id === champ.id,
                );
                return (
                  <button
                    key={champ.id}
                    type="button"
                    onClick={() => toggleChampion(champ)}
                    className={`flex flex-col rounded-xl border px-3 py-2 text-left text-xs transition md:text-sm ${
                      selected
                        ? "border-primary bg-primary/15 shadow-soft-gold"
                        : "border-white/10 bg-white/5 hover:border-primary/60 hover:bg-white/10"
                    }`}
                  >
                    <span className="font-medium text-white">
                      {champ.nameCn}
                    </span>
                    <span className="mt-1 text-[11px] text-gray-300">
                      {champ.cost} 费 · {champ.traits.join(" / ")}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mb-4 space-y-2">
              <p className="text-xs text-gray-400">已选择英雄：</p>
              {userInput.selectedChampions.length === 0 ? (
                <p className="text-xs text-gray-500">
                  暂未选择，请点选上方英雄卡片。
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userInput.selectedChampions.map((c) => (
                    <span
                      key={c.id}
                      className="pill border border-primary/40 bg-primary/10 text-xs text-primary"
                    >
                      {c.nameCn}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h2 className="mb-3 mt-6 text-lg font-semibold text-white">
              二、填写当前局内信息
            </h2>

            <div className="space-y-4 text-xs md:text-sm">
              <div className="flex flex-col gap-2">
                <label className="text-gray-300">当前阶段</label>
                <div className="flex flex-wrap gap-2">
                  {STAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setUserInput((prev) => ({
                          ...prev,
                          stage: opt.value,
                        }))
                      }
                      className={`rounded-full px-3 py-1 text-xs transition ${
                        userInput.stage === opt.value
                          ? "bg-primary text-black"
                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-300">当前血量</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setUserInput((prev) => ({ ...prev, hpRange: "high" }))
                    }
                    className={`flex-1 rounded-full px-3 py-1 text-xs transition ${
                      userInput.hpRange === "high"
                        ? "bg-emerald-400 text-black"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    70 血以上（偏健康）
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setUserInput((prev) => ({ ...prev, hpRange: "mid" }))
                    }
                    className={`flex-1 rounded-full px-3 py-1 text-xs transition ${
                      userInput.hpRange === "mid"
                        ? "bg-amber-300 text-black"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    40–70 血（中等）
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setUserInput((prev) => ({ ...prev, hpRange: "low" }))
                    }
                    className={`flex-1 rounded-full px-3 py-1 text-xs transition ${
                      userInput.hpRange === "low"
                        ? "bg-rose-400 text-black"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    40 血以下（危险）
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-300">玩法偏好</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setUserInput((prev) => ({ ...prev, playStyle: "stable" }))
                    }
                    className={`flex-1 rounded-full px-3 py-1 text-xs transition ${
                      userInput.playStyle === "stable"
                        ? "bg-primary text-black"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    偏稳运营（保底前四）
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setUserInput((prev) => ({ ...prev, playStyle: "risk" }))
                    }
                    className={`flex-1 rounded-full px-3 py-1 text-xs transition ${
                      userInput.playStyle === "risk"
                        ? "bg-violet-400 text-black"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    接受搏一搏（冲吃鸡）
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRequest}
              disabled={loading || userInput.selectedChampions.length === 0}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary-dark to-primary px-4 py-2.5 text-sm font-semibold text-black shadow-soft-gold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "正在根据局势生成推荐…" : "生成阵容与运营推荐"}
            </button>
            {error && (
              <p className="mt-3 text-xs text-rose-400">
                {error}（请确认后端 FastAPI 已在本地 8000 端口运行）
              </p>
            )}
          </section>

          <section className="card min-h-[300px] p-5 md:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              三、推荐结果
            </h2>
            {recommendations.length === 0 ? (
              <p className="text-sm text-gray-400">
                暂无结果。请在左侧选择你的开局英雄并点击“生成阵容与运营推荐”。本页会展示最终阵容、分阶段过渡方案、装备与强化建议、以及站位思路。
              </p>
            ) : (
              <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
                {recommendations.map((rec, index) => (
                  <article
                    key={rec.compName + index}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-primary">
                          推荐阵容 {index + 1}：{rec.compName}
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          阵容强度：{rec.tier} · 匹配度：
                          {(rec.matchScore * 100).toFixed(0)}%
                        </p>
                        <p className="mt-1 text-[11px] text-gray-400">
                          胜率约：{(rec.winRate * 100).toFixed(1)}% · 前四率约：
                          {(rec.top4Rate * 100).toFixed(1)}% · 登场率：
                          {(rec.pickRate * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-xs text-gray-300">
                        <span className="pill bg-emerald-500/10 text-emerald-300">
                          核心棋子：{rec.coreChampions.join("、")}
                        </span>
                        <span className="pill bg-sky-500/10 text-sky-300">
                          关键羁绊：{rec.traits.join("、")}
                        </span>
                      </div>
                    </header>

                    <section className="mb-3 space-y-2 text-xs text-gray-200">
                      <h4 className="font-semibold text-white">
                        分阶段运营规划
                      </h4>
                      {rec.stages.map((stage) => (
                        <div
                          key={stage.stageLabel}
                          className="rounded-xl bg-white/5 p-3"
                        >
                          <p className="text-[11px] font-semibold text-primary">
                            {stage.stageLabel}
                          </p>
                          <p className="mt-1 text-[11px] text-gray-300">
                            推荐场上：{stage.board.join("、")}
                          </p>
                          <p className="mt-1 text-[11px] text-gray-300">
                            经济与刷牌：{stage.economyPlan}
                          </p>
                          <p className="mt-1 text-[11px] text-gray-400">
                            运营要点：{stage.notes}
                          </p>
                        </div>
                      ))}
                    </section>

                    <section className="mb-3 space-y-1 text-xs text-gray-200">
                      <h4 className="font-semibold text-white">装备规划</h4>
                      {Object.entries(rec.itemsPlan).map(
                        ([champName, plan]) => (
                          <div key={champName} className="ml-1">
                            <p className="text-[11px] text-primary">
                              {champName}
                            </p>
                            <p className="text-[11px] text-gray-300">
                              核心：{plan.core.join("、") || "视情况而定"}
                            </p>
                            {plan.optional.length > 0 && (
                              <p className="text-[11px] text-gray-400">
                                备选：{plan.optional.join("、")}
                              </p>
                            )}
                            {plan.avoid && plan.avoid.length > 0 && (
                              <p className="text-[11px] text-rose-400">
                                不推荐：{plan.avoid.join("、")}
                              </p>
                            )}
                          </div>
                        ),
                      )}
                    </section>

                    <section className="mb-3 space-y-1 text-xs text-gray-200">
                      <h4 className="font-semibold text-white">强化选择</h4>
                      <p className="text-[11px] text-emerald-300">
                        高优先：{rec.augments.highPriority.join("、")}
                      </p>
                      <p className="text-[11px] text-amber-200">
                        中优先：{rec.augments.mediumPriority.join("、")}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        低优先/不推荐：{rec.augments.lowPriority.join("、")}
                      </p>
                    </section>

                    <section className="space-y-1 text-xs text-gray-200">
                      <h4 className="font-semibold text-white">站位与细节</h4>
                      <p className="text-[11px] text-gray-300">
                        前期：{rec.positioning.early}
                      </p>
                      <p className="text-[11px] text-gray-300">
                        中期：{rec.positioning.mid}
                      </p>
                      <p className="text-[11px] text-gray-300">
                        后期：{rec.positioning.late}
                      </p>
                    </section>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

