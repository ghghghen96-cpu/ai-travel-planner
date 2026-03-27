export type Currency = 'USD' | 'EUR' | 'KRW' | 'JPY' | 'GBP' | 'CNY';

export interface ParsedItem {
  id: string;
  url: string;
  name: string;
  category: string;
  imageUrl: string;
  originalCurrency: Currency;
  originalPrice: number;
  date: string;
  // 쇼핑몰 정보 (URL 파싱 결과)
  shopName?: string;
  shopFlag?: string;
  country?: string;
  customsRate?: number;
}

export interface CalculatedCost {
  itemPriceKrw: number;
  shippingKrw: number;
  customsKrw: number;
  vatKrw: number;
  totalKrw: number;
  isDeMinimisApplicable: boolean; // US $200 이하 면세 여부
}

export interface HistoryItem {
  item: ParsedItem;
  cost: CalculatedCost;
}
