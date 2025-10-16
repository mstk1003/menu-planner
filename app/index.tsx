import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>献立提案アプリへようこそ！</Text>
        <Text style={styles.subtitle}>
          まずはサインアップしてアカウントを作成しましょう。
        </Text>
        <Link href="/sign-up" style={styles.link} role="button">
          サインアップ画面へ進む
        </Link>
        <Link href="/login" style={styles.secondaryLink} role="button">
          ログイン画面へ進む
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
  },
  content: {
    width: "100%",
    maxWidth: 320,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#222222",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: "#555555",
  },
  link: {
    backgroundColor: "#007AFF",
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  secondaryLink: {
    marginTop: 16,
    color: "#007AFF",
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
});
