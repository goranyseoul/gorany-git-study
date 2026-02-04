import { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme/colors'
import { mockRecipeService } from '../../mocks/services'

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecipes()
  }, [])

  const loadRecipes = async () => {
    setIsLoading(true)
    try {
      const data = await mockRecipeService.getRecommended()
      setRecipes(data)
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '쉬움'
      case 'medium':
        return '보통'
      case 'hard':
        return '어려움'
      default:
        return difficulty
    }
  }

  const renderRecipe = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.recipeCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      <View style={styles.recipeContent}>
        <View style={styles.badgeContainer}>
          {item.dietBadges?.map((badge: string, index: number) => (
            <View key={index} style={styles.dietBadge}>
              <Text style={styles.dietBadgeText}>{badge}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <View style={styles.recipeInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={14} color={colors.text.secondary} />
            <Text style={styles.infoText}>{item.cookingTime}분</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="speedometer-outline" size={14} color={colors.text.secondary} />
            <Text style={styles.infoText}>{getDifficultyLabel(item.difficulty)}</Text>
          </View>
        </View>
        <View style={styles.matchContainer}>
          <View style={styles.matchBar}>
            <View
              style={[styles.matchFill, { width: `${item.matchRate}%` }]}
            />
          </View>
          <Text style={styles.matchText}>재료 {item.matchRate}% 보유</Text>
        </View>
        {item.missingIngredients?.length > 0 && (
          <Text style={styles.missingText}>
            부족: {item.missingIngredients.join(', ')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>추천 레시피</Text>
        <Text style={styles.headerSubtitle}>
          내 냉장고 재료로 만들 수 있어요
        </Text>
      </View>

      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  recipeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  recipeImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.border,
  },
  recipeContent: {
    padding: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  dietBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dietBadgeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  recipeInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  matchFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  matchText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  missingText: {
    fontSize: 12,
    color: colors.warning,
    marginTop: 8,
  },
})
