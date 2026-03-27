export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type TravelProfile = {
  vibe: string[];
  style: string[];
  pace: string;
  climates: string[];
  dining: string[];
  dailyPace: string;
  accommodation: string[];
  destination: string;
  dates?: { start?: string; end?: string };
  budget?: number;
  withWhom?: string;
  notes?: string;
};

// 완전 로컬 더미 AI – 외부 API 0원
export async function generateAiReply(
  messages: ChatMessage[],
  profile?: TravelProfile,
): Promise<{ content: string }> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");

  const dest = profile?.destination ?? "당신이 떠나고 싶은 곳";
  const days = 5;

  const intro =
    "※ 현재는 비용 0원 실험 모드입니다. 외부 AI API를 전혀 사용하지 않고,\n" +
    "   간단한 샘플 일정을 로컬에서 생성하고 있습니다.\n\n";

  const profileSummary = profile
    ? `[여행 프로필 요약]\n` +
      `- 여행지: ${profile.destination}\n` +
      (profile.dates?.start && profile.dates?.end
        ? `- 일정: ${profile.dates.start} ~ ${profile.dates.end}\n`
        : "") +
      (profile.budget ? `- 1인 예산: 약 ${profile.budget.toLocaleString()}원\n` : "") +
      (profile.withWhom ? `- 동행: ${profile.withWhom}\n` : "") +
      (profile.vibe.length ? `- 분위기: ${profile.vibe.join(", ")}\n` : "") +
      (profile.style.length ? `- 스타일: ${profile.style.join(", ")}\n` : "") +
      (profile.climates.length ? `- 선호 기후: ${profile.climates.join(", ")}\n` : "") +
      (profile.accommodation.length
        ? `- 숙소: ${profile.accommodation.join(", ")}\n`
        : "") +
      (profile.notes ? `- 메모: ${profile.notes}\n` : "") +
      "\n"
    : "";

  const basePlan =
    `여행지: ${dest}\n권장 일정: ${days}일 기준 예시 플랜\n\n` +
    "Day 1\n" +
    "- 공항 도착 후 숙소 체크인\n" +
    "- 주변 동네 가볍게 산책하면서 동선 파악\n" +
    "- 현지 맛집에서 가벼운 저녁 및 일찍 휴식\n\n" +
    "Day 2\n" +
    "- 대표 관광지 위주로 둘러보며 사진 촬영\n" +
    "- 카페나 공원에서 여유 있게 휴식\n" +
    "- 저녁에는 야경이 예쁜 스팟 방문\n\n" +
    "Day 3\n" +
    "- 시장, 골목, 로컬 동네 등 덜 알려진 곳 위주로 탐방\n" +
    "- 현지인이 자주 가는 식당/카페 시도\n" +
    "- 원하면 반나절 투어나 체험 프로그램 추가\n\n" +
    "Day 4\n" +
    "- 자유 일정: 쇼핑 / 스파 / 온천 / 카페 투어 등 선택\n" +
    "- 체력이 허락한다면 야간 산책 코스 또는 루프탑 바 방문\n\n" +
    "Day 5\n" +
    "- 여유 있게 체크아웃 준비, 마지막 기념품 쇼핑\n" +
    "- 공항으로 이동 후 귀국\n\n";

  const userSummary = lastUser
    ? `사용자가 마지막으로 말한 내용(요약):\n${lastUser.content.slice(0, 150)}\n\n`
    : "";

  const tips =
    "추가 팁\n" +
    "- 일정 사이사이에 1~2시간씩 '완전 자유시간'을 넣어두면 여행이 훨씬 덜 피곤합니다.\n" +
    "- 대중교통 패스, eSIM, 현지 결제수단을 미리 준비하면 동선이 더 부드러워집니다.\n";

  return {
    content: intro + profileSummary + basePlan + userSummary + tips,
  };
}

