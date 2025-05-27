import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'payment' | 'request';
}

interface TransactionDetailsProps {
  route: {
    params: {
      id: string;
      name: string;
      type: 'group' | 'person';
      avatar?: string;
    };
  };
  navigation: any;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 25.50,
    description: 'Lunch at Subway',
    date: '2024-03-15',
    type: 'payment'
  },
  {
    id: '2',
    amount: -15.75,
    description: 'Coffee and snacks',
    date: '2024-03-14',
    type: 'request'
  },
  {
    id: '3',
    amount: 120.00,
    description: 'Movie tickets',
    date: '2024-03-10',
    type: 'payment'
  }
];

export const TransactionDetails = ({ route, navigation }: TransactionDetailsProps) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;
  const { name, type, avatar } = route.params;
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  const handleAddTransaction = () => {
    // This would typically open a modal or navigate to a new screen
    Alert.alert('Add Transaction', 'This would open a new transaction form');
  };

  const handleDeleteTransaction = (transactionId: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTransactions(prev => prev.filter(t => t.id !== transactionId));
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color={colors.paleGreen} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.avatar, { backgroundColor: colors.paleGreen }]}>
            <Text style={{ color: isDark ? theme.surface : colors.light.surface }}>
              {avatar}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{name}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>
              {type === 'group' ? 'Group' : 'Person'}
            </Text>
          </View>
        </View>
      </View>

      {/* Balance Card */}
      <View style={[styles.balanceCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.balanceLabel, { color: theme.secondaryText }]}>
          Total Balance
        </Text>
        <Text style={[
          styles.balanceAmount,
          { color: totalBalance >= 0 ? colors.paleGreen : colors.error }
        ]}>
          ${Math.abs(totalBalance).toFixed(2)}
        </Text>
        <Text style={[styles.balanceSubtitle, { color: theme.secondaryText }]}>
          {totalBalance >= 0 ? 'They owe you' : 'You owe them'}
        </Text>
      </View>

      {/* Transactions List */}
      <View style={styles.transactionsContainer}>
        <View style={styles.transactionsHeader}>
          <Text style={[styles.transactionsTitle, { color: theme.secondaryText }]}>
            TRANSACTIONS
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddTransaction}
          >
            <Icon name="add-circle" size={24} color={colors.paleGreen} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.transactionsList}>
          {transactions.map((transaction, index) => (
            <TouchableOpacity
              key={transaction.id}
              style={[
                styles.transactionItem,
                { backgroundColor: theme.surface },
                index < transactions.length - 1 && styles.transactionBorder,
                { borderBottomColor: theme.border }
              ]}
              onLongPress={() => handleDeleteTransaction(transaction.id)}
            >
              <View style={styles.transactionLeft}>
                <Icon 
                  name={transaction.type === 'payment' ? 'arrow-up' : 'arrow-down'} 
                  size={20} 
                  color={transaction.type === 'payment' ? colors.paleGreen : colors.error}
                  style={styles.transactionIcon}
                />
                <View>
                  <Text style={[styles.transactionDescription, { color: theme.text }]}>
                    {transaction.description}
                  </Text>
                  <Text style={[styles.transactionDate, { color: theme.secondaryText }]}>
                    {formatDate(transaction.date)}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.amount >= 0 ? colors.paleGreen : colors.error }
              ]}>
                {transaction.amount >= 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceSubtitle: {
    fontSize: 15,
  },
  transactionsContainer: {
    flex: 1,
    marginTop: 8,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  transactionsTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  addButton: {
    padding: 4,
  },
  transactionsList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  transactionBorder: {
    borderBottomWidth: 0.5,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionDescription: {
    fontSize: 17,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
  },
  transactionAmount: {
    fontSize: 17,
    fontWeight: '600',
  },
}); 