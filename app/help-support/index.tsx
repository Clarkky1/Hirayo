import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    LogBox,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

LogBox.ignoreAllLogs(true);


export default function HelpSupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqItems = [
    {
      id: '1',
      question: 'How do I rent an item?',
      answer: 'Browse available items, select your desired rental period, and complete the payment process. You\'ll receive confirmation and pickup details.',
    },
    {
      id: '2',
      question: 'What happens if I damage an item?',
      answer: 'Report any damage immediately. Depending on the severity, you may be charged a repair fee or replacement cost as outlined in our rental agreement.',
    },
    {
      id: '3',
      question: 'Can I extend my rental period?',
      answer: 'Yes, you can extend your rental period through the app before the due date, subject to availability and additional charges.',
    },
    {
      id: '4',
      question: 'How do I cancel a rental?',
      answer: 'Cancellations can be made up to 24 hours before pickup. Late cancellations may incur a fee.',
    },
    {
      id: '5',
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, GCash, PayMaya, and other major digital wallets.',
    },
  ];


  const handleFaqToggle = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqItems.map((faq, index) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqItem}
              onPress={() => handleFaqToggle(faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedFaq === faq.id ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#666666"
                />
              </View>
              {expandedFaq === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.infoSection}>
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle" size={24} color="#0066CC" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Contact Information</Text>
            <Text style={styles.infoText}>
              Business Hours: Monday - Friday, 9:00 AM - 6:00 PM{'\n'}
              Emergency Support: Available 24/7{'\n'}
              Response Time: Within 2 hours during business hours
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  faqItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
    lineHeight: 20,
    paddingRight: 16,
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
