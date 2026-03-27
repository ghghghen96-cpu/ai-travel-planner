/**
 * AnalysisSkeleton 컴포넌트
 * URL 분석 중 표시되는 카드 형태의 스켈레톤 로딩 UI
 */
export function AnalysisSkeleton() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-indigo-50/50 to-white flex flex-col items-center justify-center px-4 py-20">
      {/* 상단 로딩 상태 표시 */}
      <div className="flex flex-col items-center mb-12 animate-pulse-slow">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-50"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-10 h-10 text-white animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI가 제품을 분석하고 있습니다</h2>
        <p className="text-gray-400 text-sm">URL에서 상품 정보 및 가격을 추정 중...</p>
        
        {/* 분석 단계 표시 */}
        <div className="flex items-center gap-3 mt-6">
          {['URL 파싱', '상품 분류', '세금 계산', '결과 생성'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                ></div>
                <span className="text-gray-500">{step}</span>
              </div>
              {i < 3 && <div className="w-4 h-px bg-gray-200"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* 스켈레톤 카드 그리드 */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 좌측: 이미지 스켈레톤 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[320px] flex flex-col gap-4">
          <div className="flex-1 bg-gray-100 rounded-2xl skeleton-shimmer"></div>
          <div className="h-3 bg-gray-100 rounded-full w-2/3 skeleton-shimmer"></div>
          <div className="h-3 bg-gray-100 rounded-full w-1/2 skeleton-shimmer"></div>
        </div>

        {/* 우측: 정보 스켈레톤 */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
            <div className="h-3 bg-gray-100 rounded-full w-1/4 skeleton-shimmer"></div>
            <div className="h-7 bg-gray-100 rounded-xl w-full skeleton-shimmer"></div>
            <div className="h-7 bg-gray-100 rounded-xl w-3/4 skeleton-shimmer"></div>
            <div className="h-px bg-gray-100 w-full"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-100 rounded-full w-1/3 skeleton-shimmer"></div>
              <div className="h-4 bg-gray-100 rounded-full w-1/4 skeleton-shimmer"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-100 rounded-full w-1/3 skeleton-shimmer"></div>
              <div className="h-4 bg-gray-100 rounded-full w-1/4 skeleton-shimmer"></div>
            </div>
          </div>

          {/* 결과 총액 스켈레톤 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="text-center space-y-4">
              <div className="h-4 bg-gray-100 rounded-full w-1/3 mx-auto skeleton-shimmer"></div>
              <div className="h-14 bg-indigo-50 rounded-2xl w-3/4 mx-auto skeleton-shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 카드 행 */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
            <div className="h-3 bg-gray-100 rounded-full w-1/2 skeleton-shimmer"></div>
            <div className="h-6 bg-gray-100 rounded-xl w-3/4 skeleton-shimmer"></div>
            <div className="h-3 bg-gray-100 rounded-full w-2/3 skeleton-shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
