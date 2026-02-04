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
import { mockPosts } from '../../mocks/data'

export default function LoungeScreen() {
  const [posts, setPosts] = useState(mockPosts)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) return '방금 전'
    if (hours < 24) return `${hours}시간 전`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR')
  }

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post
      )
    )
  }

  const renderPost = ({ item }: { item: any }) => (
    <View style={styles.postCard}>
      {/* 작성자 정보 */}
      <View style={styles.authorRow}>
        <Image
          source={{ uri: item.author.profileImage }}
          style={styles.authorImage}
        />
        <View style={styles.authorInfo}>
          <View style={styles.authorNameRow}>
            <Text style={styles.authorName}>{item.author.name}</Text>
            {item.author.isSupporter && (
              <View style={styles.supporterBadge}>
                <Ionicons name="star" size={12} color={colors.primary} />
              </View>
            )}
          </View>
          <Text style={styles.postDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* 본문 */}
      <Text style={styles.content}>{item.content}</Text>

      {/* 이미지 */}
      {item.imageUrls?.length > 0 && (
        <Image source={{ uri: item.imageUrls[0] }} style={styles.postImage} />
      )}

      {/* 연결된 레시피 */}
      {item.recipe && (
        <TouchableOpacity style={styles.recipeLink}>
          <Ionicons name="restaurant" size={16} color={colors.primary} />
          <Text style={styles.recipeLinkText}>{item.recipe.title}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      )}

      {/* 액션 버튼들 */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Ionicons
            name={item.isLiked ? 'heart' : 'heart-outline'}
            size={22}
            color={item.isLiked ? colors.error : colors.text.secondary}
          />
          <Text
            style={[
              styles.actionText,
              item.isLiked && { color: colors.error },
            ]}
          >
            {item.likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={colors.text.secondary}
          />
          <Text style={styles.actionText}>{item.commentCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="share-outline"
            size={20}
            color={colors.text.secondary}
          />
          <Text style={styles.actionText}>공유</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>라운지</Text>
            <Text style={styles.headerSubtitle}>
              요리 사진과 팁을 공유해보세요
            </Text>
          </View>
        }
      />

      {/* 글쓰기 FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="create" size={24} color="#FFF" />
      </TouchableOpacity>
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
    paddingBottom: 80,
  },
  postCard: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  supporterBadge: {
    backgroundColor: colors.primary + '20',
    padding: 2,
    borderRadius: 4,
  },
  postDate: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  content: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  recipeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  recipeLinkText: {
    flex: 1,
    color: colors.primary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
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
