import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FormTextInput from "@/components/FormTextInput";
import PrimaryButton from "@/components/PrimaryButton";
import { MIN_PASSWORD_LENGTH } from "@/constants/auth";
import { supabase } from "@/lib/supabase";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSignUpDisabled = useMemo(() => {
    return !email.trim() || password.length < MIN_PASSWORD_LENGTH || isLoading;
  }, [email, isLoading, password.length]);

  const handleSignUp = async () => {
    if (isSignUpDisabled) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: "menuplanner://auth/callback",
        },
      });

      if (error) {
        setErrorMessage(error.message ?? "サインアップに失敗しました。");
        return;
      }

      setSuccessMessage(
        "確認メールを送信しました。メールに記載された手順に従ってサインアップを完了してください。"
      );
      setPassword("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "予期せぬエラーが発生しました。時間を置いて再度お試しください。";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>新規登録</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>メールアドレス</Text>
            <FormTextInput
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="sample@example.com"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>パスワード</Text>
            <FormTextInput
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              placeholder="8文字以上で入力してください"
              secureTextEntry
              textContentType="password"
              value={password}
              onChangeText={setPassword}
            />
            <Text style={styles.hint}>
              英数字を組み合わせた{MIN_PASSWORD_LENGTH}
              文字以上のパスワードを設定してください。
            </Text>
          </View>

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          {successMessage && (
            <Text style={styles.successText}>{successMessage}</Text>
          )}

          <PrimaryButton
            accessibilityLabel="サインアップ"
            disabled={isSignUpDisabled}
            isLoading={isLoading}
            label="登録する"
            onPress={handleSignUp}
            style={styles.submitButton}
          />
        </View>
      </KeyboardAvoidingView>
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
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 32,
    color: "#222222",
  },
  fieldGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555555",
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: "#777777",
  },
  errorText: {
    marginBottom: 16,
    fontSize: 14,
    color: "#C62828",
  },
  successText: {
    marginBottom: 16,
    fontSize: 14,
    color: "#2E7D32",
  },
  submitButton: {
    marginTop: 8,
  },
});
