import type { CalculatedCost } from '../types';
import { Info, Calculator, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';

interface ResultViewProps {
  cost: CalculatedCost | null;
  onSave?: () => void;
}

export function ResultView({ cost, onSave }: ResultViewProps) {
  if (!cost) return null;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 pb-20 animate-fade-in-up delay-200">
      <div className="bg-white rounded-3xl shadow-xl border border-indigo-50 p-6 md:p-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-emerald-400"></div>
        
        <div className="text-center mb-10">
          <h2 className="text-lg font-semibold text-gray-500 mb-2">총 예상 결제 금액</h2>
          <div className="text-5xl md:text-6xl font-extrabold text-indigo-600 flex items-baseline justify-center gap-2">
            <span>{cost.totalKrw.toLocaleString()}</span>
            <span className="text-2xl text-gray-400 font-medium tracking-tighter">KRW</span>
          </div>
          {cost.isDeMinimisApplicable && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              미국발 $200 이하 상품으로 관세/부가세 면제 대상입니다
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Breakdown Table */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-500" />
              비용 상세 내역
            </h3>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 flex items-center gap-2"><ShoppingBag className="w-4 h-4"/> 상품 가격</span>
              <span className="font-semibold">{cost.itemPriceKrw.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 flex items-center gap-2"><Truck className="w-4 h-4"/> 예상 국제 배송비</span>
              <span className="font-semibold">{cost.shippingKrw.toLocaleString()} 원</span>
            </div>
            
            <div className="h-px bg-gray-200 w-full my-4"></div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">관세 (8% 가정)</span>
              <span className={`font-semibold ${cost.isDeMinimisApplicable ? 'text-emerald-500' : 'text-gray-800'}`}>
                {cost.customsKrw > 0 ? `${cost.customsKrw.toLocaleString()} 원` : '면제 (0원)'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">부가세 (10%)</span>
              <span className={`font-semibold ${cost.isDeMinimisApplicable ? 'text-emerald-500' : 'text-gray-800'}`}>
                {cost.vatKrw > 0 ? `${cost.vatKrw.toLocaleString()} 원` : '면제 (0원)'}
              </span>
            </div>

          </div>

          {/* Action Area */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-4">
              <div className="flex gap-3 text-yellow-800">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  본 예측 결과는 입력하신 URL의 상품 정보를 바탕으로 AI가 추정한 금액입니다. 품목 분류나 실제 환율 적용 시점에 따라 최종 청구 금액과 다소 차이가 발생할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200">
                쇼핑몰로 바로 이동하기
              </button>
              <button onClick={onSave} className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-xl border border-gray-200 transition-transform hover:scale-105 active:scale-95">
                계산 기록에 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
