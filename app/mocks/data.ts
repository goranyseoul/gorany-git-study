/**
 * Mock 데이터 - 서버 없이 앱 테스트용
 */

// 재고 아이템
export const mockInventoryItems = [
  {
    id: '1',
    name: '우유',
    category: '유제품',
    quantity: 2,
    unit: '팩',
    storageLocation: 'refrigerator' as const,
    purchaseDate: '2026-01-28',
    expiryDate: '2026-02-10',
    daysUntilExpiry: 6,
    price: 3500,
  },
  {
    id: '2',
    name: '계란',
    category: '유제품',
    quantity: 15,
    unit: '개',
    storageLocation: 'refrigerator' as const,
    purchaseDate: '2026-01-30',
    expiryDate: '2026-02-15',
    daysUntilExpiry: 11,
    price: 6500,
  },
  {
    id: '3',
    name: '양파',
    category: '채소',
    quantity: 5,
    unit: '개',
    storageLocation: 'room' as const,
    purchaseDate: '2026-01-25',
    expiryDate: '2026-02-05',
    daysUntilExpiry: 1,
    price: 3000,
  },
  {
    id: '4',
    name: '삼겹살',
    category: '육류',
    quantity: 500,
    unit: 'g',
    storageLocation: 'freezer' as const,
    purchaseDate: '2026-01-20',
    expiryDate: '2026-03-20',
    daysUntilExpiry: 44,
    price: 15000,
  },
  {
    id: '5',
    name: '두부',
    category: '기타',
    quantity: 1,
    unit: '모',
    storageLocation: 'refrigerator' as const,
    purchaseDate: '2026-02-01',
    expiryDate: '2026-02-03',
    daysUntilExpiry: -1, // 만료됨
    price: 2000,
  },
  {
    id: '6',
    name: '김치',
    category: '반찬',
    quantity: 1,
    unit: '통',
    storageLocation: 'refrigerator' as const,
    purchaseDate: '2026-01-15',
    expiryDate: '2026-02-28',
    daysUntilExpiry: 24,
    price: 12000,
  },
  {
    id: '7',
    name: '대파',
    category: '채소',
    quantity: 3,
    unit: '단',
    storageLocation: 'refrigerator' as const,
    purchaseDate: '2026-02-01',
    expiryDate: '2026-02-08',
    daysUntilExpiry: 4,
    price: 2500,
  },
  {
    id: '8',
    name: '고추장',
    category: '양념',
    quantity: 1,
    unit: '통',
    storageLocation: 'refrigerator' as const,
    purchaseDate: '2026-01-01',
    expiryDate: '2026-07-01',
    daysUntilExpiry: 147,
    price: 8000,
  },
]

// 레시피 목록
export const mockRecipes = [
  {
    id: '1',
    title: '김치찌개',
    imageUrl: 'https://picsum.photos/seed/kimchi/300/200',
    cookingTime: 30,
    difficulty: 'easy' as const,
    matchRate: 95,
    dietBadges: ['저탄고지'],
    missingIngredients: [],
    ingredients: [
      { name: '김치', amount: 200, unit: 'g', inInventory: true },
      { name: '두부', amount: 1, unit: '모', inInventory: true },
      { name: '대파', amount: 1, unit: '단', inInventory: true },
      { name: '돼지고기', amount: 150, unit: 'g', inInventory: false },
    ],
    steps: [
      '김치를 먹기 좋은 크기로 썬다',
      '냄비에 참기름을 두르고 김치를 볶는다',
      '물을 붓고 끓인다',
      '두부와 대파를 넣고 한소끔 더 끓인다',
    ],
    nutrition: {
      calories: 350,
      protein: 18,
      carbs: 25,
      fat: 20,
    },
  },
  {
    id: '2',
    title: '계란말이',
    imageUrl: 'https://picsum.photos/seed/egg/300/200',
    cookingTime: 15,
    difficulty: 'easy' as const,
    matchRate: 100,
    dietBadges: ['고단백', '저탄수화물'],
    missingIngredients: [],
    ingredients: [
      { name: '계란', amount: 3, unit: '개', inInventory: true },
      { name: '대파', amount: 0.5, unit: '단', inInventory: true },
      { name: '소금', amount: 1, unit: '작은술', inInventory: true },
    ],
    steps: [
      '계란을 풀고 대파를 송송 썬다',
      '소금으로 간을 한다',
      '팬에 기름을 두르고 계란물을 부어 말아준다',
    ],
    nutrition: {
      calories: 220,
      protein: 15,
      carbs: 2,
      fat: 16,
    },
  },
  {
    id: '3',
    title: '삼겹살 구이',
    imageUrl: 'https://picsum.photos/seed/pork/300/200',
    cookingTime: 20,
    difficulty: 'easy' as const,
    matchRate: 85,
    dietBadges: ['고단백'],
    missingIngredients: ['상추'],
    ingredients: [
      { name: '삼겹살', amount: 300, unit: 'g', inInventory: true },
      { name: '양파', amount: 1, unit: '개', inInventory: true },
      { name: '상추', amount: 10, unit: '장', inInventory: false },
    ],
    steps: [
      '삼겹살을 먹기 좋은 크기로 자른다',
      '팬을 달구고 삼겹살을 굽는다',
      '양파도 함께 구워낸다',
    ],
    nutrition: {
      calories: 550,
      protein: 25,
      carbs: 5,
      fat: 48,
    },
  },
  {
    id: '4',
    title: '된장찌개',
    imageUrl: 'https://picsum.photos/seed/doenjang/300/200',
    cookingTime: 25,
    difficulty: 'medium' as const,
    matchRate: 70,
    dietBadges: ['저칼로리'],
    missingIngredients: ['된장', '애호박'],
    ingredients: [
      { name: '두부', amount: 1, unit: '모', inInventory: true },
      { name: '양파', amount: 1, unit: '개', inInventory: true },
      { name: '대파', amount: 1, unit: '단', inInventory: true },
      { name: '된장', amount: 2, unit: '큰술', inInventory: false },
      { name: '애호박', amount: 0.5, unit: '개', inInventory: false },
    ],
    steps: [
      '냄비에 물을 붓고 끓인다',
      '된장을 풀어준다',
      '두부, 양파, 애호박을 넣는다',
      '대파를 넣고 마무리한다',
    ],
    nutrition: {
      calories: 180,
      protein: 12,
      carbs: 15,
      fat: 8,
    },
  },
]

