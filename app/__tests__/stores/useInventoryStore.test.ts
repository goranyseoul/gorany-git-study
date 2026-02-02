import { renderHook, act } from '@testing-library/react-hooks';
import { useInventoryStore } from '../../stores/useInventoryStore';
import * as inventoryService from '../../services/inventory';

jest.mock('../../services/inventory');
const mockedInventoryService = inventoryService as jest.Mocked<typeof inventoryService>;

describe('useInventoryStore', () => {
  beforeEach(() => {
    useInventoryStore.setState({
      items: [],
      isLoading: false,
      filter: {},
    });
    jest.clearAllMocks();
  });

  describe('fetchItems', () => {
    it('should fetch and store inventory items', async () => {
      const mockItems = [
        { id: 'item-1', name: '우유', quantity: 2, unit: '개' },
        { id: 'item-2', name: '계란', quantity: 10, unit: '개' },
      ];
      mockedInventoryService.getInventory.mockResolvedValue(mockItems);

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.fetchItems();
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0].name).toBe('우유');
    });
  });

  describe('addItem', () => {
    // TC-INV-001: 재고 수동 추가
    it('should add new item to inventory', async () => {
      const newItem = {
        name: '우유',
        quantity: 2,
        unit: '개',
        category: '유제품',
        storageLocation: 'refrigerator' as const,
      };

      mockedInventoryService.addInventory.mockResolvedValue({
        id: 'item-1',
        ...newItem,
      });

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.addItem(newItem);
      });

      expect(result.current.items).toContainEqual(
        expect.objectContaining({ name: '우유' }),
      );
    });
  });

  describe('consumeItem', () => {
    // TC-INV-004: 재고 수량 감소
    it('should decrease item quantity', async () => {
      useInventoryStore.setState({
        items: [{ id: 'item-1', name: '우유', quantity: 5, unit: '개' }],
      });

      mockedInventoryService.consumeInventory.mockResolvedValue({
        id: 'item-1',
        name: '우유',
        quantity: 3,
        unit: '개',
      });

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.consumeItem('item-1', 2);
      });

      expect(result.current.items[0].quantity).toBe(3);
    });

    it('should remove item when quantity becomes zero', async () => {
      useInventoryStore.setState({
        items: [{ id: 'item-1', name: '우유', quantity: 2, unit: '개' }],
      });

      mockedInventoryService.consumeInventory.mockResolvedValue({
        id: 'item-1',
        deleted: true,
      });

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.consumeItem('item-1', 2);
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('deleteItem', () => {
    // TC-INV-005: 재고 삭제
    it('should remove item from inventory', async () => {
      useInventoryStore.setState({
        items: [
          { id: 'item-1', name: '우유', quantity: 2 },
          { id: 'item-2', name: '계란', quantity: 10 },
        ],
      });

      mockedInventoryService.deleteInventory.mockResolvedValue({});

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.deleteItem('item-1');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].name).toBe('계란');
    });
  });

  describe('filter', () => {
    // TC-INV-007: 카테고리 필터링
    it('should filter items by category', () => {
      useInventoryStore.setState({
        items: [
          { id: 'item-1', name: '우유', category: '유제품' },
          { id: 'item-2', name: '당근', category: '채소' },
        ],
      });

      const { result } = renderHook(() => useInventoryStore());

      act(() => {
        result.current.setFilter({ category: '채소' });
      });

      expect(result.current.filter.category).toBe('채소');
      expect(result.current.filteredItems).toHaveLength(1);
      expect(result.current.filteredItems[0].name).toBe('당근');
    });

    // TC-INV-008: 보관위치 필터링
    it('should filter items by storage location', () => {
      useInventoryStore.setState({
        items: [
          { id: 'item-1', name: '우유', storageLocation: 'refrigerator' },
          { id: 'item-2', name: '아이스크림', storageLocation: 'freezer' },
        ],
      });

      const { result } = renderHook(() => useInventoryStore());

      act(() => {
        result.current.setFilter({ storageLocation: 'freezer' });
      });

      expect(result.current.filteredItems).toHaveLength(1);
      expect(result.current.filteredItems[0].name).toBe('아이스크림');
    });
  });

  describe('getExpiringItems', () => {
    // TC-INV-006: 유통기한 임박 표시
    it('should return items expiring soon', () => {
      const today = new Date();
      const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      const tenDaysLater = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);

      useInventoryStore.setState({
        items: [
          { id: 'item-1', name: '우유', expiryDate: twoDaysLater.toISOString() },
          { id: 'item-2', name: '계란', expiryDate: tenDaysLater.toISOString() },
        ],
      });

      const { result } = renderHook(() => useInventoryStore());

      // Get items expiring within 3 days
      const expiringItems = result.current.getExpiringItems(3);

      expect(expiringItems).toHaveLength(1);
      expect(expiringItems[0].name).toBe('우유');
    });
  });
});
