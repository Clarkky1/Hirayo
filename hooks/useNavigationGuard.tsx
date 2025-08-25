import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRentalFlow } from '@/contexts/RentalFlowContext';

export const useNavigationGuard = () => {
  const router = useRouter();
  const { canNavigateToStep, canGoBack, markStepCompleted, currentStep } = useRentalFlow();

  const navigateToStep = useCallback((stepId: string, options?: { 
    markCurrentCompleted?: boolean;
    showAlert?: boolean;
  }) => {
    const { markCurrentCompleted = false, showAlert = true } = options || {};

    if (canNavigateToStep(stepId)) {
      // Mark current step as completed if requested
      if (markCurrentCompleted) {
        markStepCompleted(currentStep);
      }
      
      // Navigate to the step
      router.push(stepId as any);
    } else {
      if (showAlert) {
        Alert.alert(
          'Navigation Restricted',
          'You cannot access this step yet. Please complete the current step first.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    }
  }, [canNavigateToStep, markStepCompleted, currentStep, router]);

  const goBack = useCallback((fallbackRoute?: string) => {
    if (canGoBack()) {
      router.back();
    } else if (fallbackRoute) {
      router.replace(fallbackRoute as any);
    } else {
      Alert.alert(
        'Cannot Go Back',
        'You cannot go back from this step. Please continue with the current process.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  }, [canGoBack, router]);

  const validateAndNavigate = useCallback((stepId: string, validationFn?: () => boolean) => {
    if (validationFn && !validationFn()) {
      Alert.alert(
        'Validation Failed',
        'Please complete all required fields before proceeding.',
        [{ text: 'OK', style: 'default' }]
      );
      return false;
    }

    navigateToStep(stepId, { markCurrentCompleted: true });
    return true;
  }, [navigateToStep]);

  return {
    navigateToStep,
    goBack,
    validateAndNavigate,
    canNavigateToStep,
    canGoBack
  };
};
