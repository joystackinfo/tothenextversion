import   { createContext, useReducer, useEffect } from 'react';
import type {ReactNode } from 'react';
import  type { User, AuthResponse } from '../types/index';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Functions that modify state and what they return
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>; // login is async, returns nothing
  signup: (username: string, email: string, password: string) => Promise<void>; // signup is async, returns nothing
  logout: () => void; // logout is sync, returns nothing
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CHECK_TOKEN'; payload: { user: User; token: string } };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }; // show loading spinner, clear old errors
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user, // store user data
        token: action.payload.token, // store JWT token
        loading: false, // stop showing spinner
      };
    case 'LOGIN_ERROR':
      return { ...state, error: action.payload, loading: false }; // display error message
    case 'LOGOUT':
      return { ...state, user: null, token: null }; 
    case 'CHECK_TOKEN':
      return { ...state, user: action.payload.user, token: action.payload.token }; // restore from localStorage
    default:
      return state;
  }
}

// Create context to share auth state across entire app
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState); // state holds user, token, loading, error

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch({ type: 'CHECK_TOKEN', payload: { user: JSON.parse(user), token } }); // restore user on page refresh
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' }); // set loading to true
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', { // call backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data: AuthResponse = await response.json(); // data has token and user
      if (!response.ok) throw new Error(data as any); 
      localStorage.setItem('token', data.token); // persist token to localStorage
      localStorage.setItem('user', JSON.stringify(data.user)); 
      dispatch({ type: 'LOGIN_SUCCESS', payload: data }); // update context state
    } catch (err: any) {
      dispatch({ type: 'LOGIN_ERROR', payload: err.message }); // show error to user
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data: AuthResponse = await response.json();
      if (!response.ok) throw new Error(data as any);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    } catch (err: any) {
      dispatch({ type: 'LOGIN_ERROR', payload: err.message });
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // remove from storage
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' }); // clear state
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}> {/* share all auth functions and state */}
      {children}
    </AuthContext.Provider>
  );
}