import type { ParsedItem, CalculatedCost } from '../types';
import { ArrowLeft, ExternalLink, BookmarkPlus, Info, Calculator, ShoppingBag, Truck, CheckCircle2, AlertCircle, Globe } from 'lucide-react';

interface ResultPageProps {
  item: ParsedItem;
  cost: CalculatedCost;
  onBack: () => void;
  onSave: () => void;
}

export function ResultPage({ item, cost, onBack, onSave }: ResultPageProps) {
  const handleGoToShop = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-indigo-50/30 to-white animate-fade-in-up">
      {/* 상단 네비게이션 바 */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            다시 분석하기
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            AI 분석 완료
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* ─── 섹션 1: 상품 정보 카드 ─── */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-emerald-400"></div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* 상품 이미지 */}
            <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-6 min-h-[260px]">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="max-h-56 w-auto object-contain rounded-xl hover:scale-105 transition-transform duration-500"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `
                      <div class="flex flex-col items-center text-gray-400 gap-2">
                        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="text-sm">이미지 미리보기 없음</span>
                      </div>`;
                  }}
                />
              ) : (
                <div className="flex flex-col items-center text-gray-300 gap-3">
                  <ShoppingBag className="w-16 h-16" />
                  <span className="text-sm text-gray-400">이미지 없음</span>
                </div>
              )}
            </div>

            {/* 상품 정보 */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{(item as any).shopFlag ?? '🌐'}</span>
                  <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {(item as any).shopName ?? '해외 쇼핑몰'}&nbsp;·&nbsp;{item.category}
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">{item.name}</h1>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">원화가격 (환율 적용)</span>
                  <span className="text-lg font-bold text-gray-800">{cost.itemPriceKrw.toLocaleString()} 원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">현지 가격</span>
                  <span className="text-base font-semibold text-gray-600">
                    {item.originalCurrency} {item.originalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleGoToShop}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 font-semibold py-3 px-6 rounded-2xl transition-all"
              >
                <Globe className="w-4 h-4" />
                쇼핑몰에서 상품 직접 확인하기
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ─── 섹션 2: 비용 계산 상세 ─── */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-emerald-400"></div>
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-2">AI 예상 최종 결제 금액</p>
              <div className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500 flex items-baseline justify-center gap-3">
                <span>{cost.totalKrw.toLocaleString()}</span>
                <span className="text-2xl text-gray-300 font-medium">KRW</span>
              </div>
              {cost.isDeMinimisApplicable && (
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  미국발 $200 이하 — 관세·부가세 면제 적용
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 내역 테이블 */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
                  <Calculator className="w-5 h-5 text-indigo-500" />
                  비용 상세 내역
                </h3>

                {[
                  { label: '상품 가격', icon: <ShoppingBag className="w-4 h-4" />, value: `${cost.itemPriceKrw.toLocaleString()} 원`, highlight: false },
                  { label: '예상 국제 배송비', icon: <Truck className="w-4 h-4" />, value: `${cost.shippingKrw.toLocaleString()} 원`, highlight: false },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 flex items-center gap-2">{row.icon}{row.label}</span>
                    <span className="font-bold text-gray-800">{row.value}</span>
                  </div>
                ))}

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">관세 ({Math.round((item as any).customsRate * 100 ?? 8)}%)</span>
                  <span className={`font-bold ${cost.customsKrw === 0 ? 'text-emerald-500' : 'text-gray-800'}`}>
                    {cost.customsKrw > 0 ? `${cost.customsKrw.toLocaleString()} 원` : '면제 (0원)'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">부가세 (10%)</span>
                  <span className={`font-bold ${cost.vatKrw === 0 ? 'text-emerald-500' : 'text-gray-800'}`}>
                    {cost.vatKrw > 0 ? `${cost.vatKrw.toLocaleString()} 원` : '면제 (0원)'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-indigo-100">
                  <span className="font-extrabold text-gray-900 text-lg">합계</span>
                  <span className="font-extrabold text-indigo-600 text-xl">{cost.totalKrw.toLocaleString()} 원</span>
                </div>
              </div>

              {/* 액션 및 주의사항 */}
              <div className="flex flex-col gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3 text-amber-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                  <p className="text-sm leading-relaxed">
                    본 결과는 입력된 URL 정보를 기반으로 AI가 <strong>예측</strong>한 금액입니다.
                    실제 상품 가격 및 환율, 세관 분류에 따라 차이가 발생할 수 있습니다.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-3">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
                  <div className="text-sm text-blue-800 space-y-1">
                    <p className="font-semibold">적용된 계산 기준</p>
                    <p>• 쇼핑몰: {(item as any).shopName ?? '해외 쇼핑몰'} ({(item as any).country ?? '해외'})</p>
                    <p>• 카테고리: {item.category}</p>
                    <p>• 환율: 1 {item.originalCurrency} ≈ {((cost.itemPriceKrw / item.originalPrice) | 0).toLocaleString()} 원</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                  <button
                    onClick={handleGoToShop}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    쇼핑몰로 바로 이동
                  </button>
                  <button
                    onClick={onSave}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-2xl border border-gray-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <BookmarkPlus className="w-5 h-5" />
                    계산 기록에 저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
