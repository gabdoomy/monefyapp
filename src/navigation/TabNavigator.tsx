import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BalanceTab } from '../components/tabs/BalanceTab';
import { StatisticsTab } from '../components/tabs/StatisticsTab';
import { SettingsTab } from '../components/tabs/SettingsTab';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: colors.paleGreen,
        tabBarInactiveTintColor: theme.secondaryText,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Balance"
        component={BalanceTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}; 