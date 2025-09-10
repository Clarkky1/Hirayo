import { createContext, ReactNode, useContext, useState } from 'react';

export interface RentalFlowStep {
  id: string;
  name: string;
  isCompleted: boolean;
  isAccessible: boolean;
  route: string;
}

interface RentalFlowContextType {
  currentStep: string;
  steps: RentalFlowStep[];
  markStepCompleted: (stepId: string) => void;
  canNavigateToStep: (stepId: string) => boolean;
  canGoBack: () => boolean;
  resetFlow: () => void;
  getCurrentStepIndex: () => number;
}

const RentalFlowContext = createContext<RentalFlowContextType | undefined>(undefined);

export const useRentalFlow = () => {
  const context = useContext(RentalFlowContext);
  if (!context) {
    throw new Error('useRentalFlow must be used within a RentalFlowProvider');
  }
  return context;
};

interface RentalFlowProviderProps {
  children: ReactNode;
}

export const RentalFlowProvider: React.FC<RentalFlowProviderProps> = ({ children }) => {
  const [steps, setSteps] = useState<RentalFlowStep[]>([
    {
      id: 'item-detail',
      name: 'Item Detail',
      isCompleted: false,
      isAccessible: true,
      route: '/item'
    },
    {
      id: 'rental-period',
      name: 'Rental Period',
      isCompleted: false,
      isAccessible: false,
      route: '/period'
    },
    {
      id: 'review-order',
      name: 'Review Order',
      isCompleted: false,
      isAccessible: false,
      route: '/review-order'
    },
    {
      id: 'payment',
      name: 'Payment',
      isCompleted: false,
      isAccessible: false,
      route: '/pay'
    },
    {
      id: 'receipt',
      name: 'Receipt',
      isCompleted: false,
      isAccessible: false,
      route: '/receipt'
    }
  ]);

  const [currentStep, setCurrentStep] = useState('item-detail');

  const markStepCompleted = (stepId: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step => {
        if (step.id === stepId) {
          return { ...step, isCompleted: true };
        }
        // Make next step accessible when current step is completed
        if (step.id === getNextStepId(stepId)) {
          return { ...step, isAccessible: true };
        }
        return step;
      })
    );
  };

  const getNextStepId = (currentStepId: string): string => {
    const currentIndex = steps.findIndex(step => step.id === currentStepId);
    if (currentIndex < steps.length - 1) {
      return steps[currentIndex + 1].id;
    }
    return currentStepId;
  };

  const canNavigateToStep = (stepId: string): boolean => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return false;
    
    // Can always access current step
    if (step.id === currentStep) return true;
    
    // Can access if step is marked as accessible
    if (step.isAccessible) return true;
    
    // Can access if it's a previous step (for going back)
    const currentIndex = getCurrentStepIndex();
    const targetIndex = steps.findIndex(s => s.id === stepId);
    return targetIndex < currentIndex;
  };

  const canGoBack = (): boolean => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex <= 0) return false;
    
    // Can go back to previous step if it exists and is accessible
    const previousStep = steps[currentIndex - 1];
    return previousStep && previousStep.isAccessible;
  };

  const getCurrentStepIndex = (): number => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const resetFlow = () => {
    setSteps(prevSteps => 
      prevSteps.map(step => ({
        ...step,
        isCompleted: false,
        isAccessible: step.id === 'item-detail'
      }))
    );
    setCurrentStep('item-detail');
  };

  const value: RentalFlowContextType = {
    currentStep,
    steps,
    markStepCompleted,
    canNavigateToStep,
    canGoBack,
    resetFlow,
    getCurrentStepIndex
  };

  return (
    <RentalFlowContext.Provider value={value}>
      {children}
    </RentalFlowContext.Provider>
  );
};
