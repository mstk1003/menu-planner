import { Stack } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { SessionProvider } from "@/hooks/useSession";

export default function RootLayout() {
  return (
    <SessionProvider>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={24}
        keyboardShouldPersistTaps="handled"
      >
        <Stack screenOptions={{ contentStyle: { flex: 1 } }} />
      </KeyboardAwareScrollView>
    </SessionProvider>
  );
}
