import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface OCRItem {
  name: string;
  quantity: number;
  unit?: string;
  price?: number;
  category?: string;
}

interface OCRResult {
  items: OCRItem[];
  store?: string;
  purchaseDate?: string;
  totalAmount?: number;
}

@Injectable()
export class OcrService {
  constructor(private configService: ConfigService) {}

  async scanReceipt(imageUrl: string): Promise<OCRResult> {
    // In real implementation, call Naver Clova OCR or Google Vision API
    // For now, return mock data

    // Example of how to call Naver Clova OCR:
    // const apiUrl = this.configService.get('CLOVA_OCR_API_URL');
    // const secretKey = this.configService.get('CLOVA_OCR_SECRET_KEY');
    // const response = await axios.post(apiUrl, { images: [{ url: imageUrl }] }, {
    //   headers: { 'X-OCR-SECRET': secretKey }
    // });
    // return this.parseOCRResponse(response.data);

    // Mock response for development
    console.log('OCR scan requested for:', imageUrl);

    return {
      items: [
        { name: '서울우유 1L', quantity: 2, price: 5800, category: '유제품' },
        { name: '계란 30구', quantity: 1, price: 8900, category: '난류' },
        { name: '삼겹살 600g', quantity: 1, price: 15900, category: '육류' },
        { name: '양파 3개입', quantity: 1, price: 2500, category: '채소' },
        { name: '대파', quantity: 1, price: 1500, category: '채소' },
      ],
      store: '이마트',
      purchaseDate: new Date().toISOString().split('T')[0],
      totalAmount: 34600,
    };
  }

  // Parse OCR response from API (to be implemented)
  private parseOCRResponse(response: any): OCRResult {
    // Parse the OCR text and extract items
    // This would involve text pattern matching for:
    // - Item names
    // - Quantities
    // - Prices
    // - Store name
    // - Date

    return {
      items: [],
      store: undefined,
      purchaseDate: undefined,
      totalAmount: undefined,
    };
  }

  // Categorize item based on name
  private categorizeItem(name: string): string {
    const categories: Record<string, string[]> = {
      '유제품': ['우유', '치즈', '요거트', '버터', '크림'],
      '육류': ['삼겹살', '소고기', '닭고기', '돼지고기', '햄'],
      '채소': ['양파', '대파', '마늘', '당근', '감자', '배추', '시금치'],
      '과일': ['사과', '배', '오렌지', '바나나', '포도'],
      '난류': ['계란', '메추리알'],
      '수산물': ['생선', '고등어', '새우', '조개', '오징어'],
      '음료': ['물', '주스', '커피', '차'],
      '조미료': ['소금', '설탕', '간장', '된장', '고추장'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => name.includes(keyword))) {
        return category;
      }
    }

    return '기타';
  }
}
