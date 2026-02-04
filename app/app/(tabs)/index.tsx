import { useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useInventoryStore, selectExpiringItems } from '../../stores/useInventoryStore'
import { colors } from '../../theme/colors'

export default function HomeScreen() {
  const router = useRouter()
  const { items, summary, isLoading, fetchItems } = useInventoryStore()
  const expiringItems = useInventoryStore(selectExpiringItems)

  useEffect(() => {
    fetchItems()
  }, [])

  const getExpiryColor = (days: number | undefined) => {
    if (days === undefined) return colors.text.secondary
    if (days < 0) return colors.error
    if (days <= 3) return colors.warning
    if (days <= 7) return '#FFA500'
    return colors.success
  }

  const getStorageIcon = (location: string) => {
    switch (location) {
      case 'refrigerator':
        return 'snow'
      case 'freezer':
        return 'snow-outline'
      case 'room':
        return 'home'
      default:
        return 'cube'
    }
  }

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Ionicons
          name={getStorageIcon(item.storageLocation)}
          size={20}
          color={colors.text.secondary}
        />
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.itemFooter}>
        <Text style={styles.itemQuantity}>
          {item.quantity} {item.unit}
        </Text>
        {item.daysUntilExpiry !== undefined && (
          <View
            style={[
              styles.expiryBadge,
              { backgroundColor: getExpiryColor(item.daysUntilExpiry) + '20' },
            ]}
          >
            <Text
              style={[
                styles.expiryText,
                { color: getExpiryColor(item.daysUntilExpiry) },
              ]}
            >
              {item.daysUntilExpiry < 0
                ? '만료됨'
                : `D-${item.daysUntilExpiry}`}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* 요약 카드 */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{summary.total}</Text>
          <Text style={styles.summaryLabel}>전체 재고</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.warning + '20' }]}>
          <Text style={[styles.summaryNumber, { color: colors.warning }]}>
            {summary.expiringSoon}
          </Text>
          <Text style={styles.summaryLabel}>곧 만료</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles.summaryNumber, { color: colors.error }]}>
            {summary.expired}
          </Text>
          <Text style={styles.summaryLabel}>만료됨</Text>
        </View>
      </View>

      {/* 만료 임박 알림 */}
      {expiringItems.length > 0 && (
        <View style={styles.alertCard}>
          <Ionicons name="warning" size={20} color={colors.warning} />
          <Text style={styles.alertText}>
            {expiringItems.length}개 품목이 7일 이내 만료됩니다
          </Text>
        </View>
      )}

      {/* 재고 목록 */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>내 냉장고</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchItems} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="basket-outline" size={64} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>재고가 없습니다</Text>
            <Text style={styles.emptySubtext}>
              영수증을 스캔하거나 직접 추가해보세요
            </Text>
          </View>
        }
      />

      {/* 플로팅 스캔 버튼 */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="scan" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '15',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  alertText: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: '500',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  addButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  itemCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    margin: 4,
    maxWidth: '48%',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  itemCategory: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  expiryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  expiryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
})
