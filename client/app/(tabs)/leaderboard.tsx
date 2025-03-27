import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, StatusBar } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors, HomeColors, OnboardingColors } from '../../constants/Colors';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';

// Define interface for leaderboard user data
interface LeaderboardUser {
    id: number;
    name: string;
    points: number;
    avatar: string;
    rank: number;
}

export default function Leaderboard() {
    // Sample data for the leaderboard
    const leaderboardData: LeaderboardUser[] = [
        { id: 1, name: 'Goku', points: 2850, avatar: 'https://i.pinimg.com/736x/e2/f0/6c/e2f06c9101dc22814be2a2352f7dc871.jpg', rank: 1 },
        { id: 2, name: 'Luffy', points: 2720, avatar: 'https://i.pinimg.com/736x/0d/98/b2/0d98b2916254548f2c79a57eb8768969.jpg', rank: 2 },
        { id: 3, name: 'Levi Ackerman', points: 2540, avatar: 'https://i.pinimg.com/736x/49/0c/9e/490c9ef127fca74c07c339a998e96286.jpg', rank: 3 },
        { id: 4, name: 'Light Yagami', points: 2350, avatar: 'https://i.pinimg.com/736x/91/3a/7d/913a7d47adda9de9a441c7a6c554a211.jpg', rank: 4 },
        { id: 5, name: 'Naruto Uzumaki', points: 2180, avatar: 'https://i.pinimg.com/736x/4a/28/78/4a2878cd36ba397be2163c55cfef0026.jpg', rank: 5 },
        { id: 6, name: 'Itachi Uchiha', points: 2050, avatar: 'https://i.pinimg.com/736x/ad/d7/6f/add76f09ad6577fe5c76f7af54adf633.jpg', rank: 6 },
        { id: 7, name: 'Edward Elric', points: 1920, avatar: 'https://i.pinimg.com/736x/dd/ee/f5/ddeef5dd4173a48e8f8d69272aa064ca.jpg', rank: 7 },
        { id: 8, name: ' Gojo Satoru ', points: 1870, avatar: 'https://i.pinimg.com/736x/b9/66/8b/b9668b8233a769967e4ba7cdf0e0d3bf.jpg', rank: 8 },
        { id: 9, name: ' Eren Yeager', points: 1760, avatar: 'https://randomuser.me/api/portraits/men/62.jpg', rank: 9 },
        { id: 10, name: 'Zoro', points: 1650, avatar: 'https://i.pinimg.com/736x/40/15/36/4015368ab3afc5b1e352fe56b8d356b2.jpg', rank: 10 },
    ];

    // My profile data
    const myProfile: LeaderboardUser = { id: 0, name: 'You', points: 2050, avatar: 'https://pbs.twimg.com/profile_images/1900043039831449603/EzgPL3sp_400x400.jpg', rank: 34 };

    // Render a ranking item for positions 4 and below
    const renderRankItem = ({ item }: { item: LeaderboardUser }) => (
        <View style={styles.rankItem}>
            <Text style={styles.rankNumber}>{item.rank}</Text>
            <Image source={{ uri: item.avatar }} style={styles.smallAvatar} />
            <Text style={styles.rankName}>{item.name}</Text>
            <View style={styles.rankPoints}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.rankPointsText}>{item.points}</Text>
            </View>
        </View>
    );

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

            <View style={styles.topThree}>
                {/* Third place - Left */}
                <View style={[styles.topUser, styles.topUserThird]}>
                    <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>3</Text>
                    </View>
                    <Image source={{ uri: leaderboardData[2].avatar }} style={styles.avatar} />
                    <Text style={styles.userName} numberOfLines={1}>{leaderboardData[2].name}</Text>
                    <View style={styles.pointsContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.pointsText}>{leaderboardData[2].points}</Text>
                    </View>
                </View>
                
                {/* First place - Middle */}
                <View style={[styles.topUser, styles.topUserFirst]}>
                    <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>1</Text>
                    </View>
                    <Image source={{ uri: leaderboardData[0].avatar }} style={[styles.avatar, styles.avatarFirst]} />
                    <Text style={styles.userName} numberOfLines={1}>{leaderboardData[0].name}</Text>
                    <View style={styles.pointsContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.pointsText}>{leaderboardData[0].points}</Text>
                    </View>
                </View>
                
                {/* Second place - Right */}
                <View style={[styles.topUser, styles.topUserSecond]}>
                    <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>2</Text>
                    </View>
                    <Image source={{ uri: leaderboardData[1].avatar }} style={styles.avatar} />
                    <Text style={styles.userName} numberOfLines={1}>{leaderboardData[1].name}</Text>
                    <View style={styles.pointsContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.pointsText}>{leaderboardData[1].points}</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={leaderboardData.slice(3)}
                renderItem={renderRankItem}
                keyExtractor={item => item.id.toString()}
                style={styles.rankingsList}
                ListFooterComponent={
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
                }
            />
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
    topThree: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: HomeColors.challengeCard,
        paddingVertical: 30,
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    topUser: {
        alignItems: 'center',
        width: '30%',
        position: 'relative',
    },
    topUserFirst: {
        transform: [{translateY: -25}],
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
    avatarFirst: {
        width: 85,
        height: 85,
        borderRadius: 42.5,
        borderWidth: 4,
        borderColor: '#FFD700',
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