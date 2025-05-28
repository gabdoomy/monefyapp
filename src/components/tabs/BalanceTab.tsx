import React, { useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';
import styles from './styles/BalanceTab.styles';
import { useDataContext } from '../../context/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const API_HOSTNAME = 'https://monefy-server.vercel.app';

interface DebtItem {
  user: string;
  amount: number;
  id: string;
  email: string;
  name: string;
  lastLogged: number;
  phoneNumber: string;
}

interface BalanceTabProps {
  navigation: any;
}

export const BalanceTab = ({ navigation }: BalanceTabProps) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;
  const [balanceData, setBalanceData] = React.useState<DebtItem[]>([]);
  const { userId } = useDataContext();

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${API_HOSTNAME}/api/getBalance?id=${userId}`);
      const data = await response.json();
      setBalanceData(data.balance);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const totalBalance = balanceData.reduce((sum, item) => sum + item.amount, 0);

  const handleItemPress = (item: DebtItem) => {
    navigation.navigate('TransactionDetails', {
      id: item.user,
      name: item.name,
      avatar: item.name.substring(0, 2).toUpperCase()
    });
  };

  const handleAddExpense = () => {
    navigation.navigate('AddExpense');
  };

  const renderItem = (item: DebtItem) => (
    <TouchableOpacity
      key={item.user}
      style={[
        styles.listItem,
        { backgroundColor: theme.surface }
      ]}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.listItemContent}>
        <View style={styles.listItemLeft}>
          <View style={[styles.avatar, { backgroundColor: colors.paleGreen }]}>
            <Text style={{ color: isDark ? theme.surface : colors.light.surface }}>
              {item.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.listItemTextContainer}>
            <Text style={[styles.listItemLabel, { color: theme.text }]}>
              {item.name}
            </Text>
          </View>
        </View>

        <View style={styles.listItemRight}>
          <Text style={[
            styles.listItemAmount,
            { color: item.amount >= 0 ? colors.paleGreen : colors.error }
          ]}>
            {item.amount >= 0 ? `+£${item.amount.toFixed(2)}` : `-£${Math.abs(item.amount).toFixed(2)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Monefy</Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Your Finances, Simplified</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddExpense}
          >
            <Icon name="add-circle" size={24} color={colors.paleGreen} />
          </TouchableOpacity>
        </View>

        <View style={[styles.totalCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.totalLabel, { color: theme.secondaryText }]}>
            Total Balance
          </Text>
          <Text style={[
            styles.totalAmount,
            { color: totalBalance >= 0 ? colors.paleGreen : colors.error }
          ]}>
            {totalBalance >= 0 ? `+£${totalBalance.toFixed(2)}` : `-£${Math.abs(totalBalance).toFixed(2)}`}
          </Text>
        </View>

        {balanceData
          .filter(item => item.amount !== 0)
          .map(renderItem)}
      </ScrollView>
    </SafeAreaView>
  );
};
