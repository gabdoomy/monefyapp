import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

interface Person {
  id: string;
  name: string;
}
import { useTheme } from '../context/ThemeContext';
import { useDataContext } from '../context/DataContext';
import { colors } from '../theme/colors';
import styles from './AddExpenseScreen.styles';

type SplitType = 'equal' | 'amount' | 'percentage' | 'shares';

interface Participant {
  id: string;
  amount: number;
  name: string;
  avatar: string;
  splitType: SplitType;
  value: number; // amount, percentage, or shares depending on splitType
  share: number; // final calculated amount
}

interface AddExpenseScreenProps {
  navigation: any;
  route: {
    params?: {
      preselectedParticipants?: Participant[];
    };
  };
}

import { API_HOSTNAME } from '../constants';

export const AddExpenseScreen = ({ navigation, route }: AddExpenseScreenProps) => {
  const { isDark } = useTheme();
  const { currentUser } = useDataContext();
  const theme = isDark ? colors.dark : colors.light;

  const [people, setPeople] = useState<Person[]>([]);
  const [payerId, setPayerId] = useState<string>(currentUser.id);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`${API_HOSTNAME}/api/friendsGet?id=${currentUser.id}`);
        const data = await response.json();
        setPeople(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
        // Handle error appropriately, e.g., show an error message to the user
      }
    };

    fetchFriends();
  }, [currentUser.id]);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);
  const [totalError, setTotalError] = useState(false);
  const [selectedSplitType, setSelectedSplitType] = useState<SplitType>('equal');

  // Initialize with preselected participants if provided, otherwise just current user
  useEffect(() => {
    const initialAmount = parseFloat(amount) || 0;
    if (route.params?.preselectedParticipants) {
      setParticipants(route.params.preselectedParticipants);
    } else {
      
      const currentParticipant: Participant = {
        id: currentUser.id,
        amount: 0, // Add a default value for amount
        name: currentUser.name,
        avatar: currentUser.avatar,
        splitType: selectedSplitType,
        value: 1,
        share: initialAmount
      };
      setParticipants([currentParticipant]);
    }
  }, [amount]); // Only run once on mount

  // Update all participants when split type changes
  useEffect(() => {
    if (participants.length > 0) {
      const updatedParticipants = participants.map(p => ({
        ...p,
        splitType: selectedSplitType,
        value: selectedSplitType === 'equal' ? 1 :
               selectedSplitType === 'percentage' ? 100 / participants.length :
               selectedSplitType === 'shares' ? 1 :
               parseFloat(amount) / participants.length
      }));
      const recalculatedParticipants = calculateShares(updatedParticipants);
      setParticipants(updatedParticipants);
    }
  }, [selectedSplitType]);

  const validateTotalSum = (participantsList: Participant[]): boolean => {
    const totalAmount = parseFloat(amount) || 0;
    const participantsTotal = participantsList.reduce((sum, p) => sum + p.share, 0);
    
    // Round to 2 decimal places to avoid floating point issues
    const roundedTotal = Math.round(totalAmount * 100) / 100;
    const roundedParticipantsTotal = Math.round(participantsTotal * 100) / 100;
    
    return roundedTotal === roundedParticipantsTotal;
  };

  const calculateShares = (updatedParticipants: Participant[]) => {
    const totalAmount = Math.max(0, parseFloat(amount) || 0);
    const result = [...updatedParticipants];

    // Reset all shares
    result.forEach(p => {
      p.value = Math.max(0, p.value); // Ensure no negative values
    });
    // Calculate shares based on split type
    switch (selectedSplitType) {
      
      case 'amount':
        let remainingAmount = totalAmount;
        result.forEach(p => {
          p.share = Math.min(Math.max(0, p.value), remainingAmount);
          remainingAmount -= p.share;
        });
        // If there's remaining amount, add it to the last participant
        if (remainingAmount > 0 && result.length > 0) {
          result[result.length - 1].share += remainingAmount;
        }
        break;

      case 'percentage':
        let totalPercentage = result.reduce((sum, p) => sum + p.value, 0);
        if (totalPercentage > 100) {
          // Normalize percentages to 100%
          result.forEach(p => {
            p.value = (p.value / totalPercentage) * 100;
          });
          totalPercentage = 100;
        }
        result.forEach(p => {
          p.share = (totalAmount * p.value) / 100;
        });
        break;

      case 'shares':
        const totalShares = result.reduce((sum, p) => sum + p.value, 0);
        if (totalShares > 0) {
          const amountPerShare = totalAmount / totalShares;
          result.forEach(p => {
            p.share = p.value * amountPerShare;
          });
        } else {
          result.forEach(p => {
            p.share = totalAmount / result.length;
          });
        }
        break;

      case 'equal':
      default:
        const equalShare = totalAmount / result.length;
        result.forEach(p => {
          p.share = equalShare;
          p.value = 1; // Keep value as 1 for equal split
        });
        // If only one participant, set share to total amount
        if (result.length === 1) {
          result[0].share = totalAmount;
        }
        break;
    }

    const isValid = validateTotalSum(result);
    setTotalError(!isValid);

    return result;
  };

  const handleAddParticipant = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setIsSelectModalVisible(true);
  };

  const handleRemoveParticipant = (id: string) => {
    if (id === currentUser.id) return; // Never remove current user
    const newParticipants = participants.filter(p => p.id !== id);
    const updatedParticipants = calculateShares(newParticipants);
    setParticipants(updatedParticipants);
  };

  const handleSelectParticipant = (item: Person) => {
    if (participants.some(p => p.id === item.id)) {
      setIsSelectModalVisible(false);
      return;
    }
    
    const newParticipant: Participant = {
      ...item,
      splitType: selectedSplitType,
      value: selectedSplitType === 'percentage' ? 100 / (participants.length + 1) :
             selectedSplitType === 'shares' ? 1 :
             selectedSplitType === 'amount' ? (parseFloat(amount) || 0) / (participants.length + 1) :
             1,
      share: 0,
      amount: 0,
      avatar: item.name.substring(0, 2).toUpperCase()
    };

    const newParticipants = [...participants, newParticipant];
    const updatedParticipants = calculateShares(newParticipants);
    setParticipants(updatedParticipants);
    setIsSelectModalVisible(false);
  };

  const handleValueChange = (id: string, value: string) => {
    const parsedValue = Math.max(0, parseFloat(value) || 0);
    const newParticipants = participants.map(p => {
      if (p.id === id) {
        return {
          ...p,
          value: parsedValue
        };
      }
      return p;
    });
    const updatedParticipants = calculateShares(newParticipants);
    setParticipants(updatedParticipants);
  };

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    if (!validateTotalSum(participants)) {
      return;
    }

    const participantsArray = participants.map(p => ({ id: p.id }));
    const howMuchEachParticipantNeedsToPay: {[key: string]: number} = participants.reduce((obj, p) => {
      // @ts-ignore
      obj[p.id] = p.amount;
      return obj;
    }, {});

    const transactionData = {
      "participants": participantsArray,
      "howMuchEachParticipantNeedsToPay": howMuchEachParticipantNeedsToPay,
      "whoPaidTheTotalSum": payerId,
      "totalSumPaid": parseFloat(amount)
    };

    fetch(`${API_HOSTNAME}/api/createTransaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      navigation.goBack();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const canSave = () => {
    return amount && 
           parseFloat(amount) > 0 && 
           !totalError && 
           participants.length > 0 && 
           description.trim().length > 0;
  };

  const getErrorMessage = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return {
        icon: 'information-circle-outline',
        message: 'Enter an amount to start splitting',
        isError: false
      };
    }
    if (totalError) {
      return {
        icon: 'alert-circle-outline',
        message: `Split amounts don't match the total sum of $${parseFloat(amount).toFixed(2)}`,
        isError: true
      };
    }
    if (!description.trim()) {
      return {
        icon: 'information-circle-outline',
        message: 'Add a description for the expense',
        isError: false
      };
    }
    return null;
  };

  const renderSplitTypeSelector = () => (
    <View style={[styles.splitTypeSelector, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Split Type</Text>
      <View style={styles.splitTypeGrid}>
        <TouchableOpacity
          style={[
            styles.splitTypeSelectorButton,
            selectedSplitType === 'equal' && { backgroundColor: colors.paleGreen }
          ]}
          onPress={() => setSelectedSplitType('equal')}
        >
          <Icon
            name="resize-outline"
            size={18}
            color={selectedSplitType === 'equal' ? colors.light.surface : theme.text}
          />
          <Text style={[
            styles.splitTypeSelectorText,
            { color: selectedSplitType === 'equal' ? colors.light.surface : theme.text }
          ]}>Equal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.splitTypeSelectorButton,
            selectedSplitType === 'amount' && { backgroundColor: colors.paleGreen }
          ]}
          onPress={() => setSelectedSplitType('amount')}
        >
          <Icon
            name="cash-outline"
            size={18}
            color={selectedSplitType === 'amount' ? colors.light.surface : theme.text}
          />
          <Text style={[
            styles.splitTypeSelectorText,
            { color: selectedSplitType === 'amount' ? colors.light.surface : theme.text }
          ]}>Amount</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.splitTypeSelectorButton,
            selectedSplitType === 'percentage' && { backgroundColor: colors.paleGreen }
          ]}
          onPress={() => setSelectedSplitType('percentage')}
        >
          <Icon
            name="pie-chart-outline"
            size={18}
            color={selectedSplitType === 'percentage' ? colors.light.surface : theme.text}
          />
          <Text style={[
            styles.splitTypeSelectorText,
            { color: selectedSplitType === 'percentage' ? colors.light.surface : theme.text }
          ]}>Percentage</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.splitTypeSelectorButton,
            selectedSplitType === 'shares' && { backgroundColor: colors.paleGreen }
          ]}
          onPress={() => setSelectedSplitType('shares')}
        >
          <Icon
            name="apps-outline"
            size={18}
            color={selectedSplitType === 'shares' ? colors.light.surface : theme.text}
          />
          <Text style={[
            styles.splitTypeSelectorText,
            { color: selectedSplitType === 'shares' ? colors.light.surface : theme.text }
          ]}>Shares</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderParticipant = (participant: Participant) => (
    <View key={participant.id} style={[styles.participantItem, { backgroundColor: theme.surface }]}>
      <View style={styles.participantInfo}>
        <View style={[styles.avatar, { backgroundColor: colors.paleGreen }]}>
          <Text style={{ color: isDark ? theme.surface : colors.light.surface }}>
            {participant.avatar || participant.name[0]}
          </Text>
        </View>
        <View style={styles.participantDetails}>
          <Text style={[styles.participantName, { color: theme.text }]}>
            {participant.name}
          </Text>
          <Text style={[styles.participantSubtitle, { color: theme.secondaryText }]}>
            ${participant.share.toFixed(2)}
          </Text>
        </View>
      </View>
      {selectedSplitType !== 'equal' && (
        <View style={styles.valueInputContainer}>
          <TextInput
            style={[styles.valueInput, { color: theme.text, borderColor: theme.border }]}
            value={participant.value.toString()}
            onChangeText={(value) => handleValueChange(participant.id, value)}
            keyboardType="numeric"
            placeholder={
              selectedSplitType === 'percentage' ? '%' :
              selectedSplitType === 'shares' ? 'shares' :
              '$'
            }
            placeholderTextColor={theme.secondaryText}
          />
        </View>
      )}
      {participant.id !== currentUser.id && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveParticipant(participant.id)}
        >
          <Icon name="close-circle-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSelectableItem = (item: Person) => {
    const isSelected = participants.some(p => p.id === item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.selectableItem,
          { backgroundColor: theme.surface },
          isSelected && styles.selectedItem
        ]}
        onPress={() => handleSelectParticipant(item)}
        disabled={isSelected}
      >
        <View style={styles.participantInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.paleGreen }]}>
            <Text style={{ color: isDark ? theme.surface : colors.light.surface }}>
              {item.name.substring(0, 2).toUpperCase()|| item.name[0]}
            </Text>
          </View>
          <View style={styles.participantDetails}>
            <Text style={[
              styles.participantName,
              { color: isSelected ? theme.secondaryText : theme.text }
            ]}>
              {item.name}
            </Text>
          </View>
        </View>
        {isSelected && (
          <Icon name="checkmark-circle" size={24} color={colors.paleGreen} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Add Expense</Text>
        <TouchableOpacity 
          onPress={handleSave}
          disabled={!canSave()}
          style={[
            styles.saveButton,
            !canSave() && styles.saveButtonDisabled
          ]}
        >
          <Text style={[
            styles.saveButtonText, 
            { color: !canSave() ? theme.secondaryText : colors.paleGreen }
          ]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.amountContainer, { backgroundColor: theme.surface }]}>
          <Text style={[styles.currencySymbol, { color: theme.text }]}>$</Text>
          <TextInput
            style={[styles.amountInput, { color: theme.text }]}
            value={amount}
            onChangeText={(value) => {
              const parsedValue = Math.max(0, parseFloat(value) || 0);
              setAmount(parsedValue.toString());
              // Recalculate shares with the new amount
              
              setParticipants(prevParticipants => {
                const updatedParticipants = prevParticipants.map(p => ({
                  ...p,
                  value: selectedSplitType === 'equal' ? 1 :
                         selectedSplitType === 'percentage' ? p.value :
                         selectedSplitType === 'shares' ? p.value :
                         parsedValue / prevParticipants.length
                }));
                const recalculatedParticipants = calculateShares(updatedParticipants);
                return recalculatedParticipants;
              });
            }}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={theme.secondaryText}
          />
        </View>

        {renderSplitTypeSelector()}

        {(() => {
          const error = getErrorMessage();
          if (!error) return null;

          return (
            <View style={[
              styles.errorContainer,
              { backgroundColor: error.isError ? colors.error + '15' : theme.secondaryText + '15' }
            ]}>
              <Icon 
                name={error.icon} 
                size={16} 
                color={error.isError ? colors.error : theme.secondaryText} 
              />
              <Text style={[
                styles.errorText, 
                { color: error.isError ? colors.error : theme.secondaryText }
              ]}>
                {error.message}
              </Text>
            </View>
          );
        })()}

        <View style={[
          styles.participantsContainer, 
          { 
            backgroundColor: theme.surface,
            opacity: !amount || parseFloat(amount) <= 0 ? 0.5 : 1 
          }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Split With</Text>
            {!amount || parseFloat(amount) <= 0 ? (
              <Text style={[styles.sectionSubtitle, { color: theme.secondaryText }]}>
                Enter amount first
              </Text>
            ) : (
              <Text style={[styles.sectionSubtitle, { color: theme.secondaryText }]}>
                Total: ${parseFloat(amount).toFixed(2)}
              </Text>
            )}
          </View>
          {participants.map(renderParticipant)}
          
          <TouchableOpacity
            style={[
              styles.addParticipantButton,
              (!amount || parseFloat(amount) <= 0) && styles.disabledButton
            ]}
            onPress={handleAddParticipant}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            <Icon 
              name="person-add-outline" 
              size={24} 
              color={!amount || parseFloat(amount) <= 0 ? theme.secondaryText : colors.paleGreen} 
            />
            <Text style={[
              styles.addParticipantText, 
              { color: !amount || parseFloat(amount) <= 0 ? theme.secondaryText : colors.paleGreen }
            ]}>
              Add person
            </Text>
          </TouchableOpacity>
          </View>
          <View style={[styles.payerSelector, { backgroundColor: theme.surface, marginTop: 10 }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Who paid?</Text>
            <Picker
              selectedValue={payerId}
              style={{ color: theme.text }}
              onValueChange={(itemValue) => setPayerId(itemValue)}
            >
              {participants.map((participant) => (
                <Picker.Item key={participant.id} label={participant.name} value={participant.id} />
              ))}
            </Picker>
          </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.surface }]}>
          <View style={styles.descriptionHeader}>
            <Icon name="create-outline" size={20} color={theme.secondaryText} />
            <Text style={[styles.descriptionTitle, { color: theme.text }]}>Description</Text>
          </View>
          <TextInput
            style={[styles.descriptionInput, { color: theme.text }]}
            value={description}
            onChangeText={(text) => setDescription(text.slice(0, 100))}
            placeholder="What's this expense for?"
            placeholderTextColor={theme.secondaryText}
            maxLength={100}
          />
          <Text style={[styles.characterCount, { color: theme.secondaryText }]}>
            {description.length}/100
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={isSelectModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSelectModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.surface }]}>
            <TouchableOpacity onPress={() => setIsSelectModalVisible(false)}>
              <Icon name="close" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Select Person
            </Text>
            <View style={{ width: 24 }} />
          </View>
          <FlatList
            data={people.filter(p => !participants.some(part => part.id === p.id))}
            renderItem={({ item }) => renderSelectableItem(item)}
            keyExtractor={item => item.id}
            style={styles.modalList}
          />
        </View>
      </Modal>
    </View>
  );
};
