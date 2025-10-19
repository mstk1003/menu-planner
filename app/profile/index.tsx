import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import FormTextInput from "@/components/FormTextInput";
import OptionGroup from "@/components/OptionGroup";
import PrimaryButton from "@/components/PrimaryButton";
import Section from "@/components/Section";
import TextArea from "@/components/TextArea";
import {
  COOKING_SKILL_OPTIONS,
  DELI_USAGE_OPTIONS,
  FAMILY_COMPOSITION_OPTIONS,
  HEALTH_PRIORITY_OPTIONS,
} from "@/features/profile/constants";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";

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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.replace("/sign-in");
    }
  }, [isSessionLoading, router, session]);

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    if (!session?.user) {
      Alert.alert(
        "保存に失敗しました",
        "ログイン情報を確認できませんでした。再度ログインしてください。"
      );
      return;
    }

    setIsSaving(true);

    try {
      const trimmedAllergies = allergies.trim();
      const trimmedMemo = memo.trim();

      const { error } = await supabase.from("profiles").upsert(
        {
          id: session.user.id,
          family_composition: familyComposition,
          allergies: trimmedAllergies ? trimmedAllergies : null,
          health_priority: healthPriority,
          cooking_skill: cookingSkill,
          deli_usage: deliUsage,
          memo: trimmedMemo ? trimmedMemo : null,
        },
        { onConflict: "id" }
      );

      if (error) {
        throw error;
      }

      Alert.alert("保存しました", "プロフィール設定を更新しました。");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "予期せぬエラーが発生しました。時間を置いて再度お試しください。";
      Alert.alert("保存に失敗しました", message);
    } finally {
      setIsSaving(false);
    }
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
            isLoading={isSaving}
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
