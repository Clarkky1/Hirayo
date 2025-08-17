import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, TextProps } from 'react-native';

export function ThemedText(props: TextProps) {
  const colorScheme = useColorScheme();
  const { style, ...otherProps } = props;

  return (
    <Text
      style={[
        {
          color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
