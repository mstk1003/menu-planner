import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSession } from "@/hooks/useSession";

type Option = {
  label: string;
  value: string;
};

const FAMILY_COMPOSITION_OPTIONS: Option[] = [
  { label: "一人暮らし", value: "single" },
  { label: "夫婦のみ", value: "couple" },
  { label: "小さな子どもあり", value: "young_children" },
  { label: "中高生あり", value: "teens" },
  { label: "三世代同居", value: "multi_generation" },
];

const HEALTH_PRIORITY_OPTIONS: Option[] = [
  { label: "バランス重視", value: "balanced" },
  { label: "低糖質", value: "low_carb" },
  { label: "高たんぱく", value: "high_protein" },
  { label: "減塩", value: "low_salt" },
  { label: "時短重視", value: "time_saving" },
];

const COOKING_SKILL_OPTIONS: Option[] = [
  { label: "初心者", value: "beginner" },
  { label: "基礎はOK", value: "intermediate" },
  { label: "得意", value: "advanced" },
  { label: "プロ級", value: "expert" },
];

const DELI_USAGE_OPTIONS: Option[] = [
  { label: "ほとんど使わない", value: "rarely" },
  { label: "週1〜2回", value: "weekly" },
  { label: "週3〜4回", value: "frequent" },
  { label: "ほぼ毎日", value: "daily" },
];

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { session, isSessionLoading } = useSession();

  const [familyComposition, setFamilyComposition] = useState<string | null>(
    null
  );
  const [healthPriority, setHealthPriority] = useState<string | null>(null);
  const [cookingSkill, setCookingSkill] = useState<string | null>(null);
  const [deliUsage, setDeliUsage] = useState<string | null>(null);
  const [allergies, setAllergies] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.replace("/sign-in");
    }
  }, [isSessionLoading, router, session]);

  const handleSave = () => {
    // TODO: Persist profile settings to Supabase.
    Alert.alert("保存しました", "プロフィール設定を更新しました。");
  };

  if (isSessionLoading || !session) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>プロフィール設定</Text>

          <Section
            title="家族構成"
            description="献立のボリューム調整に利用します。"
          >
            <OptionGroup
              options={FAMILY_COMPOSITION_OPTIONS}
              selectedValue={familyComposition}
              onSelect={setFamilyComposition}
            />
          </Section>

          <Section
            title="アレルギー・避けたい食材"
            description="コンマ区切りで入力してください。例: 卵, 乳製品"
          >
            <TextInput
              placeholder="アレルギーがあれば入力してください"
              placeholderTextColor="#8A8A8A"
              style={styles.textInput}
              value={allergies}
              onChangeText={setAllergies}
            />
          </Section>

          <Section
            title="健康志向"
            description="献立提案の方針に影響します。"
          >
            <OptionGroup
              options={HEALTH_PRIORITY_OPTIONS}
              selectedValue={healthPriority}
              onSelect={setHealthPriority}
            />
          </Section>

          <Section title="料理スキル" description="手順の難易度を調整します。">
            <OptionGroup
              options={COOKING_SKILL_OPTIONS}
              selectedValue={cookingSkill}
              onSelect={setCookingSkill}
            />
          </Section>

          <Section
            title="お惣菜・中食の活用度"
            description="市販惣菜をどの程度提案に取り入れるかを設定します。"
          >
            <OptionGroup
              options={DELI_USAGE_OPTIONS}
              selectedValue={deliUsage}
              onSelect={setDeliUsage}
            />
          </Section>

          <Section
            title="その他メモ"
            description="家族の好みや避けたい調理法などがあれば入力してください。"
          >
            <TextInput
              placeholder="メモがあれば入力してください"
              placeholderTextColor="#8A8A8A"
              style={[styles.textInput, styles.textArea]}
              value={memo}
              onChangeText={setMemo}
              multiline
              textAlignVertical="top"
            />
          </Section>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="プロフィール設定を保存する"
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.saveButtonPressed,
            ]}
          >
            <Text style={styles.saveButtonText}>保存する</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {description ? (
        <Text style={styles.sectionDescription}>{description}</Text>
      ) : null}
      {children}
    </View>
  );
}

function OptionGroup({
  options,
  selectedValue,
  onSelect,
}: {
  options: Option[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.optionGroup}>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 24,
  },
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
  textInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#222222",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    minHeight: 120,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  saveButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonPressed: {
    backgroundColor: "#0B5ED7",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
