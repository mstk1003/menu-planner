import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

type SectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function Section({
  title,
  description,
  children,
  containerStyle,
}: SectionProps) {
  return (
    <View style={[styles.section, containerStyle]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {description ? (
        <Text style={styles.sectionDescription}>{description}</Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 12,
  },
});
