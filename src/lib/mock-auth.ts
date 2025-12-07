// Jirai - Mock Auth Store
// Simple localStorage-based auth without email verification

'use client';

export interface MockUser {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

interface StoredUser extends MockUser {
    password: string;
}

const USERS_KEY = 'jirai_users';
const CURRENT_USER_KEY = 'jirai_current_user';

// Get all stored users
function getStoredUsers(): StoredUser[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Save users to localStorage
function saveUsers(users: StoredUser[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get current logged in user
export function getCurrentUser(): MockUser | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
}

// Set current user
function setCurrentUser(user: MockUser | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
}

// Sign up - save credentials directly, no verification
export async function mockSignUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string; user?: MockUser }> {
    const users = getStoredUsers();

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const newUser: StoredUser = {
        id: `user_${Date.now()}`,
        email: email.toLowerCase(),
        name,
        password, // In real app, this would be hashed
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after signup
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);

    return { success: true, user: userWithoutPassword };
}

// Login - check credentials
export async function mockLogin(email: string, password: string): Promise<{ success: boolean; error?: string; user?: MockUser }> {
    const users = getStoredUsers();

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return { success: false, error: 'No account found with this email' };
    }

    if (user.password !== password) {
        return { success: false, error: 'Incorrect password' };
    }

    // Login successful
    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);

    return { success: true, user: userWithoutPassword };
}

// Logout
export async function mockLogout(): Promise<void> {
    setCurrentUser(null);
}

// Check if user is logged in
export function isLoggedIn(): boolean {
    return getCurrentUser() !== null;
}