// 사용자 정보
export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: '테스트 사용자',
  profileImage: 'https://picsum.photos/seed/user/100/100',
  preference: {
    dietTypes: ['저탄고지'],
    allergies: [],
    bodyInfo: {
      height: 170,
      weight: 65,
      age: 30,
      gender: 'male' as const,
      activityLevel: 'medium' as const,
    },
    favoriteFoods: ['김치찌개', '삼겹살', '된장찌개'],
  },
}

// 가족 정보
export const mockFamily = {
  id: 'family-1',
  name: '우리 가족',
  inviteCode: 'ABC123',
  members: [
    {
      userId: 'user-1',
      name: '테스트 사용자',
      role: 'owner' as const,
      profileImage: 'https://picsum.photos/seed/user1/100/100',
    },
    {
      userId: 'user-2',
      name: '가족 구성원',
      role: 'member' as const,
      profileImage: 'https://picsum.photos/seed/user2/100/100',
    },
  ],
}

// 커뮤니티 게시글
export const mockPosts = [
  {
    id: 'post-1',
    author: {
      id: 'user-3',
      name: '요리왕',
      profileImage: 'https://picsum.photos/seed/chef/100/100',
      isSupporter: true,
    },
    content: '오늘 만든 김치찌개! 묵은지로 만들었더니 정말 맛있어요 😋',
    imageUrls: ['https://picsum.photos/seed/food1/400/300'],
    likeCount: 42,
    commentCount: 8,
    isLiked: false,
    createdAt: '2026-02-02T10:30:00Z',
    recipe: { id: '1', title: '김치찌개' },
  },
  {
    id: 'post-2',
    author: {
      id: 'user-4',
      name: '집밥요리사',
      profileImage: 'https://picsum.photos/seed/cook/100/100',
      isSupporter: false,
    },
    content: '냉장고 털이 요리 성공! 남은 재료로 볶음밥 만들었어요',
    imageUrls: ['https://picsum.photos/seed/food2/400/300'],
    likeCount: 28,
    commentCount: 5,
    isLiked: true,
    createdAt: '2026-02-01T18:20:00Z',
  },
]

// 쇼츠 영상
export const mockShorts = [
  {
    id: 'shorts-1',
    author: { name: '1분요리', profileImage: 'https://picsum.photos/seed/s1/100/100' },
    title: '3분 계란말이 꿀팁!',
    videoUrl: 'https://example.com/video1.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/shorts1/300/500',
    likeCount: 1234,
    commentCount: 89,
    isLiked: false,
  },
  {
    id: 'shorts-2',
    author: { name: '간편요리', profileImage: 'https://picsum.photos/seed/s2/100/100' },
    title: '냉동삼겹살 해동 없이 굽기',
    videoUrl: 'https://example.com/video2.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/shorts2/300/500',
    likeCount: 856,
    commentCount: 45,
    isLiked: true,
  },
]

// 식사 기록
export const mockMealRecords = [
  {
    id: 'meal-1',
    type: 'recipe' as const,
    recipeId: '1',
    recipeName: '김치찌개',
    imageUrl: 'https://picsum.photos/seed/meal1/200/200',
    consumedAt: '2026-02-02T12:30:00Z',
    calories: 350,
    feedback: {
      tasteRating: 5,
      portionFeedback: 'just_right' as const,
    },
  },
  {
    id: 'meal-2',
    type: 'photo' as const,
    imageUrl: 'https://picsum.photos/seed/meal2/200/200',
    consumedAt: '2026-02-02T08:00:00Z',
    calories: 450,
    detectedFoods: ['토스트', '계란후라이', '우유'],
  },
]
