import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { type User } from '@supabase/supabase-js';

export const useUserProfile = (user: User | null) => {
  const [role, setRole] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const resetProfile = useCallback(() => {
    setRole(null);
    setStoreName(null);
    setApplicationStatus(null);
  }, []);

  const fetchProfile = useCallback(async (currentUser: User) => {
    setLoading(true);
    try {
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('role, store_name')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (pError) throw pError;

      if (profile) {
        setRole(profile.role);
        setStoreName(profile.store_name);
      } else {
        setRole('user');
        setStoreName(null);
      }

      const { data: app, error: aError } = await supabase
        .from('owner_applications')
        .select('status')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (aError) throw aError;

      setApplicationStatus(app?.status ?? null);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      resetProfile();
    } finally {
      setLoading(false);
    }
  }, [resetProfile]);

  useEffect(() => {
    if (user) {
      fetchProfile(user);
    } else {
      resetProfile();
      setLoading(false);
    }
  }, [user, fetchProfile, resetProfile]);

  return { 
    role, 
    storeName, 
    applicationStatus, 
    loading: loading, 
    refreshProfile: () => user ? fetchProfile(user) : Promise.resolve() 
  };
};
