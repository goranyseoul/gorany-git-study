import { create } from 'zustand'
import { inventoryService, InventoryItem, CreateInventoryDto } from '../services/inventory'

interface InventoryFilter {
  category?: string
  storage?: 'refrigerator' | 'freezer' | 'room'
  expiringSoon?: boolean
  familyId?: string
}

interface InventorySummary {
  total: number
  expiringSoon: number
  expired: number
}

interface InventoryState {
  items: InventoryItem[]
  summary: InventorySummary
  filter: InventoryFilter
  isLoading: boolean
  error: string | null

  // Actions
  fetchItems: () => Promise<void>
  addItem: (data: CreateInventoryDto) => Promise<InventoryItem>
  addItemsFromReceipt: (imageUri: string) => Promise<InventoryItem[]>
  updateItem: (id: string, data: Partial<InventoryItem>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  consumeItem: (id: string, quantity: number) => Promise<void>
  setFilter: (filter: InventoryFilter) => void
  clearFilter: () => void
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  summary: { total: 0, expiringSoon: 0, expired: 0 },
  filter: {},
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null })
    try {
      const { filter } = get()
      const response = await inventoryService.getItems(filter)
      set({
        items: response.items,
        summary: response.summary,
        isLoading: false,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '재고 목록을 불러오지 못했습니다',
      })
    }
  },

  addItem: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const newItem = await inventoryService.addItem(data)
      set((state) => ({
        items: [newItem, ...state.items],
        summary: {
          ...state.summary,
          total: state.summary.total + 1,
        },
        isLoading: false,
      }))
      return newItem
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '재고 추가에 실패했습니다',
      })
      throw error
    }
  },

  addItemsFromReceipt: async (imageUri) => {
    set({ isLoading: true, error: null })
    try {
      const result = await inventoryService.scanReceipt(imageUri)
      // Add each scanned item
      const newItems: InventoryItem[] = []
      for (const item of result.items) {
        const newItem = await inventoryService.addItem({
          name: item.name,
          category: item.category || '기타',
          quantity: item.quantity,
          unit: item.unit || '개',
          price: item.price,
          purchaseDate: result.purchaseDate,
        })
        newItems.push(newItem)
      }
      set((state) => ({
        items: [...newItems, ...state.items],
        summary: {
          ...state.summary,
          total: state.summary.total + newItems.length,
        },
        isLoading: false,
      }))
      return newItems
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '영수증 스캔에 실패했습니다',
      })
      throw error
    }
  },

  updateItem: async (id, data) => {
    // BUG-003 수정: Optimistic update with rollback
    const previousItems = get().items

    // Optimistic update
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    }))

    try {
      const updatedItem = await inventoryService.updateItem(id, data)
      // 서버 응답으로 최종 상태 동기화
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        ),
      }))
    } catch (error) {
      // 롤백: 이전 상태로 복원
      set({ items: previousItems })
      throw error
    }
  },

  deleteItem: async (id) => {
    // BUG-003 수정: Optimistic update with rollback
    const previousItems = get().items
    const previousSummary = get().summary

    // Optimistic update
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      summary: {
        ...state.summary,
        total: state.summary.total - 1,
      },
    }))

    try {
      await inventoryService.deleteItem(id)
    } catch (error) {
      // 롤백: 이전 상태로 복원
      set({ items: previousItems, summary: previousSummary })
      throw error
    }
  },

  consumeItem: async (id, quantity) => {
    // BUG-003 수정: Optimistic update with rollback
    const previousItems = get().items
    const targetItem = previousItems.find((item) => item.id === id)

    if (!targetItem) {
      throw new Error('아이템을 찾을 수 없습니다')
    }

    // Optimistic update
    const optimisticQuantity = targetItem.quantity - quantity
    set((state) => ({
      items: optimisticQuantity <= 0
        ? state.items.filter((item) => item.id !== id)
        : state.items.map((item) =>
            item.id === id ? { ...item, quantity: optimisticQuantity } : item
          ),
    }))

    try {
      const updatedItem = await inventoryService.consumeItem(id, quantity)
      // 서버 응답으로 최종 상태 동기화
      set((state) => ({
        items: updatedItem.quantity <= 0
          ? state.items.filter((item) => item.id !== id)
          : state.items.map((item) =>
              item.id === id ? updatedItem : item
            ),
      }))
    } catch (error) {
      // 롤백: 이전 상태로 복원
      set({ items: previousItems })
      throw error
    }
  },

  setFilter: (filter) => {
    set({ filter })
    get().fetchItems()
  },

  clearFilter: () => {
    set({ filter: {} })
    get().fetchItems()
  },
}))

// Selectors
export const selectExpiringItems = (state: InventoryState) =>
  state.items.filter((item) => item.daysUntilExpiry !== undefined && item.daysUntilExpiry <= 7)

export const selectExpiredItems = (state: InventoryState) =>
  state.items.filter((item) => item.daysUntilExpiry !== undefined && item.daysUntilExpiry < 0)

export const selectItemsByCategory = (state: InventoryState, category: string) =>
  state.items.filter((item) => item.category === category)
