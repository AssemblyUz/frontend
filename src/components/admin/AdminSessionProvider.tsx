'use client';

import {createContext, useContext} from 'react';
import type {PanelUser} from '@/lib/adminTypes';

/**
 * Makes the signed-in user available to client components in the panel.
 *
 * Seeded from the session the layout already fetched on the server, so `user`
 * is populated on first paint. Fetching it again in the browser would leave
 * every permission-gated control flickering in and out on load.
 */
const SessionContext = createContext<PanelUser | null>(null);

export default function AdminSessionProvider({
  user,
  children,
}: {
  user: PanelUser;
  children: React.ReactNode;
}) {
  return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>;
}

export function useAdminSession(): PanelUser {
  const user = useContext(SessionContext);
  if (!user) {
    throw new Error('useAdminSession must be used inside the admin layout.');
  }
  return user;
}
