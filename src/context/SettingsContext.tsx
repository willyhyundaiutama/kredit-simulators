
import React, { createContext, useContext, useState } from "react";

interface SettingsContextType {
  provisionRate: number;
  setProvisionRate: (rate: number) => void;
  additionalAdminFee: number;
  setAdditionalAdminFee: (fee: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provisionRate, setProvisionRate] = useState<number>(5.0);
  const [additionalAdminFee, setAdditionalAdminFee] = useState<number>(5000000);

  return (
    <SettingsContext.Provider
      value={{
        provisionRate,
        setProvisionRate,
        additionalAdminFee,
        setAdditionalAdminFee
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
