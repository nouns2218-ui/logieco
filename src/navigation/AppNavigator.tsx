import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import DashboardScreen from "../screens/DashboardScreen";
import ArchivesScreen from "../screens/ArchivesScreen";
import BonsDeCommandeScreen from "../screens/BonsDeCommandeScreen";
import StocksScreen from "../screens/StocksScreen";
import FournisseursScreen from "../screens/FournisseursScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#fff", elevation: 0, shadowOpacity: 0 },
        headerTitleStyle: { fontWeight: "500", fontSize: 17 },
        tabBarActiveTintColor: "#1D9E75",
        tabBarInactiveTintColor: "#888780",
        tabBarStyle: { borderTopWidth: 0.5, borderTopColor: "#e0e0dc" },
        tabBarLabelStyle: { fontSize: 11 },
        tabBarIcon: ({ color, size }) => {
          const icons = { Dashboard: "home-outline", Archives: "archive-outline", Commandes: "document-text-outline", Stocks: "cube-outline", Fournisseurs: "storefront-outline" };
          return <Ionicons name={icons[route.name] ?? "ellipse-outline"} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Accueil" }} />
      <Tab.Screen name="Archives" component={ArchivesScreen} options={{ title: "Archives" }} />
      <Tab.Screen name="Commandes" component={BonsDeCommandeScreen} options={{ title: "Commandes" }} />
      <Tab.Screen name="Stocks" component={StocksScreen} options={{ title: "Stocks" }} />
      <Tab.Screen name="Fournisseurs" component={FournisseursScreen} options={{ title: "Fournisseurs" }} />
    </Tab.Navigator>
  );
}
