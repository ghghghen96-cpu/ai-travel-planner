import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AnalysisSkeleton } from './components/AnalysisSkeleton';
import { ResultPage } from './components/ResultPage';
import { HistorySection } from './components/HistorySection';
import type { ParsedItem, CalculatedCost, HistoryItem } from './types';
import { analyzeUrl, EXCHANGE_RATES } from './utils/urlParser';
import { fetchLiveExchangeRates } from './utils/exchangeRate';

// 현재 뷰 상태 타입
type ViewState = 'home' | 'loading' | 'result';

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [parsedItem, setParsedItem] = useState<ParsedItem | null>(null);
  const [calculatedCost, setCalculatedCost] = useState<CalculatedCost | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // 로그인 및 실시간 환율 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; photoUrl: string } | undefined>(undefined);
  const [liveRates, setLiveRates] = useState<Record<string, number>>(EXCHANGE_RATES);

  // 컴포넌트 마운트 시 실시간 환율 가져오기
  useEffect(() => {
    fetchLiveExchangeRates().then((rates) => {
      setLiveRates(rates);
    });
  }, []);

  const handleCalculate = async (url: string) => {
    // 로딩 뷰로 전환 후 스크롤 상단 이동
    setView('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // URL 파싱 및 상품 정보 추출 (비동기 처리)
      const analysis = await analyzeUrl(url);
      const { shopInfo, productId, name, category, originalPrice, originalCurrency, customsRate, imageUrl } = analysis;

      // 실시간 환율 적용
      const rate = liveRates[originalCurrency] ?? 1380;
      const baseKrw = Math.round(originalPrice * rate);

      // 배송비: 원산지별 다르게 설정
      const shippingByCountry: Record<string, number> = {
        '미국': 15000,
        '일본': 5000,
        '영국': 20000,
        '독일': 20000,
        '중국': 3000,
        '해외': 15000,
      };
      const shippingKrw = shippingByCountry[shopInfo.country] ?? 15000;

      // 미국 de minimis ($200 이하 면세)
      const isDeMinimis = originalCurrency === 'USD' && originalPrice <= 200;
      const customsKrw = isDeMinimis ? 0 : Math.floor(baseKrw * customsRate);
      const vatKrw = isDeMinimis ? 0 : Math.floor((baseKrw + customsKrw) * 0.1);
      const totalKrw = baseKrw + shippingKrw + customsKrw + vatKrw;

      const item: ParsedItem = {
        id: productId,
        url,
        name,
        category,
        imageUrl: imageUrl, // Microlink에서 가져온 실제 이미지 링크
        originalCurrency: originalCurrency as any,
        originalPrice,
        date: new Date().toISOString(),
        shopName: shopInfo.name,
        shopFlag: shopInfo.flag,
        country: shopInfo.country,
        customsRate,
      };

      const cost: CalculatedCost = {
        itemPriceKrw: baseKrw,
        shippingKrw,
        customsKrw,
        vatKrw,
        totalKrw,
        isDeMinimisApplicable: isDeMinimis,
      };

      setParsedItem(item);
      setCalculatedCost(cost);
      setView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('URL Analysis failed:', error);
      alert('상품 분석에 실패했습니다. 올바른 URL인지 다시 한번 확인해주세요.');
      setView('home');
    }
  };

  const handleBack = () => {
    setView('home');
    setParsedItem(null);
    setCalculatedCost(null);
  };

  const handleSaveToHistory = () => {
    // 로그인이 안 되어있으면 유도
    if (!isLoggedIn) {
      alert('검색 기록을 저장하려면 로그인이 필요합니다.');
      return;
    }

    if (parsedItem && calculatedCost) {
      const exists = history.find((h) => h.item.id === parsedItem.id);
      if (!exists) {
        setHistory((prev) => [{ item: parsedItem, cost: calculatedCost }, ...prev]);
        alert('계산 기록이 마이페이지에 저장되었습니다.');
      } else {
        alert('이미 저장된 항목입니다.');
      }
    }
  };

  const handleMockLogin = () => {
    setIsLoggedIn(true);
    setUserProfile({
      name: '사용자',
      photoUrl: 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff' // 기본 아바타
    });
  };

  const handleMockLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(undefined);
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] font-sans">
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogin={handleMockLogin} 
        onLogout={handleMockLogout} 
        userProfile={userProfile} 
      />
      <main className="w-full pt-16">
        {/* 뷰 전환: home / loading / result */}
        {view === 'home' && (
          <>
            <Hero onCalculate={handleCalculate} isLoading={false} />
            {/* 로그인한 경우에만 마이페이지(검색 기록) 표시 */}
            {isLoggedIn && history.length > 0 && <HistorySection history={history} />}
          </>
        )}

        {view === 'loading' && <AnalysisSkeleton />}

        {view === 'result' && parsedItem && calculatedCost && (
          <>
            <ResultPage
              item={parsedItem}
              cost={calculatedCost}
              onBack={handleBack}
              onSave={handleSaveToHistory}
            />
            {/* 로그인한 경우에만 마이페이지(검색 기록) 표시 */}
            {isLoggedIn && history.length > 0 && (
              <div className="max-w-5xl mx-auto px-4 pb-20">
                <HistorySection history={history} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
