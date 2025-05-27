import React, { createContext, useContext, useState } from 'react';

export interface DebtItem {
  id: string;
  name: string;
  amount: number;
  avatar?: string;
  lastActivity?: string;
}

interface DataContextType {
  currentUser: DebtItem;
  people: DebtItem[];
}

const initialData: DataContextType = {
  currentUser: {
    id: 'current-user',
    name: 'You',
    amount: 0,
    avatar: '👤',
    lastActivity: 'Now'
  },
  people: [
    { 
      id: '3',
      name: 'John Doe',
      amount: -15.75,
      avatar: 'JD',
      lastActivity: '2 days ago'
    },
    { 
      id: '4',
      name: 'Sarah Smith',
      amount: 45.00,
      avatar: 'SS',
      lastActivity: 'Today'
    },
  ]
};

const DataContext = createContext<DataContextType>(initialData);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data] = useState<DataContextType>(initialData);

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
}; 