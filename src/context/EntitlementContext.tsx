import React, { createContext, useContext } from 'react';

export interface EntitlementContextValue {
  isPremium: boolean;
  trialDaysRemaining: number;
  trialCountdownLabel?: string;
  trialIsWarning?: boolean;
  isTrialExpired: boolean;
  openPaywall: (reason?: string) => void;
}

const EntitlementContext = createContext<EntitlementContextValue>({
  isPremium: false,
  trialDaysRemaining: 1,
  trialCountdownLabel: '24:00:00',
  trialIsWarning: false,
  isTrialExpired: false,
  openPaywall: () => {},
});

export function EntitlementProvider({
  value,
  children,
}: {
  value: EntitlementContextValue;
  children: React.ReactNode;
}) {
  return (
    <EntitlementContext.Provider value={value}>
      {children}
    </EntitlementContext.Provider>
  );
}

export function useEntitlement(): EntitlementContextValue {
  return useContext(EntitlementContext);
}
