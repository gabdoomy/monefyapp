import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';

interface DebtItem {
  id: string;
  name: string;
  amount: number;
  avatar?: string;
  lastActivity?: string;
}

interface BalanceTabProps {
  navigation: any;
}

const mockData: DebtItem[] = [
  { 
    id: '1',
    name: 'John Doe',
    amount: -15.75,
    avatar: 'JD',
    lastActivity: '2 days ago'
  },
  { 
    id: '2',
    name: 'Sarah Smith',
    amount: 45.00,
    avatar: 'SS',
    lastActivity: 'Today'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    amount: 25.50,
    avatar: 'MJ',
    lastActivity: 'Yesterday'
  }
];

export const BalanceTab = ({ navigation }: BalanceTabProps) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;
  const totalBalance = mockData.reduce((sum, item) => sum + item.amount, 0);

  const handleItemPress = (item: DebtItem) => {
    navigation.navigate('TransactionDetails', {
      id: item.id,
      name: item.name,
      avatar: item.avatar
    });
  };

  const handleAddExpense = () => {
    navigation.navigate('AddExpense');
  };

  const renderItem = (item: DebtItem) => (
    <TouchableOpacity
      key={item.id}
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
              {item.avatar}
            </Text>
          </View>
          <View style={styles.listItemTextContainer}>
            <Text style={[styles.listItemLabel, { color: theme.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.listItemSubtitle, { color: theme.secondaryText }]}>
              Last activity: {item.lastActivity}
            </Text>
          </View>
        </View>

        <View style={styles.listItemRight}>
          <Text style={[
            styles.listItemAmount,
            { color: item.amount >= 0 ? colors.paleGreen : colors.error }
          ]}>
            {item.amount >= 0 ? `+$${item.amount.toFixed(2)}` : `-$${Math.abs(item.amount).toFixed(2)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Balance</Text>
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
          {totalBalance >= 0 ? `+$${totalBalance.toFixed(2)}` : `-$${Math.abs(totalBalance).toFixed(2)}`}
        </Text>
      </View>

      {mockData.map(renderItem)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  totalCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  listItem: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  listItemLabel: {
    fontSize: 17,
    fontWeight: '500',
  },
  listItemSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  listItemRight: {
    marginLeft: 12,
  },
  listItemAmount: {
    fontSize: 17,
    fontWeight: '600',
  },
}); 