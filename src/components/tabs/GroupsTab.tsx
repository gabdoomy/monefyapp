import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { styles } from './styles/GroupsTab.styles';
import { colors } from '../../theme/colors';

interface DebtItem {
  id: string;
  name: string;
  amount: number;
  avatar?: string;
  type: 'group' | 'person';
  lastActivity?: string;
  members?: number;
}

interface GroupsTabProps {
  navigation: any;
}

const mockData: { groups: DebtItem[], people: DebtItem[] } = {
  groups: [
    { 
      id: '1',
      name: 'Lunch Group',
      amount: 25.50,
      avatar: '🍱',
      type: 'group',
      members: 4,
      lastActivity: 'Today'
    },
    { 
      id: '2',
      name: 'Vacation Squad',
      amount: 120.00,
      avatar: '✈️',
      type: 'group',
      members: 6,
      lastActivity: 'Yesterday'
    },
  ],
  people: [
    { 
      id: '3',
      name: 'John Doe',
      amount: -15.75,
      avatar: 'JD',
      type: 'person',
      lastActivity: '2 days ago'
    },
    { 
      id: '4',
      name: 'Sarah Smith',
      amount: 45.00,
      avatar: 'SS',
      type: 'person',
      lastActivity: 'Today'
    },
  ]
};

export const GroupsTab = ({ navigation }: GroupsTabProps) => {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;
  const totalBalance = [...mockData.groups, ...mockData.people]
    .reduce((sum, item) => sum + item.amount, 0);

  const handleItemPress = (item: DebtItem) => {
    navigation.navigate('TransactionDetails', {
      id: item.id,
      name: item.name,
      type: item.type,
      avatar: item.avatar
    });
  };

  const renderItem = (item: DebtItem) => {
    const isGroup = item.type === 'group';

    return (
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
                {isGroup ? `${item.members} members` : `Last activity: ${item.lastActivity}`}
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
  };

  const renderSection = (title: string, items: DebtItem[]) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
          {title}
        </Text>

        <View style={[styles.listContainer, { backgroundColor: theme.surface }]}>
          {items.map((item, index) => (
            <View key={item.id}>
              {renderItem(item)}
              {index < items.length - 1 && (
                <View 
                  style={[
                    styles.listItemDivider,
                    { backgroundColor: theme.border }
                  ]} 
                />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Balance</Text>
      
      <View style={[styles.balanceCard, { backgroundColor: theme.surface }]}>
        <Text style={[
          styles.balanceAmount,
          { color: totalBalance >= 0 ? colors.paleGreen : colors.error }
        ]}>
          ${Math.abs(totalBalance).toFixed(2)}
        </Text>
        <Text style={[styles.balanceSubtitle, { color: theme.secondaryText }]}>
          {totalBalance >= 0 ? 'Total balance you are owed' : 'Total balance you owe'}
        </Text>
      </View>

      {renderSection('Groups', mockData.groups)}
      {renderSection('People', mockData.people)}
    </ScrollView>
  );
}; 