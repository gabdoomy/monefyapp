import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/context/ThemeContext';
import { DataProvider } from './src/context/DataContext';
import { MainStack } from './src/navigation/MainStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DataProvider>
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        </DataProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
} 