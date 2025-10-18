import { Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

export type OptionGroupOption = {
  label: string;
  value: string;
};

type OptionGroupProps = {
  options: OptionGroupOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function OptionGroup({
  options,
  selectedValue,
  onSelect,
  containerStyle,
}: OptionGroupProps) {
  return (
    <View style={[styles.optionGroup, containerStyle]}>
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={({ pressed }) => [
              styles.optionPill,
              isSelected && styles.optionPillSelected,
              pressed && styles.optionPillPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${option.label}を選択する`}
          >
            <Text
              style={[
                styles.optionPillText,
                isSelected && styles.optionPillTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  optionPill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  optionPillSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#E6F0FF",
  },
  optionPillPressed: {
    opacity: 0.8,
  },
  optionPillText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  optionPillTextSelected: {
    color: "#0053A4",
    fontWeight: "700",
  },
});
