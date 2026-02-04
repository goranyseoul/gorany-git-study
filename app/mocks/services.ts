/**
 * Mock 서비스 - 서버 API를 시뮬레이션
 */

import {
  mockInventoryItems,
  mockRecipes,
  mockUser,
  mockFamily,
  mockPosts,
  mockShorts,
  mockMealRecords,
} from './data'

// 딜레이를 주어 실제 API 호출처럼 보이게
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 로컬 상태 (메모리에 저장)
let inventoryItems = [...mockInventoryItems]
let currentUser = { ...mockUser }
let isLoggedIn = false

/**
 * 인증 Mock 서비스
 */
export const mockAuthService = {
  async login(email: string, password: string) {
    await delay(500)

    // 아무 이메일/비밀번호나 성공
    isLoggedIn = true
    return {
      accessToken: 'mock-token-12345',
      user: currentUser,
    }
  },

  async loginWithOAuth(provider: string, token: string) {
    await delay(500)

    isLoggedIn = true
    return {
      accessToken: 'mock-oauth-token-12345',
      user: {
        ...currentUser,
        name: `${provider} 사용자`,
      },
    }
  },

  async signup(email: string, password: string, name: string) {
    await delay(500)

    currentUser = {
      ...currentUser,
      email,
      name,
    }
    isLoggedIn = true

    return {
      accessToken: 'mock-token-new-user',
      user: currentUser,
    }
  },

  async logout() {
    await delay(200)
    isLoggedIn = false
  },

  async getMe() {
    await delay(300)
    if (!isLoggedIn) {
      throw new Error('로그인이 필요합니다')
    }
    return currentUser
  },
}

/**
 * 재고 Mock 서비스
 */
export const mockInventoryService = {
  async getItems(filter?: any) {
    await delay(400)

    let items = [...inventoryItems]

    // 필터 적용
    if (filter?.category) {
      items = items.filter((item) => item.category === filter.category)
    }
    if (filter?.storage) {
      items = items.filter((item) => item.storageLocation === filter.storage)
    }
    if (filter?.expiringSoon) {
      items = items.filter(
        (item) => item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 7 && item.daysUntilExpiry >= 0
      )
    }

    const summary = {
      total: inventoryItems.length,
      expiringSoon: inventoryItems.filter((i) => i.daysUntilExpiry !== undefined && i.daysUntilExpiry <= 7 && i.daysUntilExpiry >= 0).length,
      expired: inventoryItems.filter((i) => i.daysUntilExpiry !== undefined && i.daysUntilExpiry < 0).length,
    }

    return { items, summary }
  },

  async addItem(data: any) {
    await delay(300)

    const newItem = {
      id: `item-${Date.now()}`,
      ...data,
      daysUntilExpiry: data.expiryDate
        ? Math.ceil((new Date(data.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
    }

    inventoryItems = [newItem, ...inventoryItems]
    return newItem
  },

  async updateItem(id: string, data: any) {
    await delay(300)

    const index = inventoryItems.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('아이템을 찾을 수 없습니다')
    }

    inventoryItems[index] = { ...inventoryItems[index], ...data }
    return inventoryItems[index]
  },

  async deleteItem(id: string) {
    await delay(300)
    inventoryItems = inventoryItems.filter((item) => item.id !== id)
  },

  async consumeItem(id: string, quantity: number) {
    await delay(300)

    const index = inventoryItems.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('아이템을 찾을 수 없습니다')
    }

    const newQuantity = inventoryItems[index].quantity - quantity

    if (newQuantity <= 0) {
      const item = inventoryItems[index]
      inventoryItems = inventoryItems.filter((i) => i.id !== id)
      return { ...item, quantity: 0 }
    }

    inventoryItems[index].quantity = newQuantity
    return inventoryItems[index]
  },

  async scanReceipt(imageUri: string) {
    await delay(1500) // OCR 시뮬레이션

    // 가짜 OCR 결과
    return {
      purchaseDate: new Date().toISOString().split('T')[0],
      storeName: '이마트',
      items: [
        { name: '바나나', quantity: 1, unit: '송이', price: 3500, category: '과일' },
        { name: '사과', quantity: 5, unit: '개', price: 8000, category: '과일' },
        { name: '식빵', quantity: 1, unit: '봉', price: 2500, category: '빵' },
      ],
    }
  },
}

/**
 * 레시피 Mock 서비스
 */
export const mockRecipeService = {
  async getRecommended() {
    await delay(500)
    return mockRecipes.sort((a, b) => b.matchRate - a.matchRate)
  },

  async getById(id: string) {
    await delay(300)
    const recipe = mockRecipes.find((r) => r.id === id)
    if (!recipe) {
      throw new Error('레시피를 찾을 수 없습니다')
    }
    return recipe
  },

  async search(query: string) {
    await delay(400)
    return mockRecipes.filter(
      (r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(query.toLowerCase()))
    )
  },

  async completeCooking(recipeId: string, servings: number = 1) {
    await delay(500)

    const recipe = mockRecipes.find((r) => r.id === recipeId)
    if (!recipe) {
      throw new Error('레시피를 찾을 수 없습니다')
    }

    // 재고 차감 시뮬레이션
    for (const ingredient of recipe.ingredients) {
      if (ingredient.inInventory) {
        const item = inventoryItems.find(
          (i) => i.name.toLowerCase().includes(ingredient.name.toLowerCase())
        )
        if (item) {
          item.quantity = Math.max(0, item.quantity - ingredient.amount * servings)
        }
      }
    }

    return {
      success: true,
      mealRecordId: `meal-${Date.now()}`,
    }
  },
}

/**
 * 가족 Mock 서비스
 */
export const mockFamilyService = {
  async getFamily() {
    await delay(300)
    return mockFamily
  },

  async createFamily(name: string) {
    await delay(400)
    return {
      ...mockFamily,
      name,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    }
  },

  async joinFamily(inviteCode: string) {
    await delay(400)
    if (inviteCode.length !== 6) {
      throw new Error('잘못된 초대 코드입니다')
    }
    return mockFamily
  },
}

/**
 * 커뮤니티 Mock 서비스
 */
export const mockCommunityService = {
  async getPosts() {
    await delay(400)
    return mockPosts
  },

  async getShorts() {
    await delay(400)
    return mockShorts
  },

  async likePost(postId: string) {
    await delay(200)
    const post = mockPosts.find((p) => p.id === postId)
    if (post) {
      post.isLiked = !post.isLiked
      post.likeCount += post.isLiked ? 1 : -1
    }
    return post
  },
}

/**
 * 식사 기록 Mock 서비스
 */
export const mockMealService = {
  async getRecords(date?: string) {
    await delay(400)
    return mockMealRecords
  },

  async addFeedback(mealId: string, feedback: any) {
    await delay(300)
    const meal = mockMealRecords.find((m) => m.id === mealId)
    if (meal && 'feedback' in meal) {
      meal.feedback = feedback
    }
    return meal
  },

  async analyzePhoto(imageUri: string) {
    await delay(2000) // AI 분석 시뮬레이션

    return {
      detectedFoods: ['비빔밥', '계란후라이'],
      estimatedCalories: 520,
      nutrition: {
        protein: 18,
        carbs: 65,
        fat: 15,
      },
    }
  },
}
