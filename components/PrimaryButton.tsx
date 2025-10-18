import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function PrimaryButton({
  label,
  onPress,
  accessibilityLabel,
  disabled = false,
  isLoading = false,
  style,
  textStyle,
}: PrimaryButtonProps) {
  const isButtonDisabled = disabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={isButtonDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isButtonDisabled && styles.buttonDisabled,
        pressed && !isButtonDisabled && styles.buttonPressed,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.label, textStyle]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: "#0B5ED7",
  },
  buttonDisabled: {
    backgroundColor: "#A3C1FF",
  },
  label: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
