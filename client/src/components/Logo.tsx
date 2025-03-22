import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface LogoProps {
  size?: number;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 100, color = '#007AFF' }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.logoContainer, { backgroundColor: color }]}>
        <FontAwesome5 name="handshake" size={size * 0.4} color="white" />
      </View>
      <View style={styles.circleOverlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: '80%',
    height: '80%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  circleOverlay: {
    position: 'absolute',
    top: '15%',
    right: '10%',
    width: '25%',
    height: '25%',
    borderRadius: 50,
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default Logo; 