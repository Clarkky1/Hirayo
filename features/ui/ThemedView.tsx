import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View, ViewProps } from 'react-native';

export function ThemedView(props: ViewProps) {
  const colorScheme = useColorScheme();
  const { style, ...otherProps } = props;

  return (
    <View
      style={[
        {
          backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
