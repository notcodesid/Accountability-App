import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigationTypes';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { getChallenge, recordProgress, Challenge } from '../services/dummyData';

type RecordProgressScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'RecordProgress'>;
  route: RouteProp<RootStackParamList, 'RecordProgress'>;
};

const RecordProgressScreen: React.FC<RecordProgressScreenProps> = ({ navigation, route }) => {
  const { challengeId } = route.params;
  const [progressValue, setProgressValue] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const challengeData = await getChallenge(challengeId);
        if (challengeData) {
          setChallenge(challengeData);
        } else {
          Alert.alert('Error', 'Challenge not found');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load challenge details');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [challengeId, navigation]);

  const getGoalTypeUnit = (type: string) => {
    switch (type) {
      case 'steps': return 'steps';
      case 'workout': return 'minutes';
      case 'meditation': return 'minutes';
      case 'custom': 
      default: return 'units';
    }
  };

  const handleSubmit = async () => {
    if (!progressValue.trim() || isNaN(Number(progressValue))) {
      Alert.alert('Error', 'Please enter a valid progress value');
      return;
    }

    if (!challenge) return;

    setIsSubmitting(true);
    try {
      await recordProgress(
        challengeId, 
        Number(progressValue), 
        notes.trim() || undefined
      );
      
      Alert.alert(
        'Success',
        'Your progress has been recorded!',
        [{ text: 'OK', onPress: () => navigation.navigate('ChallengeDetails', { challengeId }) }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to record progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading challenge details...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Progress</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.challengeInfo}>
          <Text style={styles.challengeTitle}>{challenge?.title}</Text>
          
          <View style={styles.goalInfo}>
            <FontAwesome5 
              name={challenge?.goalType === 'steps' ? 'walking' : 
                    challenge?.goalType === 'workout' ? 'dumbbell' : 
                    challenge?.goalType === 'meditation' ? 'spa' : 'star'} 
              size={20} 
              color="#007AFF" 
              style={styles.goalIcon} 
            />
            <Text style={styles.goalText}>
              Goal: {challenge?.goalValue} {getGoalTypeUnit(challenge?.goalType || 'custom')}
              {challenge?.goalType === 'steps' ? ' daily' : 
               challenge?.goalType === 'workout' ? ' per session' : 
               challenge?.goalType === 'meditation' ? ' daily' : ''}
            </Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Today's Progress</Text>
          <View style={styles.inputWithUnit}>
            <TextInput
              style={styles.input}
              placeholder={`Enter value (in ${getGoalTypeUnit(challenge?.goalType || 'custom')})`}
              value={progressValue}
              onChangeText={setProgressValue}
              keyboardType="numeric"
            />
            <View style={styles.unitContainer}>
              <Text style={styles.unitText}>{getGoalTypeUnit(challenge?.goalType || 'custom')}</Text>
            </View>
          </View>

          <Text style={styles.label}>Notes (Optional)</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="How did it go? Add any notes about your progress..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <FontAwesome5 name="check-circle" size={16} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.submitButtonText}>Submit Progress</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  challengeInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    marginRight: 8,
  },
  goalText: {
    fontSize: 16,
    color: '#555',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  unitContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    height: 50,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 30,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecordProgressScreen; 