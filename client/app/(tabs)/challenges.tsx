import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function Challenges() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Challenges</Text>
                <Text style={styles.headerSubtitle}>Join or create accountability challenges</Text>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                    <Text style={[styles.tabText, styles.activeTabText]}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Discover</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Completed</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.challengesList}>
                <TouchableOpacity style={styles.challengeCard}>
                    <View style={styles.challengeHeader}>
                        <View style={styles.challengeBadge}>
                            <Ionicons name="fitness" size={20} color="#fff" />
                        </View>
                        <View style={styles.challengeInfo}>
                            <Text style={styles.challengeTitle}>30 Day Fitness</Text>
                            <Text style={styles.challengeMeta}>15 participants • Day 12 of 30</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                    </View>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: '40%' }]} />
                    </View>
                    <View style={styles.challengeStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>85%</Text>
                            <Text style={styles.statLabel}>Completion</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Streak</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>350</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.challengeCard}>
                    <View style={styles.challengeHeader}>
                        <View style={[styles.challengeBadge, { backgroundColor: '#4CAF50' }]}>
                            <Ionicons name="book" size={20} color="#fff" />
                        </View>
                        <View style={styles.challengeInfo}>
                            <Text style={styles.challengeTitle}>Reading Challenge</Text>
                            <Text style={styles.challengeMeta}>8 participants • Day 5 of 21</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                    </View>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: '24%', backgroundColor: '#4CAF50' }]} />
                    </View>
                    <View style={styles.challengeStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>92%</Text>
                            <Text style={styles.statLabel}>Completion</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>5</Text>
                            <Text style={styles.statLabel}>Streak</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>120</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.challengeCard}>
                    <View style={styles.challengeHeader}>
                        <View style={[styles.challengeBadge, { backgroundColor: '#2196F3' }]}>
                            <Ionicons name="water" size={20} color="#fff" />
                        </View>
                        <View style={styles.challengeInfo}>
                            <Text style={styles.challengeTitle}>Hydration Challenge</Text>
                            <Text style={styles.challengeMeta}>23 participants • Day 8 of 14</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                    </View>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: '57%', backgroundColor: '#2196F3' }]} />
                    </View>
                    <View style={styles.challengeStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>78%</Text>
                            <Text style={styles.statLabel}>Completion</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>7</Text>
                            <Text style={styles.statLabel}>Streak</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>210</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.createButton}>
                <Ionicons name="add" size={24} color="#fff" />
                <Text style={styles.createButtonText}>Create Challenge</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    header: {
        padding: 20,
        backgroundColor: Colors.light.tint,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 10,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.light.tint,
    },
    tabText: {
        fontWeight: '500',
        color: Colors.light.icon,
    },
    activeTabText: {
        color: Colors.light.tint,
    },
    challengesList: {
        paddingHorizontal: 15,
    },
    challengeCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    challengeBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.tint,
        justifyContent: 'center',
        alignItems: 'center',
    },
    challengeInfo: {
        flex: 1,
        marginLeft: 12,
    },
    challengeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
    },
    challengeMeta: {
        fontSize: 12,
        color: Colors.light.icon,
        marginTop: 2,
    },
    progressContainer: {
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        marginBottom: 15,
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.light.tint,
        borderRadius: 3,
    },
    challengeStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.light.icon,
        marginTop: 2,
    },
    createButton: {
        flexDirection: 'row',
        backgroundColor: Colors.light.tint,
        borderRadius: 25,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});