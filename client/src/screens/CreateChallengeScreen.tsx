import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigationTypes';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createChallenge } from '../services/dummyData';

const CreateChallengeScreen: React.FC<{
  navigation: StackNavigationProp<RootStackParamList, 'CreateChallenge'>;
}> = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fitness');
  const [goalType, setGoalType] = useState('steps'); // steps, workout, meditation, custom
  const [goalValue, setGoalValue] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default to 1 week from now
  const [isPublic, setIsPublic] = useState(true);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Categories for challenges
  const categories = [
    'Fitness',
    'Health',
    'Lifestyle',
    'Education',
    'Finance',
    'Mindfulness',
    'Other'
  ];
  
  const getGoalTypeName = (type: string) => {
    switch (type) {
      case 'steps': return 'Daily Steps';
      case 'workout': return 'Weekly Workouts';
      case 'meditation': return 'Daily Meditation';
      case 'custom': return 'Custom Goal';
    }
  };
  
  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case 'steps': return <FontAwesome5 name="walking" size={24} color="#4285F4" />;
      case 'workout': return <FontAwesome5 name="dumbbell" size={24} color="#4285F4" />;
      case 'meditation': return <FontAwesome5 name="spa" size={24} color="#4285F4" />;
      case 'custom': return <FontAwesome5 name="star" size={24} color="#4285F4" />;
    }
  };
  
  const getGoalTypeUnit = (type: string) => {
    switch (type) {
      case 'steps': return 'steps';
      case 'workout': return 'minutes';
      case 'meditation': return 'minutes';
      case 'custom': return 'units';
    }
  };
  
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
    
    // If the user sets a start date after the end date, update the end date
    if (currentDate > endDate) {
      // Set end date to be 1 week after the start date
      const newEndDate = new Date(currentDate);
      newEndDate.setDate(newEndDate.getDate() + 7);
      setEndDate(newEndDate);
    }
  };
  
  const onEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };
  
  const handleGoalTypeSelection = (type: string) => {
    setGoalType(type);
  };
  
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a challenge title");
      return false;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a challenge description");
      return false;
    }
    if (!goalValue.trim() || isNaN(Number(goalValue))) {
      Alert.alert("Error", "Please enter a valid goal value");
      return false;
    }
    if (!entryFee.trim() || isNaN(Number(entryFee))) {
      Alert.alert("Error", "Please enter a valid entry fee");
      return false;
    }
    if (startDate >= endDate) {
      Alert.alert("Error", "End date must be after start date");
      return false;
    }
    
    // Validate user's wallet balance if necessary
    const entryFeeAmount = parseFloat(entryFee);
    if (user?.walletBalance !== undefined && entryFeeAmount > user.walletBalance) {
      Alert.alert(
        "Insufficient Funds", 
        `You don't have enough funds in your wallet. Your balance: $${user.walletBalance}`,
        [
          { text: "Add Funds", onPress: () => navigation.navigate('Wallet') },
          { text: "Cancel", style: "cancel" }
        ]
      );
      return false;
    }
    
    return true;
  };
  
  const handleCreateChallenge = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare challenge data
      const challengeData = {
        title,
        description,
        category,
        goalType,
        goalValue: parseFloat(goalValue),
        entryFee: parseFloat(entryFee),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isPublic,
      };
      
      // Call the API to create the challenge
      const newChallenge = await createChallenge(challengeData);
      
      Alert.alert(
        "Challenge Created!",
        `Your challenge "${title}" has been created and $${entryFee} has been deducted from your wallet. The total pot size is now $${entryFee}.`,
        [
          { 
            text: "View Challenge", 
            onPress: () => navigation.navigate('ChallengeDetails', { challengeId: newChallenge.id })
          },
          {
            text: "Back to Home",
            onPress: () => navigation.navigate('HomeStack')
          }
        ]
      );
    } catch (error) {
      console.error('Error creating challenge:', error);
      Alert.alert(
        "Error",
        "Failed to create challenge. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Challenge</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Challenge Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Challenge Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter a catchy title..."
            />
          </View>
          
          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity 
              style={styles.categorySelector}
              onPress={() => setShowCategoryPicker(true)}
            >
              <Text style={styles.categoryText}>{category}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          
          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your challenge..."
              multiline
              numberOfLines={4}
            />
          </View>
          
          {/* Goal Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Goal Type</Text>
            <View style={styles.goalTypeContainer}>
              {['steps', 'workout', 'meditation', 'custom'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.goalTypeButton,
                    goalType === type && styles.selectedGoalType,
                  ]}
                  onPress={() => handleGoalTypeSelection(type)}
                >
                  {getGoalTypeIcon(type)}
                  <Text style={goalType === type ? styles.selectedGoalTypeText : styles.goalTypeText}>
                    {getGoalTypeName(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Goal Value */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Goal Value</Text>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={[styles.input, { flex: 2 }]}
                value={goalValue}
                onChangeText={setGoalValue}
                placeholder="e.g., 10000"
                keyboardType="numeric"
              />
              <View style={styles.unitContainer}>
                <Text style={styles.unitText}>{getGoalTypeUnit(goalType)}</Text>
              </View>
            </View>
          </View>
          
          {/* Entry Fee */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Entry Fee</Text>
            <View style={styles.inputWithUnit}>
              <View style={styles.unitContainerLeft}>
                <Text style={styles.unitText}>$</Text>
              </View>
              <TextInput
                style={[styles.input, { flex: 2 }]}
                value={entryFee}
                onChangeText={setEntryFee}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
            {user?.walletBalance !== undefined && (
              <Text style={styles.walletInfo}>
                Your wallet balance: <Text style={styles.walletBalance}>${user.walletBalance.toFixed(2)}</Text>
              </Text>
            )}
          </View>
          
          {/* Date Range */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Challenge Duration</Text>
            
            {/* Start Date */}
            <TouchableOpacity 
              style={styles.dateSelector} 
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.dateLabel}>Start Date:</Text>
              <Text style={styles.dateText}>{formatDate(startDate)}</Text>
              <Ionicons name="calendar-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            
            {/* End Date */}
            <TouchableOpacity 
              style={styles.dateSelector} 
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.dateLabel}>End Date:</Text>
              <Text style={styles.dateText}>{formatDate(endDate)}</Text>
              <Ionicons name="calendar-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            
            {/* Date Pickers */}
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onStartDateChange}
                minimumDate={new Date()}
              />
            )}
            
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={onEndDateChange}
                minimumDate={startDate}
              />
            )}
          </View>
          
          {/* Privacy Setting */}
          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Public Challenge</Text>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: '#d1d1d1', true: '#c7dcff' }}
                thumbColor={isPublic ? '#007AFF' : '#f4f3f4'}
              />
            </View>
            <Text style={styles.switchDescription}>
              {isPublic 
                ? "Anyone can find and join this challenge" 
                : "Only people you invite can join this challenge"}
            </Text>
          </View>
          
          {/* Create Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateChallenge}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <FontAwesome5 name="plus-circle" size={16} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.createButtonText}>Create Challenge</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            
            <ScrollView style={styles.categoryList}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={[
                    styles.categoryItemText,
                    cat === category && styles.selectedCategoryText
                  ]}>
                    {cat}
                  </Text>
                  {cat === category && (
                    <Ionicons name="checkmark" size={24} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCategoryPicker(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  goalTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalTypeButton: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  selectedGoalType: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  goalTypeText: {
    marginTop: 8,
    fontWeight: '500',
    color: '#666',
  },
  selectedGoalTypeText: {
    marginTop: 8,
    fontWeight: '600',
    color: '#007AFF',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#ddd',
  },
  unitContainerLeft: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#ddd',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  walletInfo: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  walletBalance: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchDescription: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
  },
  categoryText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  selectedCategoryText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateChallengeScreen; 