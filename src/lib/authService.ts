import { supabase } from './supabase';
import { UserProfile, UserPlan, PLAN_CONFIGS } from '../types/auth';

const USERS_STORAGE_KEY = 'saqib_all_users_v1';
const CURRENT_USER_KEY = 'saqib_current_user_v1';

// Seed demo users if empty
const getInitialUsers = (): UserProfile[] => {
  const saved = localStorage.getItem(USERS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse users', e);
    }
  }
  return [
    {
      id: 'demo-user-1',
      customId: 'USR-8291',
      email: 'demo@crimsonledger.com',
      username: 'DemoTester',
      plan: 'free',
      createdAt: new Date().toISOString(),
      expiresAt: null,
      slipsCreatedToday: 1,
      totalSlipsCreated: 4,
    },
    {
      id: 'demo-user-2',
      customId: 'USR-4019',
      email: 'pro_merchant@gmail.com',
      username: 'HamzaTrader',
      plan: 'pro',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      slipsCreatedToday: 5,
      totalSlipsCreated: 42,
    },
  ];
};

export const getAllUsers = (): UserProfile[] => {
  return getInitialUsers();
};

export const saveUsers = (users: UserProfile[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): UserProfile | null => {
  const saved = localStorage.getItem(CURRENT_USER_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return null;
};

export const saveCurrentUser = (user: UserProfile | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const generateCustomUserId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `USR-${randomNum}`;
};

export const registerUser = async (
  email: string,
  username: string,
  pass: string
): Promise<{ user: UserProfile | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: pass,
      options: {
        data: { username: username.trim() },
      },
    });

    if (error || !data?.user) {
      return { user: null, error: error?.message || 'Registration failed. Please try again.' };
    }

    const authId = data.user.id;
    const customId = generateCustomUserId();

    // Call server action to securely create profile
    const { syncNewUserAction } = await import('../app/actions/syncNewUser');
    const syncRes = await syncNewUserAction(authId, customId, email.trim(), username.trim());

    if (!syncRes.success) {
      // If profile creation fails, they shouldn't be logged in
      await supabase.auth.signOut();
      return { user: null, error: syncRes.error || 'Failed to setup account profile in database.' };
    }

    const newUser: UserProfile = {
      id: authId,
      customId: customId,
      email: email.trim(),
      username: username.trim() || email.split('@')[0],
      plan: 'free',
      createdAt: new Date().toISOString(),
      expiresAt: null,
      slipsCreatedToday: 0,
      totalSlipsCreated: 0,
    };

    saveCurrentUser(newUser);
    return { user: newUser, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Network error during registration.' };
  }
};

export const loginUser = async (
  emailOrUsername: string,
  pass: string
): Promise<{ user: UserProfile | null; error: string | null }> => {
  const search = emailOrUsername.trim().toLowerCase();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: search,
      password: pass,
    });

    if (error || !data?.user) {
      return { user: null, error: error?.message || 'Invalid login credentials.' };
    }

    // Fetch their real profile from Supabase profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return { user: null, error: 'Profile not found. Please contact support.' };
    }

    const authProfile: UserProfile = {
      id: profile.id,
      customId: profile.custom_id,
      email: profile.email,
      username: profile.username,
      plan: profile.plan,
      createdAt: profile.created_at,
      expiresAt: profile.expires_at || null,
      customDailyLimit: profile.custom_daily_limit,
      slipsCreatedToday: 0,
      totalSlipsCreated: 0,
    };

    saveCurrentUser(authProfile);
    return { user: authProfile, error: null };

  } catch (err: any) {
    return { user: null, error: 'Network error. Please try again.' };
  }
};

export const syncUserFromCloud = async (user: UserProfile): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();
      
    if (data && !error && data.plan !== user.plan) {
      const users = getAllUsers();
      let updatedUser: UserProfile | null = null;

      const updatedUsers = users.map((u) => {
        if (u.id === user.id) {
          updatedUser = { ...u, plan: data.plan as UserPlan };
          return updatedUser;
        }
        return u;
      });

      if (updatedUser) {
        saveUsers(updatedUsers);
        saveCurrentUser(updatedUser);
        return updatedUser;
      }
    }
  } catch (e) {
    console.error('Failed to sync user from cloud:', e);
  }
  return null;
};

