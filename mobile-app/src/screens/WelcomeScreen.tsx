import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface WelcomeScreenProps {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🏥</Text>
        <Text style={styles.title}>M-dawa</Text>
        <Text style={styles.subtitle}>Your Personal Health Companion</Text>
        
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Secure & Private</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>Easy to Use</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Quick Transfer</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            1. Set up your profile once{'\n'}
            2. Your data is encrypted locally{'\n'}
            3. Share with doctors via QR code{'\n'}
            4. Keep your health records safe
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Setup')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        
        <Text style={styles.footerText}>
          Your data stays on your device. Always.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  logo: {
    fontSize: 80,
    marginBottom: 20
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 40,
    textAlign: 'center'
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40
  },
  feature: {
    alignItems: 'center',
    flex: 1
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  featureText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center'
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 22
  },
  buttonContainer: {
    padding: 30,
    paddingBottom: 40
  },
  primaryButton: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  primaryButtonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: 'bold'
  },
  footerText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 15
  }
});
