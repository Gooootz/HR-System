import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Holiday {
  date: string;
  type: string;
  title: string;
  color: string;
}

interface HolidaysContextType {
  holidays: Holiday[];
  setHolidays: React.Dispatch<React.SetStateAction<Holiday[]>>;
}

const HolidaysContext = createContext<HolidaysContextType | undefined>(undefined);

export const HolidaysProvider = ({ children }: { children: ReactNode }) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  return (
    <HolidaysContext.Provider value={{ holidays, setHolidays }}>
      {children}
    </HolidaysContext.Provider>
  );
};

export const useHolidays = () => {
  const context = useContext(HolidaysContext);
  if (!context) {
    throw new Error('useHolidays must be used within a HolidaysProvider');
  }
  return context;
};