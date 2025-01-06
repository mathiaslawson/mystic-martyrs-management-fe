//user context
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    user_id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    is_active: boolean;
    birth_date: string | null;
    gender: string | null;
    created_at: string;
    updated_at: string;
    member?: {
        member_id: string;
        user_id: string;
        cell_id: string | null;
        zone_id: string | null;
        fellowship_id: string | null;
    };
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    return (
        <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
