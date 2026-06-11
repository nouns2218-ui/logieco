import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "../src/navigation/AppNavigator";

export default function Layout() {
  return (
    <NavigationContainer independent={true}>
      <AppNavigator />
    </NavigationContainer>
  );
}
