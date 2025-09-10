import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    LogBox,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

LogBox.ignoreAllLogs(true);


export default function VideoCallScreen() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'poor' | 'failed'>('connecting');
  const [showFallbackOptions, setShowFallbackOptions] = useState(false);

  // Simulate connection status changes
  useEffect(() => {
    const connectionTimer = setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);

    const poorConnectionTimer = setTimeout(() => {
      setConnectionStatus('poor');
      setShowFallbackOptions(true);
    }, 10000);

    return () => {
      clearTimeout(connectionTimer);
      clearTimeout(poorConnectionTimer);
    };
  }, []);

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end the call?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Call', 
          style: 'destructive',
          onPress: () => {
            setIsCallActive(false);
            // Navigate back to item detail
            router.back();
          }
        }
      ]
    );
  };

  const handleGrantPermission = () => {
    Alert.alert(
      'Grant Rental Permission',
      'Are you sure you want to allow this renter to proceed with the rental?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Grant Permission', 
          style: 'default',
          onPress: () => {
            Alert.alert(
              'Permission Granted',
              'The renter has been notified and can now proceed with the rental process.',
              [
                { 
                  text: 'OK', 
                  style: 'default',
                  onPress: () => {
                    // Navigate back to item detail
                    router.back();
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleRetryCall = () => {
    setConnectionStatus('connecting');
    setShowFallbackOptions(false);
    // Simulate reconnection
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
  };

  const handleSwitchToMessage = () => {
    Alert.alert(
      'Switch to Message',
      'Would you like to continue the conversation via text message instead?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Switch to Message', 
          style: 'default',
          onPress: () => {
            router.push('/lender-messages');
          }
        }
      ]
    );
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Connected';
      case 'poor':
        return 'Poor Connection';
      case 'failed':
        return 'Connection Failed';
      default:
        return 'Unknown';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connecting':
        return Colors.warning;
      case 'connected':
        return Colors.success;
      case 'poor':
        return Colors.warning;
      case 'failed':
        return Colors.error;
      default:
        return Colors.neutral[500];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Call Interface */}
      <View style={styles.videoContainer}>
        {/* Connection Status */}
        <View style={styles.connectionStatus}>
          <View style={[styles.statusIndicator, { backgroundColor: getConnectionStatusColor() }]} />
          <Text style={[styles.statusText, { color: getConnectionStatusColor() }]}>
            {getConnectionStatusText()}
          </Text>
        </View>

        {/* Main Video Area */}
        <View style={styles.mainVideo}>
          <View style={styles.videoPlaceholder}>
            <Ionicons name="videocam" size={64} color={Colors.neutral[400]} />
            <Text style={styles.videoPlaceholderText}>Video Call Active</Text>
            <Text style={styles.callDurationText}>
              {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </View>

        {/* Fallback Options for Poor Connection */}
        {showFallbackOptions && (
          <View style={styles.fallbackBanner}>
            <Ionicons name="warning-outline" size={20} color={Colors.warning} />
            <Text style={styles.fallbackText}>
              Poor connection detected. Try these alternatives:
            </Text>
            <View style={styles.fallbackActions}>
              <TouchableOpacity 
                style={styles.fallbackButton} 
                onPress={handleRetryCall}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh" size={16} color={Colors.primary[500]} />
                <Text style={styles.fallbackButtonText}>Retry Call</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.fallbackButton} 
                onPress={handleSwitchToMessage}
                activeOpacity={0.7}
              >
                <Ionicons name="chatbubble-outline" size={16} color={Colors.primary[500]} />
                <Text style={styles.fallbackButtonText}>Switch to Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Call Controls */}
        <View style={styles.callControls}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => setIsCallActive(!isCallActive)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isCallActive ? "mic" : "mic-off"} 
              size={24} 
              color={Colors.text.inverse} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="videocam" 
              size={24} 
              color={Colors.text.inverse} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="swap-horizontal" 
              size={24} 
              color={Colors.text.inverse} 
            />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.grantPermissionButton} 
            onPress={handleGrantPermission}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.grantPermissionText}>Grant Permission</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.endCallButton} 
            onPress={handleEndCall}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={24} color={Colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mainVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginTop: Spacing.md,
  },
  callDurationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: Spacing.sm,
  },
  fallbackBanner: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  fallbackText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  fallbackActions: {
    flexDirection: 'row',
    marginLeft: Spacing.md,
  },
  fallbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginLeft: Spacing.sm,
  },
  fallbackButtonText: {
    color: Colors.primary[500],
    fontSize: 14,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  controlButton: {
    backgroundColor: Colors.neutral[600],
    borderRadius: BorderRadius.full,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grantPermissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flex: 1,
    marginRight: Spacing.md,
  },
  grantPermissionText: {
    color: Colors.text.inverse,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  endCallButton: {
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.full,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
