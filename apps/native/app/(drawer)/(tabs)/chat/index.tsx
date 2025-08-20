import { Redirect } from 'expo-router';

export default function ChatIndex() {
  // Redirect to new chat by default
  return <Redirect href="/chat/new" />;
}
