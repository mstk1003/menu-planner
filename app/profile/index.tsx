import FormTextInput from "@/components/FormTextInput";
import OptionGroup, { type OptionGroupOption } from "@/components/OptionGroup";
import PrimaryButton from "@/components/PrimaryButton";
import Section from "@/components/Section";
import TextArea from "@/components/TextArea";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const FAMILY_COMPOSITION_OPTIONS: OptionGroupOption[] = [
  { label: "一人暮らし", value: "single" },
  { label: "夫婦のみ", value: "couple" },
  { label: "小さな子どもあり", value: "young_children" },
  { label: "中高生あり", value: "teens" },
  { label: "三世代同居", value: "multi_generation" },
];

const HEALTH_PRIORITY_OPTIONS: OptionGroupOption[] = [
  { label: "バランス重視", value: "balanced" },
  { label: "低糖質", value: "low_carb" },
  { label: "高たんぱく", value: "high_protein" },
  { label: "減塩", value: "low_salt" },
  { label: "時短重視", value: "time_saving" },
];

const COOKING_SKILL_OPTIONS: OptionGroupOption[] = [
  { label: "初心者", value: "beginner" },
  { label: "基礎はOK", value: "intermediate" },
  { label: "得意", value: "advanced" },
  { label: "プロ級", value: "expert" },
];

const DELI_USAGE_OPTIONS: OptionGroupOption[] = [
  { label: "ほとんど使わない", value: "rarely" },
  { label: "週1〜2回", value: "weekly" },
  { label: "週3〜4回", value: "frequent" },
  { label: "ほぼ毎日", value: "daily" },
];

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { session, isSessionLoading } = useSession();
  const insets = useSafeAreaInsets();

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
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 120 + insets.bottom },
          ]}
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
            <FormTextInput
              placeholder="アレルギーがあれば入力してください"
              value={allergies}
              onChangeText={setAllergies}
            />
          </Section>

          <Section title="健康志向" description="献立提案の方針に影響します。">
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
            <TextArea
              placeholder="メモがあれば入力してください"
              style={styles.textArea}
              value={memo}
              onChangeText={setMemo}
            />
          </Section>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
          <PrimaryButton
            accessibilityLabel="プロフィール設定を保存する"
            label="保存する"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      </View>
    </SafeAreaView>
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
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 24,
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
    width: "100%",
  },
});
