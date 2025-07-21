import { useState, useEffect, createContext, useContext } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';

const AUTH_STORAGE_KEY = 'budget-planner-auth';
const USERS_STORAGE_KEY = 'budget-planner-users';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load authentication state on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setAuthState({
          user: parsedAuth.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading auth state:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const getStoredUsers = (): User[] => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      const users = getStoredUsers();
      
      // Check if username or email already exists
      const existingUser = users.find(
        user => user.username === userData.username || user.email === userData.email
      );
      
      if (existingUser) {
        return {
          success: false,
          message: existingUser.username === userData.username 
            ? 'Username already exists' 
            : 'Email already registered'
        };
      }

      // Validate password confirmation
      if (userData.password !== userData.confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        createdAt: new Date().toISOString(),
      };

      // Save user (in real app, password would be hashed)
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);

      // Store password separately (in real app, this would be hashed and stored securely)
      const passwords = JSON.parse(localStorage.getItem('budget-planner-passwords') || '{}');
      passwords[newUser.id] = userData.password;
      localStorage.setItem('budget-planner-passwords', JSON.stringify(passwords));

      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      const users = getStoredUsers();
      const user = users.find(u => u.username === credentials.username);
      
      if (!user) {
        return { success: false, message: 'Username not found' };
      }

      // Check password (in real app, this would be properly hashed and verified)
      const passwords = JSON.parse(localStorage.getItem('budget-planner-passwords') || '{}');
      if (passwords[user.id] !== credentials.password) {
        return { success: false, message: 'Invalid password' };
      }

      // Set authentication state
      const newAuthState = {
        user,
        isAuthenticated: true,
        isLoading: false,
      };

      setAuthState(newAuthState);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));

      return { success: true, message: 'Login successful!' };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...updates };
    const users = getStoredUsers();
    const updatedUsers = users.map(user => 
      user.id === authState.user!.id ? updatedUser : user
    );
    
    saveUsers(updatedUsers);
    
    const newAuthState = {
      ...authState,
      user: updatedUser,
    };
    
    setAuthState(newAuthState);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
  };
};