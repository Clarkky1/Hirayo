import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.light.gray[200], Colors.light.gray[300]],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

// Skeleton components for specific use cases
export const ItemCardSkeleton: React.FC = () => (
  <View style={styles.itemCardSkeleton}>
    <SkeletonLoader width="100%" height={200} borderRadius={12} />
    <View style={styles.itemCardContent}>
      <SkeletonLoader width="80%" height={16} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="60%" height={14} style={{ marginBottom: 8 }} />
      <View style={styles.itemCardFooter}>
        <SkeletonLoader width="40%" height={16} />
        <SkeletonLoader width="30%" height={14} />
      </View>
    </View>
  </View>
);

export const TransactionSkeleton: React.FC = () => (
  <View style={styles.transactionSkeleton}>
    <View style={styles.transactionHeader}>
      <SkeletonLoader width={50} height={50} borderRadius={25} />
      <View style={styles.transactionInfo}>
        <SkeletonLoader width="70%" height={16} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="50%" height={14} />
      </View>
    </View>
    <SkeletonLoader width="25%" height={16} />
  </View>
);

export const MessageSkeleton: React.FC = () => (
  <View style={styles.messageSkeleton}>
    <View style={styles.messageHeader}>
      <SkeletonLoader width={40} height={40} borderRadius={20} />
      <View style={styles.messageInfo}>
        <SkeletonLoader width="60%" height={16} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="40%" height={14} />
      </View>
    </View>
    <SkeletonLoader width="20%" height={12} />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  itemCardSkeleton: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  itemCardContent: {
    padding: 12,
  },
  itemCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  messageSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray[200],
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  messageInfo: {
    marginLeft: 12,
    flex: 1,
  },
});

export default SkeletonLoader;
