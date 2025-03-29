import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors, HomeColors, OnboardingColors } from '../../constants/Colors';
import SafeScreenView from '../../components/SafeScreenView';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Profile() {
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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
                <Text style={styles.profileBio}>{user?.email || ""}
                </Text>
                
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>42</Text>
                        <Text style={styles.statLabel}>Challenges</Text>
                    </View>
                </View>
                
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
            
            
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Activity History</Text>
                
                <View style={styles.activityItem}>
                    <View style={styles.activityLeft}>
                        <View style={[styles.activityDot, { backgroundColor: OnboardingColors.accentColor }]} />
                        <View style={styles.activityLine} />
                    </View>
                    <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>Completed Morning Workout</Text>
                        <Text style={styles.activityTimestamp}>Today, 8:30 AM</Text>
                        <View style={styles.activityCard}>
                            <Text style={styles.activityDetail}>30 minutes of cardio + strength training</Text>
                        </View>
                    </View>
                </View>
                
                <View style={styles.activityItem}>
                    <View style={styles.activityLeft}>
                        <View style={[styles.activityDot, { backgroundColor: OnboardingColors.accentSecondary }]} />
                        <View style={styles.activityLine} />
                    </View>
                    <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>Joined "Reading Challenge"</Text>
                        <Text style={styles.activityTimestamp}>Yesterday, 2:15 PM</Text>
                        <View style={styles.activityCard}>
                            <Text style={styles.activityDetail}>21-day challenge to read 30 minutes daily</Text>
                        </View>
                    </View>
                </View>
                
                <View style={styles.activityItem}>
                    <View style={styles.activityLeft}>
                        <View style={[styles.activityDot, { backgroundColor: '#FF9800' }]} />
                        <View style={styles.activityLine} />
                    </View>
                    <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>Earned "Fitness Pro" Badge</Text>
                        <Text style={styles.activityTimestamp}>Mar 22, 11:45 AM</Text>
                        <View style={styles.activityCard}>
                            <Text style={styles.activityDetail}>Completed 10 fitness challenges</Text>
                        </View>
                    </View>
                </View>
                
                <View style={styles.activityItem}>
                    <View style={styles.activityLeft}>
                        <View style={[styles.activityDot, { backgroundColor: '#9C27B0' }]} />
                        <View style={styles.activityLine} />
                    </View>
                    <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>Completed "30-Day Water Challenge"</Text>
                        <Text style={styles.activityTimestamp}>Mar 18, 9:20 PM</Text>
                        <View style={styles.activityCard}>
                            <Text style={styles.activityDetail}>Successfully drank 2L of water daily for 30 days</Text>
                        </View>
                    </View>
                </View>
                
                <TouchableOpacity style={styles.viewMoreButton}>
                    <Text style={styles.viewMoreText}>View More</Text>
                </TouchableOpacity>
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
    }
});