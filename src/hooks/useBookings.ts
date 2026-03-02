import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js';

export interface BookingData {
  id: string;
  booking_date: string;
  booking_time: string;
  service_name: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  user_id: string;
  cancel_reason: string | null;
  profiles: { 
    full_name: string; 
    phone: string; 
  } | null;
}

export const useBookings = (user: User | null, role: string | null) => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const isOwner = role === 'owner';

  const fetchBookings = useCallback(async () => {
    if (!user || !role) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone
          )
        `)
        .eq(isOwner ? 'owner_id' : 'user_id', user.id)
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error('데이터 조회 에러:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user, isOwner, role]);

  const confirmBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', id);
      if (error) throw error;
      await fetchBookings();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const completeBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', id);
      if (error) throw error;
      await fetchBookings();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const cancelBooking = async (id: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', cancel_reason: reason })
        .eq('id', id);
      if (error) throw error;
      await fetchBookings();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    if (user && role) {
      fetchBookings();
    } else if (!user) {
      setBookings([]);
      setLoading(false);
    }
  }, [user, role, fetchBookings]);

  return { bookings, loading, confirmBooking, completeBooking, cancelBooking, refresh: fetchBookings };
};
