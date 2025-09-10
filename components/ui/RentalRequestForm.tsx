import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface RentalRequestFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (request: RentalRequestData) => void;
  itemName: string;
  itemPrice: number;
}

interface RentalRequestData {
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  specialRequests: string;
}

export const RentalRequestForm: React.FC<RentalRequestFormProps> = ({
  visible,
  onClose,
  onSubmit,
  itemName,
  itemPrice,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  };

  const calculateTotal = (days: number) => {
    return days * itemPrice;
  };

  const totalDays = calculateDays(startDate, endDate);
  const totalAmount = calculateTotal(totalDays);

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select both start and end dates');
      return;
    }

    if (totalDays <= 0) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    if (totalDays > 30) {
      Alert.alert('Error', 'Rental period cannot exceed 30 days');
      return;
    }

    const requestData: RentalRequestData = {
      startDate,
      endDate,
      totalDays,
      totalAmount,
      specialRequests: specialRequests.trim(),
    };

    onSubmit(requestData);
    onClose();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  console.log('RentalRequestForm render - visible:', visible);
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Rental Request</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{itemName}</Text>
            <Text style={styles.itemPrice}>₱{itemPrice.toLocaleString()}/day</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Rental Period</Text>
            
            <View style={styles.dateRow}>
              <TouchableOpacity style={styles.dateButton}>
                <Ionicons name="calendar" size={20} color={Colors.primary[500]} />
                <Text style={styles.dateButtonText}>
                  {formatDate(startDate)}
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.dateSeparator}>to</Text>
              
              <TouchableOpacity style={styles.dateButton}>
                <Ionicons name="calendar" size={20} color={Colors.primary[500]} />
                <Text style={styles.dateButtonText}>
                  {formatDate(endDate)}
                </Text>
              </TouchableOpacity>
            </View>

            {totalDays > 0 && (
              <View style={styles.calculationRow}>
                <Text style={styles.calculationText}>
                  {totalDays} day{totalDays > 1 ? 's' : ''} × ₱{itemPrice.toLocaleString()}
                </Text>
                <Text style={styles.totalAmount}>₱{totalAmount.toLocaleString()}</Text>
              </View>
            )}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Special Requests (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Any special requirements or questions..."
              placeholderTextColor={Colors.text.tertiary}
              value={specialRequests}
              onChangeText={setSpecialRequests}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.submitButton, totalDays <= 0 && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={totalDays <= 0}
            >
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    margin: Spacing.lg,
    maxWidth: 400,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  closeButton: {
    padding: Spacing.xs,
  },
  itemInfo: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
  },
  itemName: {
    ...TextStyles.body.large,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  itemPrice: {
    ...TextStyles.body.medium,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  formSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  dateButtonText: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  dateSeparator: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    marginHorizontal: Spacing.sm,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.md,
  },
  calculationText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
  },
  totalAmount: {
    ...TextStyles.heading.h3,
    color: Colors.primary[500],
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.secondary,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  submitButton: {
    flex: 2,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.neutral[300],
  },
  submitButtonText: {
    ...TextStyles.body.medium,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
});
