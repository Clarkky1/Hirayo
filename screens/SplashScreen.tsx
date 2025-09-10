import { BorderRadius, Colors, Shadows, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const buttonAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate buttons after logo animation
    setTimeout(() => {
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1200);

    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 1200);

    return () => clearTimeout(timer);

  }, []);


  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../assets/splash/h-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}></Text>
        <Text style={styles.tagline}></Text>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonAnim,
            transform: [{ translateY: buttonAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })}],
          },
        ]}
      >
        {/* <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity> */}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
  },
  appName: {
    ...TextStyles.display.medium,
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
    letterSpacing: 2,
  },
  tagline: {
    ...TextStyles.body.large,
    color: Colors.text.inverse,
    opacity: 0.9,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    width: '80%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: Colors.text.inverse,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.softButton,
  },
  loginButtonText: {
    color: Colors.primary[500],
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.text.inverse,
  },
  signupButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
