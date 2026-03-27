import type { ParsedItem } from '../types';
import { Settings, Info } from 'lucide-react';

interface AnalysisViewProps {
  isLoading: boolean;
  item: ParsedItem | null;
}

export function AnalysisView({ isLoading, item }: AnalysisViewProps) {
  if (!isLoading && !item) return null;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8 mb-8 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">분석 결과 확인</h2>
        <div className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-medium">
          <Settings className="w-3 h-3 animate-spin-slow" /> AI 최적화 완료
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Product Image */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-center min-h-[300px]">
          {isLoading ? (
            <div className="w-full h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
          ) : (
            <img 
              src={item?.imageUrl} 
              alt="Product" 
              className="w-full max-w-sm h-auto object-contain rounded-xl hover:scale-105 transition-transform duration-500 cursor-pointer"
            />
          )}
        </div>

        {/* Right: Item Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse"></div>
                <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-emerald-600 tracking-wide uppercase">
                  {item?.category}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                  {item?.name}
                </h3>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-500">원화 환산 기준가</span>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">
                        Original Price: {item?.originalCurrency} {item?.originalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex gap-3 text-sm text-blue-800">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
            <p>
              이 상품은 <strong>{item?.category}</strong> 카테고리로 분류되었습니다. 카테고리에 따라 적용되는 관세 및 부가세율이 다를 수 있습니다. 변경이 필요하시면 아래 항목을 클릭하세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
