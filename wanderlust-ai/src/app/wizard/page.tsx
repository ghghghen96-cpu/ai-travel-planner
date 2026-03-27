"use client";

import { useState } from "react";
import { generateAiReply, type ChatMessage, type TravelProfile } from "../../lib";

type Step1State = {
  vibe: string[];
  style: string[];
  pace: string;
  climates: string[];
  dining: string[];
  dailyPace: string;
  accommodation: string[];
};

type Step2State = {
  destination: string;
};

type Step3State = {
  startDate?: string;
  endDate?: string;
  budget?: number;
  withWhom?: string;
  notes?: string;
};

const vibeOptions = ["사교적 & 활기찬", "조용하고 힐링 중심"];
const styleOptions = ["즉흥적인", "계획적인"];
const paceOptions = ["Chill", "Moderate", "Active"];
const climateOptions = ["열대", "도시", "지중해", "알프스", "사막", "해안"];
const diningOptions = ["길거리 음식", "캐주얼 다이닝", "파인 다이닝"];
const dailyPaceOptions = ["여유롭게", "보통", "빡빡하게"];
const accommodationOptions = ["게스트하우스", "비즈니스 호텔", "럭셔리 호텔", "에어비앤비"];

const destinations = [
  "일본 · 오사카",
  "일본 · 도쿄",
  "스위스 · 인터라켄",
  "뉴질랜드 · 퀸스타운",
  "프랑스 · 니스",
  "인도네시아 · 발리",
  "미국 · 뉴욕",
];

