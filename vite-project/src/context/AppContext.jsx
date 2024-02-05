// AppContext.js
import { createContext, useContext, useState } from 'react';

export const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const updateRestaurantData = (newData) => {
    setRestaurantData(newData);
  };

  return (
    <AppContext.Provider value={{ user, updateUser, restaurantData, updateRestaurantData }}>
      {children}
    </AppContext.Provider>
  );
};
