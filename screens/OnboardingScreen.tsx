import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.text.inverse,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xl * 2,
    },
    logo: {
      width: 50,
      height: 50,
      marginTop: Spacing.xl * 4,
      marginBottom: Spacing.xl,
    },
    image: {
      width: width * 0.8,
      height: height * 0.35,
      marginTop: Spacing['2xl'] * 3,
      marginBottom: Spacing.xl,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.xl * 6,
    },
    text: {
      ...TextStyles.body.large,
      color: Colors.text.primary,
      textAlign: 'center',
      lineHeight: 22,
      marginTop: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    highlight: {
      color: Colors.primary[500],
      fontWeight: '600',
    },
    button: {
      backgroundColor: Colors.primary[500],
      paddingVertical: Spacing.xl,
      borderRadius: BorderRadius.md,
      position: 'absolute',
      bottom: 30,
      width: width * 0.9,
      alignItems: 'center',
    },
    buttonText: {
      color: Colors.text.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
  });
  

const slides = [
    {
      id: 1,
      image: require('../assets/onboarding/onboarding1.png'),
      text1: (
        <>
          A smart way to <Text style={styles.highlight}>borrow</Text> and{' '}
          <Text style={styles.highlight}>lend</Text> devices safely and easily.
        </>
      ),
      text2: (
        <>
          List your gadgets and <Text style={styles.highlight}>earn extra income</Text> with ease.
        </>
      ),
    },
    {       
      id: 2,
      image: require('../assets/onboarding/onboarding2.png'),
      text1: (
        <>
          Browse and <Text style={styles.highlight}>borrow devices</Text> whenever you need them.
        </>
      ),
    },
    {
      id: 3,
      image: require('../assets/onboarding/onboarding3.png'),
      text1: (
        <>
          <Text style={styles.highlight}>Verified</Text> users, protected payments, and{' '}
          <Text style={styles.highlight}>worry-free</Text> transactions.
        </>
      ),
    },
  ];
  
export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/onboarding/H.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Illustration */}
      <Image
        source={slides[currentSlide].image}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Description */}
      <View style={styles.textContainer}>
        {currentSlide === 0 ? (
            <>
            <Text style={styles.text}>
                A smart way to <Text style={styles.highlight}>borrow</Text> and{' '}
                <Text style={styles.highlight}>lend</Text> devices safely and easily.
            </Text>
            <Text style={styles.text}>
                List your gadgets and <Text style={styles.highlight}>earn extra income</Text> with ease.
            </Text>
            </>
        ) : (
            <>
            <Text style={styles.text}>{slides[currentSlide].text1}</Text>
            {slides[currentSlide].text2 && (
                <Text style={styles.text}>{slides[currentSlide].text2}</Text>
            )}
            </>
        )}
      </View>

      {/* Next / Get Started Button */}
      {currentSlide < slides.length - 1 ? (
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

