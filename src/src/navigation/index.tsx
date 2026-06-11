import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import DashboardScreen from "../screens/DashboardScreen";
import ArchivesScreen from "../screens/ArchivesScreen";
import StocksScreen from "../screens/StocksScreen";
import CommandesScreen from "../screens/CommandesScreen";
import FournisseursScreen from "../screens/FournisseursScreen";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: "#1A3A5C" }}>
        <Tab.Screen name="Tableau de bord" component={DashboardScreen} />
        <Tab.Screen name="Archives" component={ArchivesScreen} />
        <Tab.Screen name="Stocks" component={StocksScreen} />
        <Tab.Screen name="Commandes" component={CommandesScreen} />
        <Tab.Screen name="Fournisseurs" component={FournisseursScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
