import { Container } from "@/components/container";
import { Stack } from "expo-router";

function Layout() {
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