function toggleMulti(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function WizardPage() {
  const [step, setStep] = useState(1);

  const [s1, setS1] = useState<Step1State>({
    vibe: [],
    style: [],
    pace: "Chill",
    climates: [],
    dining: [],
    dailyPace: "여유롭게",
    accommodation: [],
  });

  const [s2, setS2] = useState<Step2State>({ destination: "일본 · 오사카" });

  const [s3, setS3] = useState<Step3State>({
    budget: 2000000,
    withWhom: "혼자",
    notes: "",
  });

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const stepPercent = (step / 3) * 100;

  const handleGeneratePlan = async () => {
    if (generating) return;
    setGenerating(true);

    const profile: TravelProfile = {
      vibe: s1.vibe,
      style: s1.style,
      pace: s1.pace,
      climates: s1.climates,
      dining: s1.dining,
      dailyPace: s1.dailyPace,
      accommodation: s1.accommodation,
      destination: s2.destination,
      dates: { start: s3.startDate, end: s3.endDate },
      budget: s3.budget,
      withWhom: s3.withWhom,
      notes: s3.notes,
    };

    const messages: ChatMessage[] = [
      {
        role: "user",
        content:
          `여행지: ${profile.destination}, 동행: ${profile.withWhom ?? "미정"}, ` +
          `예산: ${profile.budget ? `${profile.budget}원` : "미정"}, ` +
          `분위기: ${profile.vibe.join(", ") || "기본"}, 스타일: ${profile.style.join(", ") || "기본"}.`,
      },
    ];

    const reply = await generateAiReply(messages, profile);
    setResult(reply.content);
    setGenerating(false);
  };

  return (
    <div className="px-5 md:px-8">
      <div className="mx-auto mt-6 md:mt-8 mb-20 max-w-6xl grid gap-6 lg:grid-cols-[1.6fr,1.1fr]">
        {/* 왼쪽: 질문 폼 */}
        <div className="rounded-[32px] bg-zinc-950/85 border border-zinc-800/80 shadow-[0_30px_110px_rgba(0,0,0,0.75)] px-6 md:px-9 lg:px-10 py-7 md:py-8">
          <div className="flex items-center justify-between gap-3 mb-4 md:mb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-emerald-300 mb-1">
                Step {step} of 3
              </p>
              <h2 className="text-xl md:text-[22px] lg:text-[24px] font-semibold tracking-tight text-zinc-50">
                {step === 1 && "당신의 여행 무드를 알려주세요"}
                {step === 2 && "끌리는 목적지를 골라볼까요?"}
                {step === 3 && "현실적인 조건들을 마무리해요"}
              </h2>
            </div>
            <div className="hidden md:flex flex-col items-end text-[11px] text-zinc-400">
              <span>약 3분 소요</span>
              <span>입력한 정보는 언제든 다시 수정 가능</span>
            </div>
          </div>

          <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-lime-300 transition-all"
              style={{ width: `${stepPercent}%` }}
            />
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-medium text-zinc-100 mb-2">여행 분위기</h3>
                <div className="flex flex-wrap gap-2.5">
                  {vibeOptions.map((item) => {
                    const active = s1.vibe.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setS1((prev) => ({ ...prev, vibe: toggleMulti(prev.vibe, item) }))}
                        className={`px-4 py-2 rounded-2xl text-xs border ${active
                            ? "bg-emerald-500 text-black border-emerald-400 shadow-emerald-500/30 shadow"
                            : "bg-zinc-950 border-zinc-700 text-zinc-200 hover:border-zinc-500"
                          }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-medium text-zinc-100 mb-2">탐험 스타일</h3>
                <div className="flex flex-wrap gap-2.5">
                  {styleOptions.map((item) => {
                    const active = s1.style.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setS1((prev) => ({ ...prev, style: toggleMulti(prev.style, item) }))
                        }
                        className={`px-4 py-2 rounded-2xl text-xs border ${active
                            ? "bg-emerald-500 text-black border-emerald-400 shadow-emerald-500/30 shadow"
                            : "bg-zinc-950 border-zinc-700 text-zinc-200 hover:border-zinc-500"
                          }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-zinc-100 mb-2">여행 템포</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {paceOptions.map((item) => {
                      const active = s1.pace === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setS1((prev) => ({ ...prev, pace: item }))}
                          className={`px-4 py-2 rounded-2xl text-xs border ${active
                              ? "bg-emerald-500 text-black border-emerald-400 shadow-emerald-500/30 shadow"
                              : "bg-zinc-950 border-zinc-700 text-zinc-200 hover:border-zinc-500"
                            }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-zinc-100 mb-2">
                    선호 기후 <span className="text-zinc-500 text-[11px]">(복수 선택 가능)</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {climateOptions.map((item) => {
                      const active = s1.climates.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setS1((prev) => ({ ...prev, climates: toggleMulti(prev.climates, item) }))
                          }
                          className={`px-3 py-1.5 rounded-2xl text-[11px] border ${active
                              ? "bg-emerald-500 text-black border-emerald-400"
                              : "bg-zinc-950 border-zinc-700 text-zinc-200 hover:border-zinc-500"
                            }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-zinc-100 mb-2">식사 취향</h3>
                  <div className="flex flex-wrap gap-2">
                    {diningOptions.map((item) => {
                      const active = s1.dining.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setS1((prev) => ({ ...prev, dining: toggleMulti(prev.dining, item) }))
                          }
                          className={`px-3 py-1.5 rounded-2xl text-[11px] border ${active
                              ? "bg-emerald-500 text-black border-emerald-400"
                              : "bg-zinc-950 border-zinc-700 text-zinc-200 hover:border-zinc-500"
                            }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-zinc-100 mb-2">선호 숙소 유형</h3>
                  <div className="flex flex-wrap gap-2">
                    {accommodationOptions.map((item) => {
                      const active = s1.accommodation.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setS1((prev) => ({
                              ...prev,
                              accommodation: toggleMulti(prev.accommodation, item),
                            }))
                          }
                          className={`px-3 py-1.5 rounded-2xl text-[11px] border ${active
                              ? "bg-emerald-500 text-black border-emerald-400"
                              : "bg-zinc-950 border-zinc-700 text-zinc-200 hover:border-zinc-500"
                            }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs md:text-sm text-zinc-400 mb-2">
                앞에서 선택한 여행 스타일을 바탕으로 잘 맞을 것 같은 여행지 후보입니다. 가장 끌리는
                곳을 골라보세요.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {destinations.map((dest) => {
                  const active = s2.destination === dest;
                  return (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setS2({ destination: dest })}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs md:text-sm ${active
                          ? "border-emerald-400 bg-emerald-500/10 text-emerald-50 shadow-emerald-500/20 shadow"
                          : "border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-zinc-500"
                        }`}
                    >
                      <div>
                        <p className="font-medium">{dest}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          AI가 추천하는 맞춤 여행지
                        </p>
                      </div>
                      <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-[10px]">
                        {active ? "선택됨" : "선택"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">출발 날짜</label>
                  <input
                    type="date"
                    value={s3.startDate ?? ""}
                    onChange={(e) => setS3((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">귀국 날짜</label>
                  <input
                    type="date"
                    value={s3.endDate ?? ""}
                    onChange={(e) => setS3((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-[1.4fr,1fr] gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">
                    1인당 예산 (대략, 원)
                  </label>
                  <input
                    type="number"
                    value={s3.budget ?? ""}
                    onChange={(e) =>
                      setS3((prev) => ({
                        ...prev,
                        budget: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">누구와 함께 가시나요?</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {(["혼자", "커플", "친구", "가족"] as const).map((who) => {
                      const active = s3.withWhom === who;
                      return (
                        <button
                          key={who}
                          type="button"
                          onClick={() => setS3((prev) => ({ ...prev, withWhom: who }))}
                          className={`px-4 py-1.5 rounded-2xl text-[11px] border ${active
                              ? "bg-emerald-500 text-black border-emerald-400"
                              : "bg-zinc-950 border-zinc-700 text-zinc-200 hover:border-zinc-500"
                            }`}
                        >
                          {who}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">
                  특별히 고려해야 할 점이 있다면 적어주세요
                </label>
                <textarea
                  rows={4}
                  value={s3.notes ?? ""}
                  onChange={(e) => setS3((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="예: 야간 활동은 최소화하고 싶어요 / 해산물 알레르기가 있어요 / 기념일 여행입니다."
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              <div className="rounded-2xl bg-zinc-900/80 border border-zinc-700 px-4 py-3 text-[11px] text-zinc-300">
                <p className="font-medium mb-1 text-zinc-100">지금까지 선택한 내용 요약</p>
                <p className="mb-0.5">
                  · 여행지: <span className="text-emerald-300">{s2.destination}</span>
                </p>
                <p className="mb-0.5">
                  · 분위기: {s1.vibe.length ? s1.vibe.join(", ") : "선택 안 함"} / 스타일:{" "}
                  {s1.style.length ? s1.style.join(", ") : "선택 안 함"} / 템포: {s1.pace}
                </p>
                <p className="mb-0.5">
                  · 예산: {s3.budget ? `${s3.budget.toLocaleString()}원` : "미정"} / 동행:{" "}
                  {s3.withWhom ?? "미정"} / 선호 기후:{" "}
                  {s1.climates.length ? s1.climates.join(", ") : "선택 안 함"}
                </p>
                <p className="text-zinc-400 mt-1">
                  이 정보를 바탕으로 이후 AI가 일자별 일정과 추천 스팟을 제안하게 됩니다.
                </p>
              </div>

              {result && (
                <div className="rounded-2xl bg-black/70 border border-emerald-400/40 px-4 py-3 text-[11px] md:text-xs text-zinc-100 whitespace-pre-wrap">
                  <p className="text-[11px] font-semibold text-emerald-300 mb-1">
                    AI 샘플 일정 (비용 0원 더미 모드)
                  </p>
                  {result}
                </div>
              )}
            </div>
          )}

          {/* 하단 내비게이션 버튼 */}
          <div className="mt-7 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              className="text-xs md:text-sm text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
            >
              이전 단계
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.min(3, prev + 1))}
                className="px-6 md:px-7 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-xs md:text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 transition-colors"
              >
                다음 단계
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={generating}
                className="px-6 md:px-7 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-xs md:text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 transition-colors"
              >
                {generating ? "일정 생성 중..." : "AI 샘플 일정 생성하기"}
              </button>
            )}
          </div>
        </div>

        {/* 오른쪽: 실시간 요약 & 샘플 일정 카드 */}
        <div className="space-y-4">
          <div className="rounded-[28px] bg-gradient-to-b from-emerald-500/15 via-zinc-900/90 to-black border border-emerald-400/40 px-5 py-5 shadow-[0_28px_80px_rgba(0,0,0,0.8)]">
            <p className="text-[11px] text-emerald-300 mb-1">여행 프로필 프리뷰</p>
            <h3 className="text-sm font-semibold mb-3">
              {s2.destination} ·{" "}
              {s3.withWhom ? `${s3.withWhom}와(과) 함께` : "동행 미정"}
            </h3>
            <ul className="space-y-1.5 text-[11px] text-zinc-200">
              <li>
                <span className="text-zinc-400">분위기</span>{" "}
                {s1.vibe.length ? s1.vibe.join(", ") : "아직 선택 안 함"}
              </li>
              <li>
                <span className="text-zinc-400">스타일</span>{" "}
                {s1.style.length ? s1.style.join(", ") : "아직 선택 안 함"}
              </li>
              <li>
                <span className="text-zinc-400">선호 기후</span>{" "}
                {s1.climates.length ? s1.climates.join(", ") : "아직 선택 안 함"}
              </li>
              <li>
                <span className="text-zinc-400">예산</span>{" "}
                {s3.budget ? `${s3.budget.toLocaleString()}원` : "미정"}
              </li>
              <li>
                <span className="text-zinc-400">날짜</span>{" "}
                {s3.startDate && s3.endDate
                  ? `${s3.startDate} ~ ${s3.endDate}`
                  : "여행 날짜 미정"}
              </li>
            </ul>
            {s3.notes && (
              <p className="mt-3 text-[11px] text-zinc-300">
                <span className="text-zinc-400">메모</span> {s3.notes}
              </p>
            )}
          </div>

          <div className="rounded-[28px] bg-black/80 border border-zinc-800 px-5 py-4 max-h-[260px] overflow-y-auto">
            <p className="text-[11px] text-zinc-400 mb-2">
              {result
                ? "AI가 제안한 샘플 일정"
                : "정보를 채운 뒤, 왼쪽에서 샘플 일정을 생성해 보세요."}
            </p>
            {result && (
              <div className="text-[11px] md:text-xs text-zinc-100 whitespace-pre-wrap">
                {result}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

