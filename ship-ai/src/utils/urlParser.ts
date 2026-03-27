/**
 * URL 파싱 유틸리티 (비동기화)
 * Microlink API 등을 활용하여 실제 페이지의 메타데이터(이미지, 제목 등)를 가져옵니다.
 */

interface ShopInfo {
  domain: string;
  name: string;
  currency: string;
  flag: string;
  country: string;
}

interface ShopInfo {
  domain: string;
  name: string;
  currency: string;
  flag: string;
  country: string;
}

// 주요 쇼핑몰 정보 맵
const SHOP_MAP: Record<string, ShopInfo> = {
  'amazon.com': { domain: 'amazon.com', name: 'Amazon', currency: 'USD', flag: '🇺🇸', country: '미국' },
  'amazon.co.jp': { domain: 'amazon.co.jp', name: 'Amazon Japan', currency: 'JPY', flag: '🇯🇵', country: '일본' },
  'amazon.co.uk': { domain: 'amazon.co.uk', name: 'Amazon UK', currency: 'GBP', flag: '🇬🇧', country: '영국' },
  'amazon.de': { domain: 'amazon.de', name: 'Amazon Germany', currency: 'EUR', flag: '🇩🇪', country: '독일' },
  'ebay.com': { domain: 'ebay.com', name: 'eBay', currency: 'USD', flag: '🇺🇸', country: '미국' },
  'ebay.co.uk': { domain: 'ebay.co.uk', name: 'eBay UK', currency: 'GBP', flag: '🇬🇧', country: '영국' },
  'walmart.com': { domain: 'walmart.com', name: 'Walmart', currency: 'USD', flag: '🇺🇸', country: '미국' },
  'target.com': { domain: 'target.com', name: 'Target', currency: 'USD', flag: '🇺🇸', country: '미국' },
  'bestbuy.com': { domain: 'bestbuy.com', name: 'Best Buy', currency: 'USD', flag: '🇺🇸', country: '미국' },
  'nike.com': { domain: 'nike.com', name: 'Nike', currency: 'USD', flag: '🇺🇸', country: '미국' },
  'adidas.com': { domain: 'adidas.com', name: 'Adidas', currency: 'USD', flag: '🇺🇸', country: '미국' },
  'apple.com': { domain: 'apple.com', name: 'Apple Store', currency: 'USD', flag: '🇺🇸', country: '미국' },
  'rakuten.co.jp': { domain: 'rakuten.co.jp', name: 'Rakuten', currency: 'JPY', flag: '🇯🇵', country: '일본' },
  'qoo10.com': { domain: 'qoo10.com', name: 'Qoo10', currency: 'USD', flag: '🌏', country: '해외' },
  'aliexpress.com': { domain: 'aliexpress.com', name: 'AliExpress', currency: 'USD', flag: '🇨🇳', country: '중국' },
};

const DEFAULT_SHOP: ShopInfo = {
  domain: 'unknown',
  name: '해외 쇼핑몰',
  currency: 'USD',
  flag: '🌐',
  country: '해외',
};

function detectShop(url: string): ShopInfo {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    for (const [key, info] of Object.entries(SHOP_MAP)) {
      if (hostname.includes(key)) return info;
    }
    return DEFAULT_SHOP;
  } catch {
    return DEFAULT_SHOP;
  }
}

function extractKeywords(url: string, metaTitle?: string): string[] {
  try {
    const sourceText = metaTitle ? `${metaTitle} ${url}` : url;
    
    const words = sourceText
      .split(/[\/\-_+&=%?,.;:!~*@()|[\]\s]+/)
      .map(w => w.trim())
      .filter(w => w.length > 2 && !/^\d+$/.test(w) && !/^[A-Z0-9]{5,}$/.test(w));
    
    // 일반적인 쓰레기 단어 및 도메인 제거 필터
    const stopWords = ['dp', 'ref', 'com', 'www', 'http', 'https', 'item', 'product', 'detail', 'amazon', 'ebay', 'walmart', 'buy'];
    const filtered = words.filter(w => !stopWords.includes(w.toLowerCase()));
    
    return [...new Set(filtered)].slice(0, 10);
  } catch {
    return [];
  }
}

function extractProductId(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    const asinMatch = path.match(/\/dp\/([A-Z0-9]{10})/i) || path.match(/\/gp\/product\/([A-Z0-9]{10})/i);
    if (asinMatch) return asinMatch[1];
    
    const ebayMatch = path.match(/\/itm\/(\d{10,})/);
    if (ebayMatch) return ebayMatch[1];
    
    const idMatch = path.match(/[\/=](\d{5,})/);
    if (idMatch) return idMatch[1];
    
    const hash = url.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
    return Math.abs(hash).toString(36).toUpperCase();
  } catch {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }
}

