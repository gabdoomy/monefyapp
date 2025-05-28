import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';
import styles from './styles/StatisticsTab.styles';

export const StatisticsTab = () => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Statistics</Text>
      
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Coming Soon
        </Text>
        <Text style={[styles.cardSubtitle, { color: theme.secondaryText }]}>
          Expense tracking and analytics will be available in the next update
        </Text>
      </View>
    </SafeAreaView>
  );
};
