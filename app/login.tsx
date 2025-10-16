import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
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

import { MIN_PASSWORD_LENGTH } from "@/constants/auth";
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoginDisabled = useMemo(() => {
    return !email.trim() || password.length < MIN_PASSWORD_LENGTH || isLoading;
  }, [email, isLoading, password.length]);

  const handleLogin = async () => {
    if (isLoginDisabled) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message ?? "ログインに失敗しました。");
        return;
      }
      console.log("sesstion", data.session);

      router.replace("/");
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
          <Text style={styles.title}>ログイン</Text>

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
              placeholder="パスワードを入力してください"
              placeholderTextColor="#8A8A8A"
              secureTextEntry
              style={styles.input}
              textContentType="password"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <Pressable
            accessibilityLabel="ログイン"
            accessibilityRole="button"
            disabled={isLoginDisabled}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.submitButton,
              isLoginDisabled && styles.submitButtonDisabled,
              pressed && !isLoginDisabled && styles.submitButtonPressed,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>ログインする</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>アカウントをお持ちでない場合</Text>
            <Link href="/sign-up" style={styles.footerLink} role="link">
              新規登録はこちら
            </Link>
          </View>
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
  errorText: {
    marginBottom: 16,
    fontSize: 14,
    color: "#C62828",
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
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 8,
  },
  footerLink: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
