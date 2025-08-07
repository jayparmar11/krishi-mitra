import { Container } from "@/components/container";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

function Layout() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      router.replace("/(tabs)");
    }
  }, [session?.user]);

  return (
    <Container>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </Container>
  );
}

export default Layout;
