import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) {
    throw new Error(errorCode);
  }
  const { access_token, refresh_token } = params;
  if (!access_token) return;
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) {
    throw error;
  }
  return data.session;
};

export default function AuthCallbackScreen() {
  const router = useRouter();
  // supabase公式ドキュメントから
  const url = Linking.useLinkingURL();
  if (url) {
    createSessionFromUrl(url);
  }

  const handleOpenLogin = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <Text style={[styles.title, styles.successText]}>
          メールアドレスを確認しました
        </Text>
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>
            続けてログインしてプロフィール設定を進めましょう。
          </Text>
        </View>
        <Pressable
          accessibilityLabel="ログイン画面を開く"
          accessibilityRole="button"
          onPress={handleOpenLogin}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Text style={styles.actionButtonText}>ログイン画面を開く</Text>
        </Pressable>
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
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#222222",
  },
  feedbackContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  feedbackText: {
    fontSize: 16,
    color: "#555555",
    textAlign: "center",
    lineHeight: 22,
  },
  successText: {
    color: "#2E7D32",
  },
  errorText: {
    color: "#C62828",
  },
  actionButton: {
    borderRadius: 8,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    alignItems: "center",
  },
  actionButtonPressed: {
    backgroundColor: "#0B5ED7",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
