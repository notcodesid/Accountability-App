import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, StatusBar } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors, HomeColors, OnboardingColors } from '../../constants/Colors';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';

export default function Wallet() {
    return (
        <SafeScreenView style={styles.container} backgroundColor={HomeColors.background} scrollable={false}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.selectedHeaderContainer}>
                <LinearGradient
                    colors={['rgba(23, 23, 23, 0.9)', 'rgba(10, 10, 10, 0.95)']}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View style={styles.selectedHeaderContent}>
                        <Text style={styles.selectedHeaderTitle}>Wallet</Text>
                        <Text style={styles.selectedHeaderDetails}>Manage your accountability tokens</Text>
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.balanceCard}>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <View style={styles.balanceRow}>
                        <Ionicons name="wallet" size={32} color={OnboardingColors.accentColor} />
                        <Text style={styles.balanceAmount}>2,450</Text>
                        <Text style={styles.balanceCurrency}>ACC</Text>
                    </View>
                    <Text style={styles.balanceUsd}>≈ $24.50 USD</Text>
                </View>
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="arrow-down" size={18} color="#fff" />
                        </View>
                        <Text style={styles.actionText}>Receive</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="arrow-up" size={18} color="#fff" />
                        </View>
                        <Text style={styles.actionText}>Send</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="swap-horizontal" size={18} color="#fff" />
                        </View>
                        <Text style={styles.actionText}>Swap</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="cart" size={18} color="#fff" />
                        </View>
                        <Text style={styles.actionText}>Shop</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.transactionItem}>
                    <View style={styles.transactionIconContainer}>
                        <Ionicons name="trophy" size={20} color="#fff" />
                    </View>
                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionTitle}>Challenge Reward</Text>
                        <Text style={styles.transactionDate}>Mar 24, 2024</Text>
                    </View>
                    <Text style={styles.transactionAmount}>+250 ACC</Text>
                </View>

                <View style={styles.transactionItem}>
                    <View style={[styles.transactionIconContainer, { backgroundColor: OnboardingColors.accentSecondary }]}>
                        <Ionicons name="gift" size={20} color="#fff" />
                    </View>
                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionTitle}>Friend Referral Bonus</Text>
                        <Text style={styles.transactionDate}>Mar 22, 2024</Text>
                    </View>
                    <Text style={styles.transactionAmount}>+100 ACC</Text>
                </View>

                <View style={styles.transactionItem}>
                    <View style={[styles.transactionIconContainer, { backgroundColor: '#FF5722' }]}>
                        <Ionicons name="cart" size={20} color="#fff" />
                    </View>
                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionTitle}>Premium Badge Purchase</Text>
                        <Text style={styles.transactionDate}>Mar 20, 2024</Text>
                    </View>
                    <Text style={[styles.transactionAmount, styles.negativeAmount]}>-500 ACC</Text>
                </View>

                <View style={styles.transactionItem}>
                    <View style={[styles.transactionIconContainer, { backgroundColor: '#2196F3' }]}>
                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    </View>
                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionTitle}>Daily Streak Bonus</Text>
                        <Text style={styles.transactionDate}>Mar 19, 2024</Text>
                    </View>
                    <Text style={styles.transactionAmount}>+50 ACC</Text>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Token Rewards</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>Learn More</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rewardsContainer}>
                    <TouchableOpacity style={styles.rewardCard}>
                        <View style={styles.rewardHeader}>
                            <Ionicons name="checkmark-circle" size={24} color={OnboardingColors.accentColor} />
                            <Text style={styles.rewardValue}>+10 ACC</Text>
                        </View>
                        <Text style={styles.rewardTitle}>Daily Check-in</Text>
                        <Text style={styles.rewardDescription}>Open the app and check in daily</Text>
                        <TouchableOpacity style={styles.rewardButton}>
                            <Text style={styles.rewardButtonText}>Claim</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.rewardCard}>
                        <View style={styles.rewardHeader}>
                            <Ionicons name="people" size={24} color={OnboardingColors.accentColor} />
                            <Text style={styles.rewardValue}>+100 ACC</Text>
                        </View>
                        <Text style={styles.rewardTitle}>Refer a Friend</Text>
                        <Text style={styles.rewardDescription}>Invite friends to join the app</Text>
                        <TouchableOpacity style={styles.rewardButton}>
                            <Text style={styles.rewardButtonText}>Invite</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.rewardCard}>
                        <View style={styles.rewardHeader}>
                            <Ionicons name="star" size={24} color={OnboardingColors.accentColor} />
                            <Text style={styles.rewardValue}>+50 ACC</Text>
                        </View>
                        <Text style={styles.rewardTitle}>5-Day Streak</Text>
                        <Text style={styles.rewardDescription}>Complete challenges for 5 days straight</Text>
                        <View style={[styles.rewardButton, styles.rewardButtonDisabled]}>
                            <Text style={styles.rewardButtonTextDisabled}>3/5 Days</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.rewardCard}>
                        <View style={styles.rewardHeader}>
                            <Ionicons name="trophy" size={24} color={OnboardingColors.accentColor} />
                            <Text style={styles.rewardValue}>+200 ACC</Text>
                        </View>
                        <Text style={styles.rewardTitle}>Challenge Win</Text>
                        <Text style={styles.rewardDescription}>Win your first challenge of the month</Text>
                        <TouchableOpacity style={styles.rewardButton}>
                            <Text style={styles.rewardButtonText}>Join Challenge</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Accountability Shop</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>Browse All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.shopItem}>
                    <Image 
                        source={{ uri: 'https://img.icons8.com/color/96/000000/prize.png' }}
                        style={styles.shopItemImage}
                    />
                    <View style={styles.shopItemDetails}>
                        <Text style={styles.shopItemTitle}>Premium Profile Badge</Text>
                        <Text style={styles.shopItemDescription}>Stand out with a special profile badge</Text>
                        <View style={styles.shopItemFooter}>
                            <Text style={styles.shopItemPrice}>500 ACC</Text>
                            <TouchableOpacity style={styles.shopItemButton}>
                                <Text style={styles.shopItemButtonText}>Purchase</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.shopItem}>
                    <Image 
                        source={{ uri: 'https://img.icons8.com/color/96/000000/theme-park.png' }}
                        style={styles.shopItemImage}
                    />
                    <View style={styles.shopItemDetails}>
                        <Text style={styles.shopItemTitle}>Custom Theme Pack</Text>
                        <Text style={styles.shopItemDescription}>Personalize your app experience</Text>
                        <View style={styles.shopItemFooter}>
                            <Text style={styles.shopItemPrice}>750 ACC</Text>
                            <TouchableOpacity style={styles.shopItemButton}>
                                <Text style={styles.shopItemButtonText}>Purchase</Text>
                            </TouchableOpacity>
                        </View>
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
    balanceCard: {
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 15,
        margin: 15,
        marginTop: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    balanceContainer: {
        alignItems: 'center',
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    balanceLabel: {
        fontSize: 14,
        color: HomeColors.textSecondary,
        marginBottom: 10,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: HomeColors.text,
    },
    balanceCurrency: {
        fontSize: 18,
        fontWeight: '500',
        color: HomeColors.textSecondary,
    },
    balanceUsd: {
        marginTop: 5,
        fontSize: 12,
        color: HomeColors.textSecondary,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
    },
    actionButton: {
        alignItems: 'center',
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: OnboardingColors.accentColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 12,
        color: HomeColors.text,
    },
    section: {
        backgroundColor: HomeColors.challengeCard,
        borderRadius: 15,
        margin: 15,
        marginBottom: 0,
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: HomeColors.text,
    },
    seeAllText: {
        fontSize: 14,
        color: OnboardingColors.accentColor,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    transactionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: OnboardingColors.accentColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionDetails: {
        flex: 1,
        marginLeft: 15,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: HomeColors.text,
    },
    transactionDate: {
        fontSize: 12,
        color: HomeColors.textSecondary,
        marginTop: 3,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    negativeAmount: {
        color: '#FF5722',
    },
    rewardsContainer: {
        marginBottom: 10,
    },
    rewardCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 15,
        padding: 15,
        width: 160,
        marginRight: 15,
    },
    rewardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    rewardValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    rewardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: HomeColors.text,
    },
    rewardDescription: {
        fontSize: 12,
        color: HomeColors.textSecondary,
        marginBottom: 15,
        height: 30,
    },
    rewardButton: {
        backgroundColor: OnboardingColors.accentColor,
        borderRadius: 20,
        paddingVertical: 8,
        alignItems: 'center',
    },
    rewardButtonText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 14,
    },
    rewardButtonDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    rewardButtonTextDisabled: {
        color: HomeColors.textSecondary,
    },
    shopItem: {
        flexDirection: 'row',
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    shopItemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    shopItemDetails: {
        flex: 1,
        marginLeft: 15,
    },
    shopItemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: HomeColors.text,
        marginBottom: 4,
    },
    shopItemDescription: {
        fontSize: 12,
        color: HomeColors.textSecondary,
        marginBottom: 10,
    },
    shopItemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shopItemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: HomeColors.text,
    },
    shopItemButton: {
        backgroundColor: OnboardingColors.accentColor,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15,
    },
    shopItemButtonText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 12,
    }
});