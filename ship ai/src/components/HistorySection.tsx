import type { HistoryItem } from '../types';
import { Clock, ExternalLink } from 'lucide-react';

interface HistorySectionProps {
  history: HistoryItem[];
}

export function HistorySection({ history }: HistorySectionProps) {
  if (history.length === 0) return null;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-16 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-8">
        <Clock className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl font-bold text-gray-900">최근 계산 기록</h2>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 border-b border-gray-100 text-sm font-semibold text-gray-500 text-center md:text-left hidden md:grid">
          <div className="col-span-5 pl-4">상품 정보</div>
          <div className="col-span-2">원래 가격</div>
          <div className="col-span-3 text-right">최종 결제 금액(KRW)</div>
          <div className="col-span-2 text-right pr-4">바로가기</div>
        </div>

        <div className="divide-y divide-gray-100">
          {history.map((record) => (
            <div key={record.item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-indigo-50/30 transition-colors">
              <div className="col-span-1 md:col-span-1 flex justify-center">
                <img 
                  src={record.item.imageUrl} 
                  alt={record.item.name} 
                  className="w-16 h-16 object-contain rounded-lg bg-white border border-gray-100 p-1"
                />
              </div>
              <div className="col-span-1 md:col-span-4 pr-4 text-center md:text-left">
                <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm">{record.item.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{new Date(record.item.date).toLocaleDateString()}</p>
              </div>
              
              <div className="col-span-1 md:col-span-2 text-center md:text-left text-sm text-gray-500">
                {record.item.originalCurrency} {record.item.originalPrice.toLocaleString()}
              </div>
              
              <div className="col-span-1 md:col-span-3 text-center md:text-right">
                <span className="font-bold text-lg text-indigo-600">
                  {record.cost.totalKrw.toLocaleString()} 원
                </span>
                {record.cost.isDeMinimisApplicable && (
                  <div className="text-xs text-emerald-500 font-medium mt-0.5">면세 적용됨</div>
                )}
              </div>
              
              <div className="col-span-1 md:col-span-2 flex justify-center md:justify-end pr-4">
                <a 
                  href={record.item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-600 p-2 rounded-xl transition-colors shadow-sm"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
