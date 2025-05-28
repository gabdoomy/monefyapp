import React, { createContext, useContext, useState } from 'react';

export interface DebtItem {
  id: string;
  name: string;
  amount: number;
  avatar: string;
  lastActivity?: string;
}

const generateAvatar = (name: string): string => {
  const nameParts = name.split(' ');
  let avatar = '';
  if (nameParts.length === 1) {
    avatar = nameParts[0].substring(0, 2).toUpperCase();
  } else {
    avatar = (nameParts[0].substring(0, 1) + nameParts[nameParts.length - 1].substring(0, 1)).toUpperCase();
  }
  return avatar;
};

interface DataContextType {
  currentUser: DebtItem;
  people: DebtItem[];
}

const initialData: DataContextType = {
  currentUser: {
    id: 'current-user',
    name: 'You',
    amount: 0,
    avatar: generateAvatar('You'),
    lastActivity: 'Now'
  },
  people: [
    { 
      id: '3',
      name: 'John Doe',
      amount: -15.75,
      avatar: generateAvatar('John Doe'),
      lastActivity: '2 days ago'
    },
    { 
      id: '4',
      name: 'Sarah Smith',
      amount: 45.00,
      avatar: generateAvatar('Sarah Smith'),
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
