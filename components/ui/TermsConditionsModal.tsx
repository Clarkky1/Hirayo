import { Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface TermsConditionsModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export function TermsConditionsModal({ visible, onClose, onAccept }: TermsConditionsModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                        <Ionicons name="close" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Terms and Conditions</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <Text style={styles.lastUpdated}>Last updated: August 2025</Text>
                        
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                            <Text style={styles.paragraph}>
                                By accessing and using the Hirayo rental platform, you accept and agree to be bound by the terms and provision of this agreement.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>2. Description of Service</Text>
                            <Text style={styles.paragraph}>
                                Hirayo is a peer-to-peer rental platform that connects item owners (lenders) with individuals seeking to rent items (renters). Our service facilitates the rental process but is not a party to any rental agreement.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
                            <Text style={styles.paragraph}>
                                Users are responsible for providing accurate information, maintaining the security of their accounts, and complying with all applicable laws and regulations.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>4. Rental Agreements</Text>
                            <Text style={styles.paragraph}>
                                All rental agreements are between the lender and renter. Hirayo is not responsible for the terms, conditions, or fulfillment of these agreements.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>5. Payment and Fees</Text>
                            <Text style={styles.paragraph}>
                                Users agree to pay all applicable fees for the service. Payment processing is handled by third-party providers and subject to their terms.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>6. Prohibited Activities</Text>
                            <Text style={styles.paragraph}>
                                Users may not use the service for illegal purposes, violate intellectual property rights, or engage in fraudulent activities.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
                            <Text style={styles.paragraph}>
                                Hirayo shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>8. Privacy Policy</Text>
                            <Text style={styles.paragraph}>
                                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>9. Modifications to Terms</Text>
                            <Text style={styles.paragraph}>
                                We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>10. Contact Information</Text>
                            <Text style={styles.paragraph}>
                                If you have any questions about these Terms and Conditions, please contact us at support@hirayo.com
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.declineButton} onPress={onClose} activeOpacity={0.7}>
                        <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acceptButton} onPress={onAccept} activeOpacity={0.7}>
                        <Text style={styles.acceptButtonText}>Accept & Continue</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.light,
    },
    closeButton: {
        padding: Spacing.xs,
    },
    headerTitle: {
        ...TextStyles.heading.h2,
        color: Colors.text.primary,
        fontWeight: '600',
    },
    placeholder: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: Spacing.lg,
    },
    lastUpdated: {
        ...TextStyles.caption,
        color: Colors.text.tertiary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...TextStyles.heading.h3,
        color: Colors.text.primary,
        fontWeight: '600',
        marginBottom: Spacing.sm,
    },
    paragraph: {
        ...TextStyles.body.medium,
        color: Colors.text.secondary,
        lineHeight: 24,
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border.light,
        gap: Spacing.md,
    },
    declineButton: {
        flex: 1,
        backgroundColor: Colors.background.secondary,
        borderRadius: 8,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    declineButtonText: {
        ...TextStyles.body.medium,
        color: Colors.text.secondary,
        fontWeight: '600',
    },
    acceptButton: {
        flex: 1,
        backgroundColor: Colors.primary[500],
        borderRadius: 8,
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    acceptButtonText: {
        ...TextStyles.body.medium,
        color: Colors.text.inverse,
        fontWeight: '600',
    },
});
