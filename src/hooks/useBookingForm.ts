import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js';

const getLocalDateString = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

export const useBookingForm = (user: User | null, ownerId: string) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  const [bookingNote, setBookingNote] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);

  const fetchReserved = useCallback(async () => {
    if (!date || !ownerId) return;
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_time, service_name')
        .eq('owner_id', ownerId)
        .eq('booking_date', getLocalDateString(date))
        .neq('status', 'cancelled');
      
      if (error) throw error;
      if (data) {
        // '🚫'가 포함된 (오너가 직접 블록한) 시간만 reservedTimes에 저장
        const blockedTimes = data
          .filter(b => b.service_name?.includes('🚫'))
          .map(b => b.booking_time);
        setReservedTimes(blockedTimes);
      }
    } catch (error) {
      console.error('Error fetching reserved times:', error);
    }
  }, [date, ownerId]);

  useEffect(() => {
    fetchReserved();
  }, [fetchReserved]);

  const submitBooking = async () => {
    if (!user || !date || !selectedHour || !ownerId) {
        return { success: false, error: '필수 입력 사항이 누락되었습니다.' };
    }
    
    const fullTime = `${selectedHour}:${selectedMinute}`;
    if (reservedTimes.includes(fullTime)) {
        return { success: false, error: '이미 예약된 시간입니다.' };
    }

    setSubmitLoading(true);
    try {
      // 연락처 확인 및 업데이트 로직
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', user.id)
        .single();
      
      if (!profile?.phone) {
        const phoneInput = window.prompt("연락처를 입력해주세요:");
        if (!phoneInput) {
            setSubmitLoading(false);
            return { success: false, error: '연락처 입력이 필요합니다.' };
        }
        await supabase.from('profiles').update({ phone: phoneInput }).eq('id', user.id);
      }

      const { error } = await supabase.from('bookings').insert([{
        user_id: user.id, 
        owner_id: ownerId, 
        booking_date: getLocalDateString(date),
        booking_time: fullTime, 
        service_name: bookingNote, 
        status: 'pending'
      }]);

      if (error) throw error;
      
      setSelectedHour(''); 
      setBookingNote('');
      await fetchReserved(); // 예약 완료 후 예약된 시간 목록 새로고침
      
      return { success: true };
    } catch (e: any) { 
      return { success: false, error: e.message }; 
    } finally { 
      setSubmitLoading(false); 
    }
  };

  return {
    date,
    setDate,
    selectedHour,
    setSelectedHour,
    selectedMinute,
    setSelectedMinute,
    bookingNote,
    setBookingNote,
    submitLoading,
    reservedTimes,
    submitBooking
  };
};
