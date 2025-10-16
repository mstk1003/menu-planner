import { Stack } from "expo-router";

import { SessionProvider } from "@/hooks/useSession";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack />
    </SessionProvider>
  );
}
