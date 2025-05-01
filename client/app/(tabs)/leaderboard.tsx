import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, StatusBar } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { HomeColors, OnboardingColors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingSpinner from '../../components/LoadingSpinner';

// Interface for leaderboard user
interface LeaderboardUser {
    id: number;
    name: string;
    solEarned: number;
    avatar: string;
    rank: number;
}

// Mock leaderboard data
const MOCK_LEADERBOARD: LeaderboardUser[] = [
    {
        id: 1,
        name: 'Naruto Uzumaki',
        solEarned: 98.5,
        avatar: 'https://i.pinimg.com/736x/78/df/14/78df145e9ab3a732f1b438255a1eaa3a.jpg',
        rank: 1
    },
    {
        id: 2,
        name: 'Goku',
        solEarned: 87.2,
        avatar: 'https://i.pinimg.com/736x/e2/f0/6c/e2f06c9101dc22814be2a2352f7dc871.jpg',
        rank: 2
    },
    {
        id: 3,
        name: 'Luffy',
        solEarned: 76.5,
        avatar: 'https://i.pinimg.com/736x/e6/36/a6/e636a664f860a1ec9f7b5f3c4e2f634b.jpg',
        rank: 3
    },
    {
        id: 4,
        name: 'Ichigo Kurosaki',
        solEarned: 65.4,
        avatar: 'https://i.pinimg.com/736x/46/aa/bc/46aabc665a6f472d20e128d78119b78d.jpg',
        rank: 4
    },
    {
        id: 5,
        name: 'Eren Yeager',
        solEarned: 59.8,
        avatar: 'https://i.pinimg.com/736x/9d/5f/87/9d5f879a1f42586dcf62a82d9f7e1107.jpg',
        rank: 5
    },
    {
        id: 6,
        name: 'Saitama',
        solEarned: 54.3,
        avatar: 'https://i.pinimg.com/736x/96/83/26/96832659a4ef207d32af9b97b0ba8055.jpg',
        rank: 6
    },
    {
        id: 7,
        name: 'Gojo Satoru',
        solEarned: 49.2,
        avatar: 'https://i.pinimg.com/736x/70/3d/a4/703da43981e4d15c16a18a11658c94f7.jpg',
        rank: 7
    },
    {
        id: 8,
        name: 'Tanjiro Kamado',
        solEarned: 43.5,
        avatar: 'https://i.pinimg.com/736x/93/6e/98/936e987431c8898cbbc4a4e1e5422008.jpg',
        rank: 8
    },
    {
        id: 9,
        name: 'Vegeta',
        solEarned: 37.8,
        avatar: 'https://i.pinimg.com/736x/7d/0d/c5/7d0dc54852606180bc36e118ec3312dd.jpg',
        rank: 9
    },
    {
        id: 10,
        name: 'Levi Ackerman',
        solEarned: 32.4,
        avatar: 'https://i.pinimg.com/736x/1f/9b/91/1f9b91ea28dac29d400409e434c0274a.jpg',
        rank: 10
    }
];

// Mock user profile
const MOCK_USER_PROFILE: LeaderboardUser = {
    id: 0,
    name: 'You',
    solEarned: 41.0,
    avatar: 'https://pbs.twimg.com/profile_images/1900043039831449603/EzgPL3sp_400x400.jpg',
    rank: 8
};

export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
    const [myProfile, setMyProfile] = useState<LeaderboardUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = () => {
        // Simulate API call with a delay
        setLoading(true);
        setTimeout(() => {
            try {
                setLeaderboardData(MOCK_LEADERBOARD);
                setMyProfile(MOCK_USER_PROFILE);
                setError(null);
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
                setError('An error occurred while fetching leaderboard data');
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    // Render a ranking item for positions 4 and below
    const renderRankItem = ({ item }: { item: LeaderboardUser }) => (
        <View style={styles.rankItem}>
            <Text style={styles.rankNumber}>{item.rank}</Text>
            <Image source={{ uri: item.avatar }} style={styles.smallAvatar} />
            <Text style={styles.rankName}>{item.name}</Text>
            <View style={styles.rankPoints}>
                <Ionicons name="wallet" size={14} color="#FFD700" />
                <Text style={styles.rankPointsText}>{item.solEarned} SOL</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={styles.safeAreaTop} />
                <View style={styles.loadingContainer}>
                    <LoadingSpinner message="Loading leaderboard..." />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={styles.safeAreaTop} />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color={HomeColors.textSecondary} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryButton}
                        onPress={fetchLeaderboardData}
                    >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Ensure we have at least 3 items for the top podium
    const topUsers = leaderboardData.slice(0, 3);
    while (topUsers.length < 3) {
        topUsers.push({
            id: -topUsers.length,
            name: 'Unknown',
            solEarned: 0,
            avatar: 'https://randomuser.me/api/portraits/lego/0.jpg',
            rank: topUsers.length + 1
        });
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.safeAreaTop} />
            
            <View style={styles.selectedHeaderContainer}>
                <LinearGradient
                    colors={['rgba(23, 23, 23, 0.9)', 'rgba(10, 10, 10, 0.95)']}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View style={styles.selectedHeaderContent}>
                        <Text style={styles.selectedHeaderTitle}>Leaderboard</Text>
                        <Text style={styles.selectedHeaderDetails}>SOL Earned (Beta)</Text>
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.topThree}>
                {/* Third place - Left */}
                <View style={[styles.topUser, styles.topUserThird]}>
                    <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>3</Text>
                    </View>
                    <Image source={{ uri: topUsers[2].avatar }} style={styles.avatar} />
                    <Text style={styles.userName} numberOfLines={1}>{topUsers[2].name}</Text>
                    <View style={styles.pointsContainer}>
                        <Ionicons name="wallet" size={14} color="#FFD700" />
                        <Text style={styles.pointsText}>{topUsers[2].solEarned} SOL</Text>
                    </View>
                </View>
                
                {/* First place - Middle */}
                <View style={[styles.topUser, styles.topUserFirst]}>
                    <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>1</Text>
                    </View>
                    <Image source={{ uri: topUsers[0].avatar }} style={[styles.avatar, styles.avatarFirst]} />
                    <Text style={styles.userName} numberOfLines={1}>{topUsers[0].name}</Text>
                    <View style={styles.pointsContainer}>
                        <Ionicons name="wallet" size={14} color="#FFD700" />
                        <Text style={styles.pointsText}>{topUsers[0].solEarned} SOL</Text>
                    </View>
                </View>
                
                {/* Second place - Right */}
                <View style={[styles.topUser, styles.topUserSecond]}>
                    <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>2</Text>
                    </View>
                    <Image source={{ uri: topUsers[1].avatar }} style={styles.avatar} />
                    <Text style={styles.userName} numberOfLines={1}>{topUsers[1].name}</Text>
                    <View style={styles.pointsContainer}>
                        <Ionicons name="wallet" size={14} color="#FFD700" />
                        <Text style={styles.pointsText}>{topUsers[1].solEarned} SOL</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={leaderboardData.slice(3)}
                renderItem={renderRankItem}
                keyExtractor={item => item.id.toString()}
                style={styles.rankingsList}
                ListFooterComponent={
                    myProfile && (
                        <View style={styles.myRankCard}>
                            <View style={styles.rankItem}>
                                <Text style={[styles.rankNumber, styles.myRankNumber]}>{myProfile.rank}</Text>
                                <Image source={{ uri: myProfile.avatar }} style={styles.smallAvatar} />
                                <Text style={[styles.rankName, styles.myRankName]}>{myProfile.name}</Text>
                                <View style={styles.rankPoints}>
                                    <Ionicons name="wallet" size={14} color="#FFD700" />
                                    <Text style={[styles.rankPointsText, styles.myRankPointsText]}>
                                        {myProfile.solEarned} SOL
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: HomeColors.background,
    },
    safeAreaTop: {
        height: 50,
        backgroundColor: HomeColors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: HomeColors.textSecondary,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: OnboardingColors.accentColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    selectedHeaderContainer: {
        width: '100%',
    },
    headerGradient: {
        paddingVertical: 15,
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