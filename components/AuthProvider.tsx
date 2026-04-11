'use client';

import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  isAdmin: boolean;
  profile: any;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: { id: 'local', email: 'adm@sonoplastia.com' },
  session: { user: { id: 'local' } },
  loading: false,
  isAdmin: true,
  profile: { full_name: 'Administrador', role: 'admin', is_admin: true },
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const signOut = async () => {
    // No-op: no login system
  };

  return (
    <AuthContext.Provider value={{
      user: { id: 'local', email: 'adm@sonoplastia.com' },
      session: { user: { id: 'local' } },
      loading: false,
      isAdmin: true,
      profile: { full_name: 'Administrador', role: 'admin', is_admin: true },
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
