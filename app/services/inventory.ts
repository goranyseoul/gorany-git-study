import { api, ApiResponse } from './api'

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  purchaseDate?: string
  expiryDate?: string
  daysUntilExpiry?: number
  price?: number
  storageLocation?: 'refrigerator' | 'freezer' | 'room'
  imageUrl?: string
  familyId?: string
}

export interface CreateInventoryDto {
  name: string
  category: string
  quantity: number
  unit: string
  purchaseDate?: string
  expiryDate?: string
  price?: number
  storageLocation?: 'refrigerator' | 'freezer' | 'room'
  familyId?: string
}

interface InventoryFilter {
  category?: string
  storage?: string
  expiringSoon?: boolean
  familyId?: string
}

interface InventoryListResponse {
  items: InventoryItem[]
  summary: {
    total: number
    expiringSoon: number
    expired: number
  }
}

interface OCRResult {
  items: Array<{
    name: string
    quantity: number
    unit?: string
    price?: number
    category?: string
  }>
  store?: string
  purchaseDate?: string
  totalAmount?: number
}

export const inventoryService = {
  async getItems(filter?: InventoryFilter): Promise<InventoryListResponse> {
    const params = new URLSearchParams()
    if (filter?.category) params.append('category', filter.category)
    if (filter?.storage) params.append('storage', filter.storage)
    if (filter?.expiringSoon) params.append('expiringSoon', 'true')
    if (filter?.familyId) params.append('familyId', filter.familyId)

    const response = await api.get<ApiResponse<InventoryListResponse>>(
      `/inventory?${params.toString()}`
    )
    return response.data.data
  },

  async getItem(id: string): Promise<InventoryItem> {
    const response = await api.get<ApiResponse<InventoryItem>>(`/inventory/${id}`)
    return response.data.data
  },

  async addItem(data: CreateInventoryDto): Promise<InventoryItem> {
    const response = await api.post<ApiResponse<InventoryItem>>('/inventory', data)
    return response.data.data
  },

  async updateItem(id: string, data: Partial<CreateInventoryDto>): Promise<InventoryItem> {
    const response = await api.patch<ApiResponse<InventoryItem>>(`/inventory/${id}`, data)
    return response.data.data
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/inventory/${id}`)
  },

  async consumeItem(id: string, quantity: number): Promise<InventoryItem> {
    const response = await api.post<ApiResponse<InventoryItem>>(`/inventory/${id}/consume`, {
      quantity,
    })
    return response.data.data
  },

  async scanReceipt(imageUrl: string): Promise<OCRResult> {
    const response = await api.post<ApiResponse<OCRResult>>('/inventory/scan', {
      imageUrl,
    })
    return response.data.data
  },
}
