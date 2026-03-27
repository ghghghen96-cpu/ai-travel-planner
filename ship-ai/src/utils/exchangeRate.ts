export async function fetchLiveExchangeRates(): Promise<Record<string, number>> {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const rates = data.rates;
    
    // API 응답(USD 기준)에서 각국 통화별 원화(KRW) 환율을 계산합니다.
    // 1 USD당 통화 환율(rates[currency])과 1 USD당 원화 환율(rates.KRW)을 나눕니다.
    const usdToKrw = rates['KRW'] || 1380;
    
    return {
      USD: usdToKrw, // 1 USD = x KRW
      JPY: usdToKrw / (rates['JPY'] || 150), // 1 JPY = x KRW
      GBP: usdToKrw / (rates['GBP'] || 0.8), // 1 GBP = x KRW
      EUR: usdToKrw / (rates['EUR'] || 0.9), // 1 EUR = x KRW
      CNY: usdToKrw / (rates['CNY'] || 7.2), // 1 CNY = x KRW
    };
  } catch (error) {
    console.error('Failed to fetch live exchange rates:', error);
    // 에러 발생 시 기존 기본 환율 반환
    return {
      USD: 1380,
      JPY: 9.2,
      GBP: 1750,
      EUR: 1500,
      CNY: 190,
    };
  }
}
