import { Link, useRouter } from "expo-router";
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

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSignInDisabled = useMemo(() => {
    return !email.trim() || password.length < MIN_PASSWORD_LENGTH || isLoading;
  }, [email, isLoading, password.length]);

  const handleSignIn = async () => {
    if (isSignInDisabled) {
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
              placeholder="パスワードを入力してください"
              secureTextEntry
              textContentType="password"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <PrimaryButton
            accessibilityLabel="ログイン"
            disabled={isSignInDisabled}
            isLoading={isLoading}
            label="ログインする"
            onPress={handleSignIn}
            style={styles.submitButton}
          />

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
  errorText: {
    marginBottom: 16,
    fontSize: 14,
    color: "#C62828",
  },
  submitButton: {
    marginTop: 8,
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
