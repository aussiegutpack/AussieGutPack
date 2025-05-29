// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";
import { ThemeContext } from '../App'; // Import ThemeContext if needed, based on file content
import { useNavigate } from 'react-router-dom'; // Import useNavigate if needed

console.log('AuthContext.jsx: Loading AuthContext');

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext.jsx: Setting up auth state listener');
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      console.log('AuthContext.jsx: User state updated:', session?.user ?? null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthContext.jsx: Auth state change event:', event);
      console.log('AuthContext.jsx: Session:', session);
      setUser(session?.user ?? null);
      setLoading(false);
      console.log('AuthContext.jsx: User state updated:', session?.user ?? null);

      if (event === 'SIGNED_OUT') {
        console.log('AuthContext.jsx: Signed out, potentially redirecting');
        // navigate('/'); // Example redirect on sign out
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signup = async (email, password) => {
    console.log("Signup attempt with:", { email, password });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/login",
      },
    });
    console.log("Signup response:", JSON.stringify(data, null, 2));
    if (error) {
      console.error("Signup error:", error.message);
      throw error;
    }
    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      console.log(
        "User already exists. Attempting to resend confirmation email..."
      );
      const resendResponse = await supabase.auth.resend({
        type: "signup",
        email,
      });
      console.log("Resend response:", JSON.stringify(resendResponse, null, 2));
      if (resendResponse.error) {
        console.error(
          "Error resending confirmation email:",
          resendResponse.error.message
        );
        throw resendResponse.error;
      }
      throw new Error(
        "User already exists. A confirmation email has been resent."
      );
    }
    return data;
  };

  const login = async (email, password) => {
    console.log("Login attempt with:", { email, password });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Login error:", error.message);
      // Customize the error message for unconfirmed users
      if (error.message.includes("Email not confirmed")) {
        throw new Error("Please confirm your email before logging in.");
      }
      throw error;
    }
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
    setUser(null);
    console.log('AuthContext.jsx: Logout function called');
  };

  // Add a function to refresh user data
  const refreshUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    refreshUser, // Add this to the context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
