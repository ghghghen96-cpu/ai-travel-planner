export default function Home() {
  return (
    <div className="px-5 md:px-8">
      {/* HERO SECTION */}
      <section className="mx-auto mt-6 md:mt-10 max-w-6xl grid gap-6 md:grid-cols-[1.6fr,1.1fr] items-stretch">
        {/* 왼쪽: 카피 + CTA */}
        <div className="relative flex flex-col justify-center rounded-[32px] bg-gradient-to-br from-sky-500/20 via-emerald-500/10 to-zinc-900/80 border border-zinc-700/70 px-6 md:px-10 py-7 md:py-10 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
          <div className="pointer-events-none absolute -left-24 top-10 h-60 w-60 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-5 md:gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-black/40 px-3 py-1 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-emerald-200">
                AI TRAVEL DESIGNER
              </span>
            </div>

            <h1 className="text-[30px] leading-tight md:text-[38px] md:leading-snug lg:text-[44px] lg:leading-snug font-semibold tracking-tight text-zinc-50">
              오늘 밤에{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-lime-200">
                떠난다면
              </span>
              ,<br />
              어디로 가고 싶나요?
            </h1>

            <p className="text-sm md:text-[15px] text-zinc-200/90 max-w-xl">
              WanderLust AI는 당신의 여행 스타일·예산·동행 정보를 이해하고,
              실제로 당장 떠날 수 있을 만큼 구체적인 일자별 여행 플랜을 제안합니다.
              복잡한 일정 짜기는 AI에게 맡기고, 설렘만 챙겨가세요.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href="/wizard"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-black px-7 py-3 shadow-lg shadow-emerald-500/40 transition-colors"
              >
                3분 만에 나만의 여행 만들기
              </a>
              <button
                type="button"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-zinc-500/40 bg-black/40 hover:bg-zinc-900/80 text-xs md:text-sm font-medium text-zinc-100 px-6 py-3"
              >
                데모 일정 먼저 구경하기
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-300">
              <span className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1">
                일본 소도시 감성여행
              </span>
              <span className="rounded-full border border-sky-400/50 bg-sky-500/10 px-3 py-1">
                유럽 자유 일정 설계
              </span>
              <span className="rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 px-3 py-1">
                MBTI 기반 여행 스타일 추천
              </span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 여행 미리보기 카드 + 작은 썸네일 리스트 */}
        <div className="space-y-4">
          <div className="relative h-[260px] md:h-[300px] rounded-[28px] overflow-hidden border border-zinc-700/70 shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=1600')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

            <div className="relative flex h-full flex-col justify-between p-4 md:p-5">
              <div className="flex items-center justify-between text-[11px] text-zinc-200">
                <span className="rounded-full bg-black/50 px-3 py-1 border border-white/10">
                  일본 · 오사카 4박 5일
                </span>
                <span className="rounded-full bg-emerald-500/90 text-black px-3 py-1 font-semibold">
                  Chill · Solo
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-zinc-200">
                  <div className="flex-1 rounded-2xl bg-black/55 border border-white/10 px-3 py-2.5">
                    <p className="text-[10px] text-zinc-400">첫날 밤</p>
                    <p className="mt-0.5 text-xs font-semibold">
                      도톤보리 네온사인 &amp; 로컬 이자카야
                    </p>
                  </div>
                  <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 px-3 py-2.5">
                    <p className="text-[10px] text-zinc-400">둘째 날</p>
                    <p className="mt-0.5 text-xs font-semibold">
                      교토 기온 골목 산책 &amp; 카페 투어
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-black/55 border border-emerald-400/40 px-3 py-2.5 text-[11px] text-emerald-100">
                  AI가 추천한 하루 요약:
                  <br />
                  아침엔 한적한 신사와 공원 산책, 오후엔 시장·상점가 탐방, 저녁엔 야경이 예쁜 강가
                  산책 코스로 마무리해요.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-black/70 border border-zinc-800 px-4 py-3">
            <p className="text-[11px] text-zinc-400 mb-2">요즘 인기있는 여행 무드</p>
            <div className="flex gap-2 overflow-x-auto pb-1 text-[11px]">
              {[
                "스위스 · 인터라켄 · 알프스뷰 트레킹",
                "발리 · 우붓 · 힐링 풀빌라 스테이",
                "프랑스 · 니스 · 지중해 드라이브",
                "뉴질랜드 · 퀸스타운 · 액티비티 여행",
              ].map((label) => (
                <div
                  key={label}
                  className="shrink-0 rounded-2xl border border-zinc-700 bg-zinc-900/80 px-3 py-2 hover:border-emerald-400/70 cursor-default transition-colors"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="mx-auto mt-10 max-w-6xl grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] bg-black/70 border border-zinc-800 px-4 py-4 md:px-5 md:py-5">
          <p className="text-[11px] text-emerald-300 mb-1">01 · SMART ITINERARY</p>
          <h3 className="text-sm font-semibold mb-1">동선까지 계산된 일정</h3>
          <p className="text-[12px] text-zinc-400">
            이동 시간·체력·휴식 비율을 고려해, 하루에 꼭 맞는 방문 개수와 루트를 제안합니다.
          </p>
        </div>
        <div className="rounded-[24px] bg-black/70 border border-zinc-800 px-4 py-4 md:px-5 md:py-5">
          <p className="text-[11px] text-sky-300 mb-1">02 · HIDDEN GEMS</p>
          <h3 className="text-sm font-semibold mb-1">현지인만 아는 스팟</h3>
          <p className="text-[12px] text-zinc-400">
            관광지뿐 아니라 골목 카페, 로컬 시장, 산책 루트 등 숨은 장소까지 함께 추천해 줍니다.
          </p>
        </div>
        <div className="rounded-[24px] bg-black/70 border border-zinc-800 px-4 py-4 md:px-5 md:py-5">
          <p className="text-[11px] text-fuchsia-300 mb-1">03 · MEMORY KEEPING</p>
          <h3 className="text-sm font-semibold mb-1">모든 대화가 기록되는 여행노트</h3>
          <p className="text-[12px] text-zinc-400">
            AI와 나눈 대화와 수정된 일정이 자동으로 저장되어, 여행 직전까지 계속 다듬을 수 있어요.
          </p>
        </div>
      </section>
    </div>
  );
}