function inferCategory(keywords: string[], shopDomain: string): { category: string; customsRate: number } {
  const text = keywords.join(' ').toLowerCase();
  
  const categoryMap = [
    { patterns: ['shoe', 'sneaker', 'boot', 'sandal', 'loafer', 'jordan', 'yeezy', 'air', 'max', 'nike', 'adidas', 'new balance'], category: '신발', customsRate: 0.13 },
    { patterns: ['shirt', 'pants', 'jacket', 'coat', 'dress', 'sweater', 'hoodie', 'jeans', 'top', 'bottom', 'clothing', 'apparel', 'wear'], category: '의류', customsRate: 0.13 },
    { patterns: ['bag', 'backpack', 'handbag', 'wallet', 'purse', 'luggage', 'tote', 'suitcase'], category: '가방/지갑', customsRate: 0.08 },
    { patterns: ['iphone', 'ipad', 'macbook', 'galaxy', 'laptop', 'tablet', 'phone', 'smartphone', 'computer', 'pc', 'monitor', 'keyboard', 'mouse', 'headphone', 'earphone', 'airpods', 'camera', 'tv', 'console', 'gaming', 'electronics'], category: '전자제품', customsRate: 0.08 },
    { patterns: ['watch', 'clock', 'smartwatch', 'apple watch', 'galaxy watch'], category: '시계', customsRate: 0.08 },
    { patterns: ['vitamin', 'supplement', 'protein', 'omega', 'collagen', 'health', 'fitness'], category: '건강식품', customsRate: 0.05 },
    { patterns: ['skincare', 'makeup', 'lipstick', 'foundation', 'serum', 'moisturizer', 'cream', 'perfume', 'cologne'], category: '화장품/향수', customsRate: 0.06 },
    { patterns: ['book', 'novel', 'manga', 'comic', 'textbook'], category: '도서', customsRate: 0.0 },
    { patterns: ['toy', 'lego', 'doll', 'action figure', 'board game', 'puzzle'], category: '완구/취미', customsRate: 0.08 },
    { patterns: ['instrument', 'guitar', 'piano', 'keyboard', 'drum', 'music'], category: '악기', customsRate: 0.05 },
    { patterns: ['kitchen', 'cookware', 'blender', 'coffee', 'espresso', 'appliance'], category: '주방/가전', customsRate: 0.08 },
  ];
  
  if (shopDomain.includes('nike') || shopDomain.includes('adidas')) return { category: '스포츠/신발', customsRate: 0.13 };
  if (shopDomain.includes('apple')) return { category: '전자제품', customsRate: 0.08 };
  
  for (const { patterns, category, customsRate } of categoryMap) {
    if (patterns.some(p => text.includes(p))) {
      return { category, customsRate };
    }
  }
  return { category: '일반 해외 상품', customsRate: 0.08 };
}

function buildProductName(keywords: string[], shopName: string, metaTitle?: string): string {
  if (metaTitle) {
    // 상품명에서 너무 긴 설명문구(예: | Amazon.com 등) 자르기
    return metaTitle.split(/[-|]/)[0].trim();
  }
  
  if (keywords.length === 0) return `${shopName} 상품`;
  
  const meaningful = keywords
    .filter(k => k.length > 2)
    .slice(0, 6)
    .map(k => k.charAt(0).toUpperCase() + k.slice(1))
    .join(' ');
  return meaningful || `${shopName} 상품`;
}

function simulatePrice(keywords: string[], category: string, currency: string): number {
  const text = keywords.join(' ').toLowerCase();
  
  const priceRanges: Record<string, [number, number]> = {
    '전자제품': [150, 1200],
    '신발': [80, 350],
    '스포츠/신발': [80, 300],
    '의류': [30, 200],
    '가방/지갑': [50, 500],
    '시계': [100, 800],
    '건강식품': [20, 100],
    '화장품/향수': [20, 200],
    '도서': [10, 50],
    '완구/취미': [20, 150],
    '악기': [100, 1000],
    '주방/가전': [30, 300],
    '일반 해외 상품': [30, 300],
  };
  
  const [min, max] = priceRanges[category] ?? [30, 300];
  const premiumKeywords = ['pro', 'plus', 'max', 'ultra', 'premium', 'deluxe', 'limited', 'special', 'exclusive'];
  const isPremium = premiumKeywords.some(k => text.includes(k));
  
  const seed = text.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const ratio = (seed % 100) / 100;
  
  const base = min + (max - min) * (isPremium ? 0.5 + ratio * 0.5 : ratio);
  
  if (currency === 'JPY') return Math.round(base * 140);
  if (currency === 'GBP') return Math.round(base * 0.78);
  if (currency === 'EUR') return Math.round(base * 0.92);
  
  return Math.round(base * 10) / 10;
}

/**
 * 프록시 서비스를 이용해 외부 URL의 Meta 데이터를 가져옵니다 (CORS 우회)
 */
async function fetchMetaData(url: string) {
  try {
    // 무료 메타데이터 프록시 서비스인 microlink API 사용
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}&palette=false&audio=false&video=false&iframe=false`);
    if (!res.ok) throw new Error('Network error');
    
    const data = await res.json();
    return {
      title: data.data?.title || '',
      image: data.data?.image?.url || '',
    };
  } catch (error) {
    console.error('Failed to fetch metadata:', error);
    return { title: '', image: '' };
  }
}

/**
 * URL 분석 메인 비동기 클래스/함수
 */
export async function analyzeUrl(url: string) {
  const shopInfo = detectShop(url);
  const productId = extractProductId(url);
  
  // 비동기로 실제 메타데이터 가져오기 시도
  const meta = await fetchMetaData(url);
  
  const keywords = extractKeywords(url, meta.title);
  const { category, customsRate } = inferCategory(keywords, shopInfo.domain);
  const name = buildProductName(keywords, shopInfo.name, meta.title);
  
  // 실제 프론트엔드 환경에선 가격 스크래핑이 불가능하므로, 제목에서 숫자를 찾거나 시뮬레이션
  let originalPrice = simulatePrice(keywords, category, shopInfo.currency);
  
  return {
    productId,
    name,
    category,
    shopInfo,
    originalPrice,
    originalCurrency: shopInfo.currency as any,
    customsRate,
    keywords,
    imageUrl: meta.image || '', // 추출된 이미지 링크
  };
}

export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1380,
  JPY: 9.2,
  GBP: 1750,
  EUR: 1500,
  CNY: 190,
};
