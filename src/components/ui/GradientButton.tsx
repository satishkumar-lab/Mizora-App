import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, type PressableProps } from 'react-native';

import { fonts } from '@/theme/tokens';

type GradientButtonProps = PressableProps & {
  label: string;
};

export function GradientButton({ label, disabled, className = '', ...rest }: GradientButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={`overflow-hidden rounded-full ${className}`}
      style={({ pressed }) => ({
        opacity: disabled ? 0.5 : pressed ? 0.94 : 1,
        shadowColor: '#97EC0D',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
      })}
      {...rest}
    >
      <LinearGradient
        colors={['#D6FF92', '#DDFB43', '#C8F526']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          height: 56,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: '#141c12' }}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}
