import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IndexScreen() {
  const router = useRouter();
  const { session, isSessionLoading } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.replace("/sign-in");
    }
  }, [isSessionLoading, router, session]);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("サインアウトに失敗しました", error.message);
      return;
    }
    setIsMenuOpen(false);
  };

  if (isSessionLoading || !session) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.menuWrapper}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="ユーザーメニューを開く"
            hitSlop={8}
            onPress={handleToggleMenu}
            style={styles.userButton}
          >
            <Feather name="user" size={20} color="#222222" />
          </Pressable>
          {isMenuOpen ? (
            <View style={styles.menuContainer}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="サインアウトする"
                onPress={handleSignOut}
                style={styles.menuButton}
              >
                <Text style={styles.menuText}>Sign out</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.greeting}>こんにちは</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: "flex-end",
  },
  menuWrapper: {
    position: "relative",
  },
  userButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  menuContainer: {
    position: "absolute",
    top: 48,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  menuButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D22B2B",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222222",
  },
});
