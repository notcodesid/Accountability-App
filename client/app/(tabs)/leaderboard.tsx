import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors, HomeColors, OnboardingColors } from '../../constants/Colors';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';

export default function Leaderboard() {
    // Sample data for the leaderboard
    const leaderboardData = [
        { id: 1, name: 'Sarah Johnson', points: 2850, avatar: 'https://randomuser.me/api/portraits/women/44.jpg', rank: 1 },
        { id: 2, name: 'David Chen', points: 2720, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', rank: 2 },
        { id: 3, name: 'Aisha Patel', points: 2540, avatar: 'https://randomuser.me/api/portraits/women/65.jpg', rank: 3 },
        { id: 4, name: 'James Wilson', points: 2350, avatar: 'https://randomuser.me/api/portraits/men/75.jpg', rank: 4 },
        { id: 5, name: 'Miguel Santos', points: 2180, avatar: 'https://randomuser.me/api/portraits/men/18.jpg', rank: 5 },
        { id: 6, name: 'Emma Brown', points: 2050, avatar: 'https://randomuser.me/api/portraits/women/33.jpg', rank: 6 },
        { id: 7, name: 'Lucas Kim', points: 1920, avatar: 'https://randomuser.me/api/portraits/men/45.jpg', rank: 7 },
        { id: 8, name: 'Olivia Schmidt', points: 1870, avatar: 'https://randomuser.me/api/portraits/women/28.jpg', rank: 8 },
        { id: 9, name: 'Noah Davis', points: 1760, avatar: 'https://randomuser.me/api/portraits/men/62.jpg', rank: 9 },
        { id: 10, name: 'Sophia Taylor', points: 1650, avatar: 'https://randomuser.me/api/portraits/women/12.jpg', rank: 10 },
    ];

    // My profile data
    const myProfile = { name: 'You', points: 2050, avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', rank: 6 };

    return (
        <SafeScreenView style={styles.container} backgroundColor={HomeColors.background}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.selectedHeaderContainer}>
                <LinearGradient
                    colors={['rgba(23, 23, 23, 0.9)', 'rgba(10, 10, 10, 0.95)']}
                    style={styles.headerGradient}
                >
                    <View style={styles.selectedHeaderContent}>
                        <Text style={styles.selectedHeaderTitle}>Leaderboard</Text>
                        <Text style={styles.selectedHeaderDetails}>Top performers this month</Text>
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                    <Text style={[styles.tabText, styles.activeTabText]}>Global</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Challenges</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.topThree}>
                {leaderboardData.slice(0, 3).map((user, index) => (
                    <View key={user.id} style={[
                        styles.topUser, 
                        index === 1 ? styles.topUserFirst : {},
                        index === 0 ? styles.topUserSecond : {},
                        index === 2 ? styles.topUserThird : {}
                    ]}>
                        <View style={styles.rankBadge}>
                            <Text style={styles.rankText}>{user.rank}</Text>
                        </View>
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
                        <View style={styles.pointsContainer}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.pointsText}>{user.points}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <ScrollView style={styles.rankingsList}>
                {leaderboardData.slice(3).map((user) => (
                    <View key={user.id} style={styles.rankItem}>
                        <Text style={styles.rankNumber}>{user.rank}</Text>
                        <Image source={{ uri: user.avatar }} style={styles.smallAvatar} />
                        <Text style={styles.rankName}>{user.name}</Text>
                        <View style={styles.rankPoints}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.rankPointsText}>{user.points}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.myRankCard}>
                <View style={styles.rankItem}>
                    <Text style={[styles.rankNumber, styles.myRankNumber]}>{myProfile.rank}</Text>
                    <Image source={{ uri: myProfile.avatar }} style={styles.smallAvatar} />
                    <Text style={[styles.rankName, styles.myRankName]}>{myProfile.name}</Text>
                    <View style={styles.rankPoints}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={[styles.rankPointsText, styles.myRankPointsText]}>{myProfile.points}</Text>
                    </View>
                </View>
            </View>
        </SafeScreenView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    selectedHeaderContainer: {
        width: '100%',
    },
    headerGradient: {
        paddingTop: 40,
        paddingBottom: 15,
        paddingHorizontal: 20,
    },
    selectedHeaderContent: {
        flexDirection: 'column',
        position: 'relative',
    },
    selectedHeaderTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    selectedHeaderDetails: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: HomeColors.challengeCard,
        marginTop: 20,
        paddingVertical: 10,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: OnboardingColors.accentColor,
    },
    tabText: {
        fontWeight: '500',
        color: HomeColors.textSecondary,
    },
    activeTabText: {
        color: OnboardingColors.accentColor,
    },
    topThree: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: HomeColors.challengeCard,
        paddingBottom: 20,
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    topUser: {
        alignItems: 'center',
        width: '30%',
        position: 'relative',
    },
    topUserFirst: {
        transform: [{translateY: -15}],
        zIndex: 3,
    },
    topUserSecond: {
        zIndex: 2,
    },
    topUserThird: {
        zIndex: 1,
    },
    rankBadge: {
        position: 'absolute',
        top: 0,
        right: '25%',
        backgroundColor: OnboardingColors.accentColor,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 4,
        borderWidth: 2,
        borderColor: HomeColors.challengeCard,
    },
    rankText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: HomeColors.background,
    },
    userName: {
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'center',
        fontSize: 13,
        width: '90%',
        color: HomeColors.text,
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    pointsText: {
        fontSize: 12,
        marginLeft: 3,
        color: HomeColors.textSecondary,
    },
    rankingsList: {
        flex: 1,
        backgroundColor: HomeColors.challengeCard,
    },
    rankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    rankNumber: {
        width: 30,
        fontSize: 16,
        fontWeight: 'bold',
        color: HomeColors.textSecondary,
    },
    smallAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    rankName: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        fontWeight: '500',
        color: HomeColors.text,
    },
    rankPoints: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankPointsText: {
        fontSize: 14,
        marginLeft: 4,
        fontWeight: 'bold',
        color: HomeColors.text,
    },
    myRankCard: {
        backgroundColor: 'rgba(255, 87, 87, 0.1)', // Subtle accent color background
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 87, 87, 0.2)',
    },
    myRankNumber: {
        color: OnboardingColors.accentColor,
    },
    myRankName: {
        fontWeight: 'bold',
    },
    myRankPointsText: {
        color: OnboardingColors.accentColor,
    },
});