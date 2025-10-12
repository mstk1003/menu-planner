import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";

const MIN_PASSWORD_LENGTH = 8;

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSignUpDisabled = useMemo(() => {
    return !email.trim() || password.length < MIN_PASSWORD_LENGTH || isLoading;
  }, [email, isLoading, password.length]);

  const handleSignUp = useCallback(async () => {
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
  }, [email, isSignUpDisabled, password]);

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
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="sample@example.com"
              placeholderTextColor="#8A8A8A"
              style={styles.input}
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>パスワード</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              placeholder="8文字以上で入力してください"
              placeholderTextColor="#8A8A8A"
              secureTextEntry
              style={styles.input}
              textContentType="password"
              value={password}
              onChangeText={setPassword}
            />
            <Text style={styles.hint}>
              英数字を組み合わせた{MIN_PASSWORD_LENGTH}文字以上のパスワードを設定してください。
            </Text>
          </View>

          {errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          {successMessage && (
            <Text style={styles.successText}>{successMessage}</Text>
          )}

          <Pressable
            accessibilityLabel="サインアップ"
            accessibilityRole="button"
            disabled={isSignUpDisabled}
            onPress={handleSignUp}
            style={({ pressed }) => [
              styles.submitButton,
              isSignUpDisabled && styles.submitButtonDisabled,
              pressed && !isSignUpDisabled && styles.submitButtonPressed,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>登録する</Text>
            )}
          </Pressable>
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
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#222222",
    backgroundColor: "#FFFFFF",
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
    height: 48,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#A3C1FF",
  },
  submitButtonPressed: {
    backgroundColor: "#0B5ED7",
  },
  submitText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
