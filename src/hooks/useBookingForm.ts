import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js';

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
      // 오너가 직접 막은 시간(user_id === owner_id)만 조회하여 '예약 불가'로 설정
      // 일반 고객의 예약은 조회하지 않음 -> 따라서 중복 신청(대기) 가능
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('owner_id', ownerId)
        .eq('user_id', ownerId) 
        .eq('booking_date', formatLocalDate(date))
        .neq('status', 'cancelled');
      
      if (error) throw error;
      if (data) {
        const blockedTimes = data.map(b => b.booking_time);
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
        booking_date: formatLocalDate(date),
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
