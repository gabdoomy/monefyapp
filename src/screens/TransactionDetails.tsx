import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDataContext } from '../context/DataContext';
import styles from './TransactionDetails.styles';
import { API_HOSTNAME } from '../constants';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  timestamp: string;
  type: 'payment' | 'request';
}

interface TransactionDetailsProps {
  route: {
    params: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  navigation: any;
}

export const TransactionDetails = ({ route, navigation }: TransactionDetailsProps) => {
  const { isDark } = useTheme();
  const { currentUser } = useDataContext();
  const theme = isDark ? colors.dark : colors.light;
  const { name, avatar } = route.params;
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_HOSTNAME}/api/getTransactionsBetweenUsers?id1=${currentUser.id}&id2=${route.params.id}`);
        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // Handle error appropriately, e.g., show an error message to the user
      }
    };

    fetchTransactions();
  }, [currentUser.id, route.params.id]);

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  const handleAddTransaction = () => {
    navigation.navigate('AddExpense', {
      preselectedParticipants: [
        {
          ...currentUser,
          splitType: 'equal',
          value: 1,
          share: 0
        },
        {
          id: route.params.id,
          name: route.params.name,
          avatar: route.params.avatar,
          splitType: 'equal',
          value: 1,
          share: 0
        }
      ]
    });
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Integrated Header */}
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
              Person
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
          £{Math.abs(totalBalance).toFixed(2)}
        </Text>
        <Text style={[styles.balanceSubtitle, { color: theme.secondaryText }]}>
          {totalBalance >= 0 ? 'They owe you' : 'You owe them'}
        </Text>
      </View>

      {/* Transactions List */}
      <View style={styles.transactionsContainer}>
        <View style={styles.transactionsHeader}>
          <View style={{ flex: 1 }} />
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
                    {formatDate(transaction.timestamp)}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.amount >= 0 ? colors.paleGreen : colors.error }
              ]}>
                {transaction.amount >= 0 ? '+' : '-'}£{Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
