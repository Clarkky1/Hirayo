import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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
}

export default function RentalPeriodScreen() {
  const [currentMonth] = useState('August 2025');
  const [selectedStartDate] = useState(14);
  const [selectedEndDate] = useState(17);

  const handlePreviousMonth = () => {
    console.log('Previous month');
  };

  const handleNextMonth = () => {
    console.log('Next month');
  };

  const handleDatePress = (day: number) => {
    console.log('Date pressed:', day);
  };

  const handleContinue = () => {
    router.push('/review-order');
  };

  // Generate calendar data for August 2025
  const generateCalendarDays = (): DateItem[] => {
    const days: DateItem[] = [];
    
    // Previous month days (July)
    days.push({ day: 29, isCurrentMonth: false, isSelected: false, isInRange: false });
    days.push({ day: 30, isCurrentMonth: false, isSelected: false, isInRange: false });
    days.push({ day: 31, isCurrentMonth: false, isSelected: false, isInRange: false });
    
    // Current month days (August)
    for (let day = 1; day <= 31; day++) {
      const isSelected = day >= selectedStartDate && day <= selectedEndDate;
      const isInRange = day > selectedStartDate && day < selectedEndDate;
      days.push({ 
        day, 
        isCurrentMonth: true, 
        isSelected, 
        isInRange 
      });
    }
    
    // Next month day (September)
    days.push({ day: 1, isCurrentMonth: false, isSelected: false, isInRange: false });
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <SafeAreaView style={styles.container}>

      {/* Calendar Container */}
      <View style={styles.calendarContainer}>
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={handlePreviousMonth}>
            <Ionicons name="chevron-back" size={20} color="#666" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{currentMonth}</Text>
          <TouchableOpacity style={styles.navButton} onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" size={20} color="#666" />
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
              style={[
                styles.dateCell,
                !dateItem.isCurrentMonth && styles.otherMonthDate,
                dateItem.isSelected && styles.selectedDate,
                dateItem.isInRange && styles.rangeDate,
              ]}
              onPress={() => dateItem.isCurrentMonth && handleDatePress(dateItem.day)}
              disabled={!dateItem.isCurrentMonth}
            >
              <Text
                style={[
                  styles.dateText,
                  !dateItem.isCurrentMonth && styles.otherMonthText,
                  dateItem.isSelected && styles.selectedDateText,
                ]}
              >
                {dateItem.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
    ...Shadows.sm,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: '14.28%', // 7 columns
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minWidth: 60,
    ...Shadows.xs,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  otherMonthDate: {
    // No special styling needed for other month dates
  },
  otherMonthText: {
    color: '#CCCCCC',
  },
  selectedDate: {
    backgroundColor: '#00A86B',
    borderRadius: 20,
  },
  selectedDateText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  rangeDate: {
    backgroundColor: '#E8F5E8',
    borderRadius: 0,
  },
  continueButton: {
    backgroundColor: '#0066CC',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    ...Shadows.button,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
