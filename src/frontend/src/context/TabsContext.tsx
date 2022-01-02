import { useContext, createContext, useMemo, useState } from 'react';

interface TabsContextValue {
  currentIndex: number;
  setCurrentIndex: (num: number) => void;
}

const TabsContext = createContext<TabsContextValue>({
  currentIndex: 0,
  setCurrentIndex: num => num,
});

interface TabsContextProps {
  children: React.ReactNode;
}

export const TabsContextProvider = ({ children }: TabsContextProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const value = useMemo<TabsContextValue>(() => {
    return {
      currentIndex,
      setCurrentIndex,
    };
  }, [currentIndex]);

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};

export const useTabs = () => {
  return useContext(TabsContext);
};
