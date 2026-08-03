import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { UserProfile } from "../types";

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function generateUsername(email: string): string {
  const localPart = email.split("@")[0];
  return localPart
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 20) || "user";
}

function generateAvatar(username: string): string {
  const initials = username.slice(0, 2).toUpperCase();
  return initials;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("popcritic-user");
    return saved ? JSON.parse(saved) : null;
  });

  const isLoggedIn = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem("popcritic-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("popcritic-user");
    }
  }, [user]);

  const signup = (email: string, password: string) => {
    const emailRegex = /^[^\s@]+@[\w-]+(\.[\w-]+)+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: "Please enter a valid Gmail address." };
    }
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      return { success: false, message: "Please use a Gmail address." };
    }
    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters." };
    }

    const existing = localStorage.getItem(`popcritic-auth:${email.toLowerCase()}`);
    if (existing) {
      return { success: false, message: "An account with this email already exists. Please sign in." };
    }

    const username = generateUsername(email);
    const profile: UserProfile = {
      email,
      username,
      bio: "Entertainment enthusiast",
      avatar: generateAvatar(username),
      joinedAt: new Date().toISOString(),
    };

    localStorage.setItem(`popcritic-auth:${email.toLowerCase()}`, JSON.stringify({ email, password }));
    localStorage.setItem(`popcritic-profile:${email.toLowerCase()}`, JSON.stringify(profile));
    setUser(profile);
    return { success: true, message: "Account created successfully!" };
  };

  const login = (email: string, password: string) => {
    const stored = localStorage.getItem(`popcritic-auth:${email.toLowerCase()}`);
    if (!stored) {
      return { success: false, message: "No account found. Please sign up." };
    }

    const auth = JSON.parse(stored);
    if (auth.password !== password) {
      return { success: false, message: "Incorrect password." };
    }

    const profileStored = localStorage.getItem(`popcritic-profile:${email.toLowerCase()}`);
    const profile = profileStored ? JSON.parse(profileStored) : {
      email,
      username: generateUsername(email),
      bio: "Entertainment enthusiast",
      avatar: generateAvatar(generateUsername(email)),
      joinedAt: new Date().toISOString(),
    };

    setUser(profile);
    return { success: true, message: "Signed in successfully!" };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updates };
      localStorage.setItem(`popcritic-profile:${prev.email.toLowerCase()}`, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
