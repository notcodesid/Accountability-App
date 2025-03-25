import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import SafeScreenView from '../../components/SafeScreenView';

export default function Profile() {
    return (
        <SafeScreenView style={styles.container}>
            <View style={styles.profileHeader}>
                <Image 
                    source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
                    style={styles.profileImage} 
                />
                <Text style={styles.profileName}>John Doe</Text>
                <Text style={styles.profileBio}>Fitness enthusiast, software developer, and accountability champion</Text>
                
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>42</Text>
                        <Text style={styles.statLabel}>Challenges</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>289</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>156</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>
                </View>
                
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsContainer}>
                    <View style={styles.achievementCard}>
                        <View style={styles.achievementIcon}>
                            <Ionicons name="trophy" size={24} color="#FFD700" />
                        </View>
                        <Text style={styles.achievementTitle}>Fitness Pro</Text>
                        <Text style={styles.achievementDescription}>Completed 10 fitness challenges</Text>
                    </View>
                    
                    <View style={styles.achievementCard}>
                        <View style={[styles.achievementIcon, { backgroundColor: '#4CAF50' }]}>
                            <Ionicons name="flame" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.achievementTitle}>30-Day Streak</Text>
                        <Text style={styles.achievementDescription}>Maintained a 30-day activity streak</Text>
                    </View>
                    
                    <View style={styles.achievementCard}>
                        <View style={[styles.achievementIcon, { backgroundColor: '#2196F3' }]}>
                            <Ionicons name="people" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.achievementTitle}>Team Leader</Text>
                        <Text style={styles.achievementDescription}>Led a team of 5+ people in challenges</Text>
                    </View>
                    
                    <View style={styles.achievementCard}>
                        <View style={[styles.achievementIcon, { backgroundColor: '#9C27B0' }]}>
                            <Ionicons name="ribbon" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.achievementTitle}>Early Adopter</Text>
                        <Text style={styles.achievementDescription}>Joined during the first month</Text>
                    </View>
                </ScrollView>
            </View>
            
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Activity History</Text>
                
                <View style={styles.activityItem}>
                    <View style={styles.activityLeft}>
                        <View style={[styles.activityDot, { backgroundColor: Colors.light.tint }]} />
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
                        <View style={[styles.activityDot, { backgroundColor: '#4CAF50' }]} />
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
                    <Ionicons name="notifications-outline" size={24} color={Colors.light.icon} />
                    <Text style={styles.settingText}>Notifications</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.light.icon} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="lock-closed-outline" size={24} color={Colors.light.icon} />
                    <Text style={styles.settingText}>Privacy</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.light.icon} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="help-circle-outline" size={24} color={Colors.light.icon} />
                    <Text style={styles.settingText}>Help & Support</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.light.icon} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="information-circle-outline" size={24} color={Colors.light.icon} />
                    <Text style={styles.settingText}>About</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.light.icon} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeScreenView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    profileHeader: {
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: Colors.light.tint,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        color: Colors.light.text,
    },
    profileBio: {
        fontSize: 14,
        color: Colors.light.icon,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.light.icon,
        marginTop: 4,
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: '#eee',
    },
    editButton: {
        borderWidth: 1,
        borderColor: Colors.light.tint,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    editButtonText: {
        color: Colors.light.tint,
        fontWeight: '500',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: Colors.light.text,
    },
    achievementsContainer: {
        marginLeft: -5,
    },
    achievementCard: {
        width: 140,
        marginRight: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    achievementIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    achievementTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: Colors.light.text,
    },
    achievementDescription: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    activityItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    activityLeft: {
        width: 20,
        alignItems: 'center',
    },
    activityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    activityLine: {
        width: 1,
        flex: 1,
        backgroundColor: '#e0e0e0',
        marginTop: 2,
    },
    activityContent: {
        flex: 1,
        marginLeft: 10,
    },
    activityTitle: {
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    activityTimestamp: {
        fontSize: 12,
        color: Colors.light.icon,
        marginBottom: 8,
    },
    activityCard: {
        backgroundColor: '#f7f7f7',
        borderRadius: 10,
        padding: 10,
    },
    activityDetail: {
        fontSize: 13,
        color: Colors.light.text,
    },
    viewMoreButton: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    viewMoreText: {
        color: Colors.light.tint,
        fontWeight: '500',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingText: {
        fontSize: 16,
        color: Colors.light.text,
        flex: 1,
        marginLeft: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        paddingVertical: 12,
    },
    logoutText: {
        color: '#FF3B30',
        fontWeight: '500',
        marginLeft: 8,
    },
});