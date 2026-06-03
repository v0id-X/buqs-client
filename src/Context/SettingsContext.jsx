import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [isSafeMode, setIsSafeMode] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem("safe_mode");

    if (savedMode !== null) {
      setIsSafeMode(savedMode === "true");
    }
  }, []);

  const toggleSafeMode = () => {
    setIsSafeMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("safe_mode", newValue);
      return newValue;
    });
  };

  return (
    <SettingsContext.Provider
      value={{ isSafeMode, toggleSafeMode }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);