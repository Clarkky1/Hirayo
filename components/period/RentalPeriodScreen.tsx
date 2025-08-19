import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface DateItem {
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isStartDate: boolean;
  isEndDate: boolean;
  isToday: boolean;
  isPast: boolean;
}

export default function RentalPeriodScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [isSelectingStart, setIsSelectingStart] = useState(true);

  const screenWidth = Dimensions.get('window').width;
  const cellSize = (screenWidth - 80) / 7; // 7 columns with padding

  const currentMonth = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const handlePreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleDatePress = (date: Date) => {
    if (date < new Date()) {
      Alert.alert('Invalid Date', 'Cannot select dates in the past');
      return;
    }

    if (isSelectingStart) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      setIsSelectingStart(false);
    } else {
      if (selectedStartDate && date < selectedStartDate) {
        setSelectedStartDate(date);
        setSelectedEndDate(selectedStartDate);
      } else {
        setSelectedEndDate(date);
        setIsSelectingStart(true);
      }
    }
  };

  const handleContinue = () => {
    if (!selectedStartDate || !selectedEndDate) {
      Alert.alert('Selection Required', 'Please select both start and end dates');
      return;
    }
    router.push('/review-order');
  };

  const resetSelection = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setIsSelectingStart(true);
  };

  // Generate calendar data for the current month
  const generateCalendarDays = useMemo((): DateItem[] => {
    const days: DateItem[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate 42 days (6 weeks * 7 days)
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.getTime() === today.getTime();
      const isPast = currentDate < today;
      
      let isSelected = false;
      let isInRange = false;
      let isStartDate = false;
      let isEndDate = false;
      
      if (selectedStartDate && selectedEndDate) {
        const start = new Date(selectedStartDate);
        const end = new Date(selectedEndDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        
        isStartDate = currentDate.getTime() === start.getTime();
        isEndDate = currentDate.getTime() === end.getTime();
        isInRange = currentDate > start && currentDate < end;
        isSelected = isStartDate || isEndDate || isInRange;
      } else if (selectedStartDate) {
        const start = new Date(selectedStartDate);
        start.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        isStartDate = currentDate.getTime() === start.getTime();
        isSelected = isStartDate;
      }
      
      days.push({
        day: currentDate.getDate(),
        isCurrentMonth,
        isSelected,
        isInRange,
        isStartDate,
        isEndDate,
        isToday,
        isPast,
      });
    }
    
    return days;
  }, [currentDate, selectedStartDate, selectedEndDate]);

  const calendarDays = generateCalendarDays;
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getDateCellStyle = (dateItem: DateItem) => {
    if (dateItem.isPast) {
      return [styles.dateCell, styles.pastDate];
    }
    if (dateItem.isStartDate || dateItem.isEndDate) {
      return [styles.dateCell, styles.selectedDate];
    }
    if (dateItem.isInRange) {
      return [styles.dateCell, styles.rangeDate];
    }
    if (dateItem.isToday) {
      return [styles.dateCell, styles.todayDate];
    }
    if (!dateItem.isCurrentMonth) {
      return [styles.dateCell, styles.otherMonthDate];
    }
    return [styles.dateCell];
  };

  const getDateTextStyle = (dateItem: DateItem) => {
    if (dateItem.isPast) {
      return [styles.dateText, styles.pastDateText];
    }
    if (dateItem.isStartDate || dateItem.isEndDate) {
      return [styles.dateText, styles.selectedDateText];
    }
    if (dateItem.isInRange) {
      return [styles.dateText, styles.rangeDateText];
    }
    if (dateItem.isToday) {
      return [styles.dateText, styles.todayDateText];
    }
    if (!dateItem.isCurrentMonth) {
      return [styles.dateText, styles.otherMonthText];
    }
    return [styles.dateText];
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.subtitle}>Choose your start and end dates</Text>
      </View>

      {/* Calendar Container */}
      <View style={styles.calendarContainer}>
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={handlePreviousMonth}>
            <Ionicons name="chevron-back" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.monthText}>{currentMonth}</Text>
          <TouchableOpacity style={styles.navButton} onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Days of Week Header */}
        <View style={styles.weekDaysHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((dateItem, index) => (
            <TouchableOpacity
              key={index}
              style={getDateCellStyle(dateItem)}
              onPress={() => !dateItem.isPast && handleDatePress(new Date(currentDate.getFullYear(), currentDate.getMonth(), dateItem.day))}
              disabled={dateItem.isPast}
            >
              <Text style={getDateTextStyle(dateItem)}>
                {dateItem.day}
              </Text>
              {dateItem.isToday && <View style={styles.todayIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Selection Info */}
        {(selectedStartDate || selectedEndDate) && (
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionLabel}>
              {isSelectingStart ? 'Select end date' : 'Select start date'}
            </Text>
            {selectedStartDate && (
              <Text style={styles.selectedDates}>
                Start: {selectedStartDate.toLocaleDateString()}
                {selectedEndDate && ` • End: ${selectedEndDate.toLocaleDateString()}`}
              </Text>
            )}
            <TouchableOpacity style={styles.resetButton} onPress={resetSelection}>
              <Text style={styles.resetButtonText}>Reset Selection</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Continue Button */}
      <TouchableOpacity 
        style={[
          styles.continueButton,
          (!selectedStartDate || !selectedEndDate) && styles.continueButtonDisabled
        ]} 
        onPress={handleContinue}
        disabled={!selectedStartDate || !selectedEndDate}
      >
        <Text style={styles.continueButtonText}>
          {selectedStartDate && selectedEndDate ? 'Continue' : 'Select Dates'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.text.secondary,
  },
  calendarContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.xl,
    padding: 24,
    marginBottom: 40,
    ...Shadows.lg,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  navButton: {
    padding: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.tertiary,
    marginBottom: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dateCell: {
    width: '13%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    position: 'relative',
    ...Shadows.xs,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  otherMonthDate: {
    backgroundColor: Colors.background.tertiary,
  },
  otherMonthText: {
    color: Colors.text.disabled,
  },
  pastDate: {
    backgroundColor: Colors.background.tertiary,
    opacity: 0.5,
  },
  pastDateText: {
    color: Colors.text.disabled,
  },
  todayDate: {
    backgroundColor: Colors.primary[100],
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  todayDateText: {
    color: Colors.primary[700],
  },
  selectedDate: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
  },
  selectedDateText: {
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  rangeDate: {
    backgroundColor: Colors.primary[100],
    borderRadius: 0,
  },
  rangeDateText: {
    color: Colors.primary[700],
    fontWeight: '600',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary[500],
  },
  selectionInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  selectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  selectedDates: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.text.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.neutral[200],
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  continueButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    ...Shadows.button,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.neutral[300],
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
});
