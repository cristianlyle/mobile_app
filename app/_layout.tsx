import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

    <StatusBar barStyle="light-content" />
   
    <Stack>
      <Stack.Screen name="(tabs)" options={{
        headerShown: false,
      }} />
     
           <Stack.Screen name="+not-found" options={{}} />

      </Stack>
      </GestureHandlerRootView>
  );
}