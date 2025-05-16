
import React, { createContext, useState } from 'react';

export const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [todayEntryCount, setTodayEntryCount] = useState(0);
  const [todayExitCount, setTodayExitCount] = useState(0);

  const incrementEntry = () => setTodayEntryCount(prev => prev + 1);
  const incrementExit = () => setTodayExitCount(prev => prev + 1);

  return (
    <StockContext.Provider value={{ todayEntryCount, todayExitCount, incrementEntry, incrementExit }}>
      {children}
    </StockContext.Provider>
  );
};
