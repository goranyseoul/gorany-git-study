import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme/colors'
import { mockUser, mockFamily } from '../../mocks/data'

export default function ProfileScreen() {
  const menuItems = [
    { icon: 'person-outline', label: '프로필 수정', screen: 'editProfile' },
    { icon: 'fitness-outline', label: '식단 설정', screen: 'dietSettings' },
    { icon: 'people-outline', label: '가족 관리', screen: 'family', badge: mockFamily.members.length },
    { icon: 'notifications-outline', label: '알림 설정', screen: 'notifications' },
    { icon: 'bookmark-outline', label: '저장한 레시피', screen: 'savedRecipes' },
    { icon: 'time-outline', label: '요리 기록', screen: 'cookingHistory' },
    { icon: 'help-circle-outline', label: '도움말', screen: 'help' },
    { icon: 'settings-outline', label: '설정', screen: 'settings' },
  ]

  return (
    <ScrollView style={styles.container}>
      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: mockUser.profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{mockUser.name}</Text>
        <Text style={styles.userEmail}>{mockUser.email}</Text>

        {/* 식단 태그 */}
        <View style={styles.dietTags}>
          {mockUser.preference.dietTypes.map((diet, index) => (
            <View key={index} style={styles.dietTag}>
              <Text style={styles.dietTagText}>{diet}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 가족 카드 */}
      <TouchableOpacity style={styles.familyCard}>
        <View style={styles.familyHeader}>
          <Ionicons name="home" size={20} color={colors.primary} />
          <Text style={styles.familyTitle}>{mockFamily.name}</Text>
        </View>
        <View style={styles.familyMembers}>
          {mockFamily.members.map((member, index) => (
            <Image
              key={member.userId}
              source={{ uri: member.profileImage }}
              style={[
                styles.memberImage,
                index > 0 && { marginLeft: -10 },
              ]}
            />
          ))}
          <View style={styles.memberCount}>
            <Text style={styles.memberCountText}>
              {mockFamily.members.length}명
            </Text>
          </View>
        </View>
        <View style={styles.inviteCode}>
          <Text style={styles.inviteCodeLabel}>초대 코드</Text>
          <Text style={styles.inviteCodeValue}>{mockFamily.inviteCode}</Text>
        </View>
      </TouchableOpacity>

      {/* 메뉴 리스트 */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Ionicons
              name={item.icon as any}
              size={22}
              color={colors.text.secondary}
            />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <View style={styles.menuRight}>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.tertiary}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 로그아웃 */}
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>

      {/* 앱 버전 */}
      <Text style={styles.version}>버전 1.0.0 (Mock Mode)</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileCard: {
    backgroundColor: colors.surface,
    padding: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  userEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  dietTags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  dietTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dietTagText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  familyCard: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  familyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  familyMembers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  memberCount: {
    marginLeft: 8,
  },
  memberCountText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  inviteCode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  inviteCodeLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  inviteCodeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 2,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    marginLeft: 12,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    color: colors.error,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.text.tertiary,
    paddingBottom: 32,
  },
})
