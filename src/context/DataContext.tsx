import React, { createContext, useContext, useState } from 'react';

interface Person {
  id: string;
  name: string;
  email: string;
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
  currentUser: Person;
}

const initialData: DataContextType = {
  currentUser: {
    id: 'DesRD8_0jGcnao5B6c2Sg',
    name: 'Joe Doe',
    email: "joe.doe@gmail.com",
    amount: 0,
    avatar: generateAvatar('You'),
    lastActivity: 'Now'
  }
};

const DataContext = createContext<DataContextType>(initialData);

export const useDataContext = () => {
  const data = useContext(DataContext);
  return {
    ...data,
    userId: data.currentUser.id,
  };
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data] = useState<DataContextType>(initialData);

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};
