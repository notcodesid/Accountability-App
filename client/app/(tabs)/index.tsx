import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors, OnboardingColors } from '../../constants/Colors';
import SafeScreenView from '../../components/SafeScreenView';

export default function Home() {
    return (
        <SafeScreenView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Welcome to Accountability</Text>
                <Text style={styles.headerSubtitle}>Track your goals and stay accountable</Text>
            </View>
            
            <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.light.tint} />
                    <View style={styles.summaryTextContainer}>
                        <Text style={styles.summaryTitle}>5</Text>
                        <Text style={styles.summarySubtitle}>Active Challenges</Text>
                    </View>
                </View>
                
                <View style={styles.summaryItem}>
                    <Ionicons name="trophy" size={24} color={Colors.light.tint} />
                    <View style={styles.summaryTextContainer}>
                        <Text style={styles.summaryTitle}>12</Text>
                        <Text style={styles.summarySubtitle}>Completed</Text>
                    </View>
                </View>
                
                <View style={styles.summaryItem}>
                    <Ionicons name="trending-up" size={24} color={Colors.light.tint} />
                    <View style={styles.summaryTextContainer}>
                        <Text style={styles.summaryTitle}>85%</Text>
                        <Text style={styles.summarySubtitle}>Success Rate</Text>
                    </View>
                </View>
            </View>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today's Tasks</Text>
                <View style={styles.taskCard}>
                    <Ionicons name="fitness" size={24} color={Colors.light.tint} />
                    <View style={styles.taskContent}>
                        <Text style={styles.taskTitle}>Morning Workout</Text>
                        <Text style={styles.taskTime}>7:00 AM - 8:00 AM</Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
                
                <View style={styles.taskCard}>
                    <Ionicons name="book" size={24} color={Colors.light.tint} />
                    <View style={styles.taskContent}>
                        <Text style={styles.taskTitle}>Study Session</Text>
                        <Text style={styles.taskTime}>10:00 AM - 12:00 PM</Text>
                    </View>
                    <Ionicons name="ellipse-outline" size={24} color="#9e9e9e" />
                </View>
                
                <View style={styles.taskCard}>
                    <Ionicons name="water" size={24} color={Colors.light.tint} />
                    <View style={styles.taskContent}>
                        <Text style={styles.taskTitle}>Drink 2L of water</Text>
                        <Text style={styles.taskTime}>Throughout the day</Text>
                    </View>
                    <Ionicons name="time-outline" size={24} color="#FF9800" />
                </View>
            </View>
        </SafeScreenView>
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
    summaryCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        margin: 15,
        marginTop: -20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryTextContainer: {
        alignItems: 'center',
        marginTop: 5,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    summarySubtitle: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    section: {
        margin: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.light.text,
    },
    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    taskContent: {
        flex: 1,
        marginLeft: 15,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.light.text,
    },
    taskTime: {
        fontSize: 12,
        color: Colors.light.icon,
        marginTop: 3,
    },
});