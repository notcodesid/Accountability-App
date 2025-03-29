import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingColors } from '../constants/Colors';

interface ErrorAlertProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const { width } = Dimensions.get('window');

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  visible,
  onClose,
  duration = 4000,
}) => {
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (visible) {
      // Show alert
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 5,
      }).start();
      
      // Auto hide after duration
      const timer = setTimeout(() => {
        hideAlert();
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      animation.setValue(0);
    }
  }, [visible]);
  
  const hideAlert = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };
  
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });
  
  if (!visible && translateY._value === 0) {
    return null;
  }
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY }] }
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="alert-circle" size={24} color="#FF3B30" />
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={hideAlert}
      >
        <Ionicons name="close" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    padding: 16,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
});

export default ErrorAlert; 