import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useSession } from "@/hooks/useSession";

export default function IndexScreen() {
  const router = useRouter();
  const { session, isSessionLoading } = useSession();

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.replace("/login");
    }
  }, [isSessionLoading, router, session]);

  if (isSessionLoading || !session) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>こんにちは</Text>
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
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222222",
  },
});
