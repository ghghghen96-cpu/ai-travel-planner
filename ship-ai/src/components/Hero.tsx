import { useState } from 'react';
import { Sparkles, ArrowRight, ShoppingBag, Tag, CheckCircle, Smartphone, Store } from 'lucide-react';

interface HeroProps {
  onCalculate: (url: string) => void;
  isLoading: boolean;
}

export function Hero({ onCalculate, isLoading }: HeroProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onCalculate(url.trim());
    }
  };

  return (
    <section className="w-full min-h-[80vh] flex flex-col items-center justify-center px-4 pt-20 pb-16 relative overflow-hidden">
      {/* Background gradients for aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
      
      <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>AI 기반 지능형 직구 비용 계산기</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          복잡한 직구 정보,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">
            단 한 줄의 URL로 끝내세요.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl">
          URL만 넣으면 상품 정보 인식부터 관세 부가세, 배송비까지 AI가 즉시 분석하여 최종 예상 결제 금액을 알려드립니다.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-3xl mt-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center w-full bg-white/80 glass-effect rounded-3xl p-2 shadow-xl">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="아마존, 이베이 등 해외 쇼핑몰 상품 URL을 붙여넣으세요"
                className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-gray-800 text-lg md:text-xl placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    분석 시작하기 <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Links for Shopping Sites */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10 animate-fade-in delay-500">
            {[
              { name: 'Amazon', url: 'https://www.amazon.com', icon: ShoppingBag, color: 'hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200' },
              { name: 'eBay', url: 'https://www.ebay.com', icon: Tag, color: 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200' },
              { name: 'Nike', url: 'https://www.nike.com', icon: CheckCircle, color: 'hover:bg-gray-100 hover:text-black hover:border-gray-300' },
              { name: 'Apple', url: 'https://www.apple.com', icon: Smartphone, color: 'hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200' },
              { name: 'Walmart', url: 'https://www.walmart.com', icon: Store, color: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100' },
            ].map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 group px-5 py-2.5 rounded-2xl bg-white/60 border border-gray-100 text-sm font-bold text-gray-600 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1.5 ${site.color}`}
              >
                <site.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                {site.name}
              </a>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}
