import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors, HomeColors, OnboardingColors } from '../../constants/Colors';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { getUserActiveChallenges, getTransactionHistory, UserChallenge, Transaction } from '../../services/api';
import { router } from 'expo-router';

export default function Profile() {
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeChallenges, setActiveChallenges] = useState<UserChallenge[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            // Fetch active challenges
            const challengesResponse = await getUserActiveChallenges();
            if (challengesResponse.success) {
                setActiveChallenges(challengesResponse.data);
            }

            // Fetch transaction history
            const transactionsResponse = await getTransactionHistory();
            if (transactionsResponse.success) {
                setTransactions(transactionsResponse.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        setIsLoggingOut(true);
                        try {
                            await logout();
                        } catch (error) {
                            Alert.alert("Error", "Failed to log out. Please try again.");
                        } finally {
                            setIsLoggingOut(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeScreenView style={styles.container} backgroundColor={HomeColors.background} scrollable={true}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.profileHeader}>
                <Image 
                    source={{ uri: 'https://pbs.twimg.com/profile_images/1900043039831449603/EzgPL3sp_400x400.jpg' }} 
                    style={styles.profileImage} 
                />
                <Text style={styles.profileName}>{user?.username || "User"}</Text>
                <Text style={styles.profileBio}>{user?.email || ""}</Text>
                
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{activeChallenges.length}</Text>
                        <Text style={styles.statLabel}>Active Challenges</Text>
                    </View>
                </View>
                
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Active Challenges</Text>
                
                {loading ? (
                    <Text style={styles.loadingText}>Loading challenges...</Text>
                ) : activeChallenges.length === 0 ? (
                    <View style={styles.emptyChallenges}>
                        <Ionicons name="flag-outline" size={40} color={HomeColors.textSecondary} />
                        <Text style={styles.emptyText}>No active challenges yet</Text>
                        <TouchableOpacity 
                            style={styles.findChallengeButton}
                            onPress={() => router.push('/challenges')}
                        >
                            <Text style={styles.findChallengeText}>Find Challenges</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {activeChallenges.map((item, index) => (
                            <TouchableOpacity 
                                key={item.id} 
                                style={styles.challengeItem}
                                onPress={() => router.push(`/challenges/${item.challengeId}`)}
                            >
                                <View style={styles.challengeImageContainer}>
                                    <Image 
                                        source={{ uri: item.challenge.image }} 
                                        style={styles.challengeImage}
                                    />
                                </View>
                                <View style={styles.challengeContent}>
                                    <Text style={styles.challengeTitle}>
                                        {item.challenge.title}
                                    </Text>
                                    <Text style={styles.challengeType}>
                                        {item.challenge.type} • {item.challenge.difficulty}
                                    </Text>
                                    <View style={styles.progressContainer}>
                                        <View 
                                            style={[
                                                styles.progressBar, 
                                                { width: `${item.progress * 100}%` }
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.progressText}>
                                        {Math.round(item.progress * 100)}% complete
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                )}
            </View>
            
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                
                {loading ? (
                    <Text style={styles.loadingText}>Loading transactions...</Text>
                ) : transactions.length === 0 ? (
                    <View style={styles.emptyTransactions}>
                        <Ionicons name="wallet-outline" size={40} color={HomeColors.textSecondary} />
                        <Text style={styles.emptyText}>No transactions yet</Text>
                    </View>
                ) : (
                    <>
                        {transactions.slice(0, 3).map((transaction) => (
                            <View key={transaction.id} style={styles.transactionItem}>
                                <View style={styles.transactionLeft}>
                                    <View style={[
                                        styles.transactionIcon, 
                                        { backgroundColor: transaction.amount > 0 ? '#4CAF50' : OnboardingColors.accentColor }
                                    ]}>
                                        <Ionicons 
                                            name={transaction.amount > 0 ? "arrow-down" : "arrow-up"} 
                                            size={16} 
                                            color="#fff" 
                                        />
                                    </View>
                                </View>
                                <View style={styles.transactionContent}>
                                    <Text style={styles.transactionTitle}>{transaction.description}</Text>
                                    <Text style={styles.transactionTimestamp}>
                                        {new Date(transaction.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                                <Text 
                                    style={[
                                        styles.transactionAmount, 
                                        transaction.amount > 0 ? styles.positiveAmount : styles.negativeAmount
                                    ]}
                                >
                                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} ACC
                                </Text>
                            </View>
                        ))}
                        
                        {transactions.length > 3 && (
                            <TouchableOpacity style={styles.viewMoreButton}>
                                <Text style={styles.viewMoreText}>View All Transactions</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
            
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Settings</Text>
                
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="notifications-outline" size={24} color={HomeColors.text} />
                    <Text style={styles.settingText}>Notifications</Text>
                    <Ionicons name="chevron-forward" size={18} color={HomeColors.textSecondary} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="lock-closed-outline" size={24} color={HomeColors.text} />
                    <Text style={styles.settingText}>Privacy</Text>
                    <Ionicons name="chevron-forward" size={18} color={HomeColors.textSecondary} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="help-circle-outline" size={24} color={HomeColors.text} />
                    <Text style={styles.settingText}>Help & Support</Text>
                    <Ionicons name="chevron-forward" size={18} color={HomeColors.textSecondary} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="information-circle-outline" size={24} color={HomeColors.text} />
                    <Text style={styles.settingText}>About</Text>
                    <Ionicons name="chevron-forward" size={18} color={HomeColors.textSecondary} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    disabled={isLoggingOut}
                >
                    <Ionicons name="log-out-outline" size={20} color={OnboardingColors.accentColor} />
                    <Text style={styles.logoutText}>{isLoggingOut ? "Logging Out..." : "Log Out"}</Text>
                </TouchableOpacity>
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
    profileHeader: {
        backgroundColor: HomeColors.challengeCard,
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        marginTop: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: OnboardingColors.accentColor,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        color: HomeColors.text,
    },
    profileBio: {
        fontSize: 14,
        color: HomeColors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: HomeColors.text,
    },
    statLabel: {
        fontSize: 14,
        color: HomeColors.textSecondary,
        marginTop: 4,
    },
    editButton: {
        borderWidth: 1,
        borderColor: OnboardingColors.accentColor,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    editButtonText: {
        color: OnboardingColors.accentColor,
        fontWeight: '500',
    },
    sectionContainer: {
        backgroundColor: HomeColors.challengeCard,
        padding: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: HomeColors.text,
    },
    achievementsContainer: {
        marginBottom: 10,
    },
    achievementCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 10,
        padding: 15,
        marginRight: 15,
        width: 150,
    },
    achievementIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFC107',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: HomeColors.text,
    },
    achievementDescription: {
        fontSize: 12,
        color: HomeColors.textSecondary,
    },
    activityItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    activityLeft: {
        alignItems: 'center',
        width: 30,
    },
    activityDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: OnboardingColors.accentColor,
    },
    activityLine: {
        width: 2,
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 4,
        marginBottom: 4,
    },
    activityContent: {
        flex: 1,
        paddingLeft: 10,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
        color: HomeColors.text,
    },
    activityTimestamp: {
        fontSize: 12,
        color: HomeColors.textSecondary,
        marginBottom: 8,
    },
    activityCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: 12,
    },
    activityDetail: {
        fontSize: 14,
        color: HomeColors.text,
    },
    viewMoreButton: {
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 10,
    },
    viewMoreText: {
        color: OnboardingColors.accentColor,
        fontWeight: '500',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: HomeColors.text,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingVertical: 15,
    },
    logoutText: {
        color: OnboardingColors.accentColor,
        fontWeight: '500',
        marginLeft: 8,
        fontSize: 16,
    },
    loadingText: {
        color: HomeColors.textSecondary,
        textAlign: 'center',
        padding: 20,
    },
    emptyChallenges: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 10,
    },
    emptyTransactions: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 10,
    },
    emptyText: {
        color: HomeColors.textSecondary,
        marginTop: 10,
        marginBottom: 15,
    },
    findChallengeButton: {
        backgroundColor: OnboardingColors.accentColor,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    findChallengeText: {
        color: '#fff',
        fontWeight: '500',
    },
    challengeItem: {
        flexDirection: 'row',
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
    },
    challengeImageContainer: {
        width: 80,
        height: 80,
    },
    challengeImage: {
        width: '100%',
        height: '100%',
    },
    challengeContent: {
        flex: 1,
        padding: 10,
    },
    challengeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: HomeColors.text,
        marginBottom: 4,
    },
    challengeType: {
        fontSize: 12,
        color: HomeColors.textSecondary,
        marginBottom: 8,
    },
    progressContainer: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        marginBottom: 6,
    },
    progressBar: {
        height: 4,
        backgroundColor: OnboardingColors.accentColor,
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        color: HomeColors.textSecondary,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 10,
        marginBottom: 10,
        padding: 15,
    },
    transactionLeft: {
        marginRight: 15,
    },
    transactionIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: OnboardingColors.accentColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionContent: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: HomeColors.text,
        marginBottom: 4,
    },
    transactionTimestamp: {
        fontSize: 12,
        color: HomeColors.textSecondary,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    positiveAmount: {
        color: '#4CAF50',
    },
    negativeAmount: {
        color: OnboardingColors.accentColor,
    },
});