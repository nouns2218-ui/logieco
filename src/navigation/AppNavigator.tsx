import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import ArchivesScreen from '../screens/ArchivesScreen'
import BonsDeCommandeScreen from '../screens/BonsDeCommandeScreen'
import StocksScreen from '../screens/StocksScreen'
import FournisseursScreen from '../screens/FournisseursScreen'

const Tab = createBottomTabNavigator()

const TEAL = '#1D9E75'
const GRAY = '#888780'

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0 },
          headerTitleStyle: { fontWeight: '500', fontSize: 17 },
          tabBarActiveTintColor: TEAL,
          tabBarInactiveTintColor: GRAY,
          tabBarStyle: { borderTopWidth: 0.5, borderTopColor: '#e0e0dc' },
          tabBarLabelStyle: { fontSize: 11 },
          tabBarIcon: ({ color, size }) => {
            const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
              Archives:       'archive-outline',
              Commandes:      'document-text-outline',
              Stocks:         'cube-outline',
              Fournisseurs:   'storefront-outline',
            }
            return <Ionicons name={icons[route.name] ?? 'ellipse-outline'} size={size} color={color} />
          },
        })}
      >
        <Tab.Screen
          name="Archives"
          component={ArchivesScreen}
          options={{ title: 'Archives' }}
        />
        <Tab.Screen
          name="Commandes"
          component={BonsDeCommandeScreen}
          options={{ title: 'Commandes' }}
        />
        <Tab.Screen
          name="Stocks"
          component={StocksScreen}
          options={{ title: 'Stocks' }}
        />
        <Tab.Screen
          name="Fournisseurs"
          component={FournisseursScreen}
          options={{ title: 'Fournisseurs' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
