import { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme/colors'
import { mockShorts } from '../../mocks/data'

const { width, height } = Dimensions.get('window')

export default function ShortsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const renderShorts = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.shortsContainer}>
      {/* 썸네일 (실제 앱에서는 비디오) */}
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={styles.videoPlaceholder}
      />

      {/* 오버레이 */}
      <View style={styles.overlay}>
        {/* 우측 액션 버튼들 */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name={item.isLiked ? 'heart' : 'heart-outline'}
              size={32}
              color={item.isLiked ? colors.error : '#FFF'}
            />
            <Text style={styles.actionText}>{item.likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={28} color="#FFF" />
            <Text style={styles.actionText}>{item.commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={28} color="#FFF" />
            <Text style={styles.actionText}>공유</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={28} color="#FFF" />
            <Text style={styles.actionText}>저장</Text>
          </TouchableOpacity>
        </View>

        {/* 하단 정보 */}
        <View style={styles.info}>
          <View style={styles.authorRow}>
            <Image
              source={{ uri: item.author.profileImage }}
              style={styles.authorImage}
            />
            <Text style={styles.authorName}>{item.author.name}</Text>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>팔로우</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </View>

      {/* 재생 버튼 (썸네일용) */}
      <View style={styles.playButton}>
        <Ionicons name="play" size={48} color="#FFF" />
      </View>
    </View>
  )

  return (
    <FlatList
      data={mockShorts}
      renderItem={renderShorts}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={height - 80}
      decelerationRate="fast"
      onMomentumScrollEnd={(event) => {
        const index = Math.round(
          event.nativeEvent.contentOffset.y / (height - 80)
        )
        setCurrentIndex(index)
      }}
    />
  )
}

const styles = StyleSheet.create({
  shortsContainer: {
    width,
    height: height - 80,
    backgroundColor: '#000',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  actions: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
  },
  info: {
    padding: 16,
    paddingBottom: 24,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  followText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#FFF',
    fontSize: 14,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    opacity: 0.8,
  },
})
