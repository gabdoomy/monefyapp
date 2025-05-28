import React from 'react';
import { View, ScrollView, Switch, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { styles } from './styles/SettingsTab.styles';
import { colors } from '../../theme/colors';

interface SettingsSection {
  title: string;
  items: {
    icon: string;
    label: string;
    value?: string;
    color?: string;
    toggle?: boolean;
    isToggled?: boolean;
    onToggle?: (value: boolean) => void;
  }[];
}

export const SettingsTab = () => {
  const { theme: themeMode, setTheme, isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  const settingsSections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        { icon: 'person', label: 'Profile', value: 'John Doe' },
        { icon: 'mail', label: 'Email', value: 'john@example.com' },
        { icon: 'notifications', label: 'Notifications' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: 'moon', 
          label: 'Dark Mode', 
          toggle: true,
          isToggled: isDark,
          onToggle: (value) => setTheme(value ? 'dark' : 'light')
        },
        { icon: 'cash', label: 'Currency', value: 'GBP' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle', label: 'Help Center' },
        { icon: 'chatbox', label: 'Send Feedback' },
        { icon: 'information-circle', label: 'About', value: 'Version 1.0.0' },
      ],
    },
  ];

  const renderItem = (item: SettingsSection['items'][0], index: number, totalItems: number) => {
    const isLast = index === totalItems - 1;

    return (
      <TouchableOpacity
        key={item.label}
        style={[
          styles.listItem,
          !isLast && styles.listItemBorder,
          { borderBottomColor: theme.border }
        ]}
        disabled={item.toggle}
      >
        <View style={styles.listItemContent}>
          <View style={styles.listItemLeft}>
            <Icon 
              name={item.icon} 
              size={22} 
              color={colors.paleGreen}
              style={styles.listItemIcon}
            />
            <Text style={[styles.listItemLabel, { color: theme.text }]}>
              {item.label}
            </Text>
          </View>

          <View style={styles.listItemRight}>
            {item.toggle ? (
              <Switch
                value={item.isToggled}
                onValueChange={item.onToggle}
                trackColor={{ 
                  false: isDark ? colors.switch.trackDark : colors.switch.trackLight, 
                  true: colors.paleGreen 
                }}
                thumbColor={colors.switch.thumb}
              />
            ) : (
              <View style={styles.listItemValue}>
                {item.value && (
                  <Text style={[styles.valueText, { color: theme.secondaryText }]}>
                    {item.value}
                  </Text>
                )}
                {!item.toggle && !item.value && (
                  <Icon 
                    name="chevron-forward" 
                    size={20} 
                    color={theme.secondaryText}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Settings
      </Text>

      {settingsSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
            {section.title}
          </Text>

          <View style={[styles.sectionContainer, { backgroundColor: theme.surface }]}>
            {section.items.map((item, index) => renderItem(item, index, section.items.length))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}; 