import { useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const useAuthActions = () => {
  const signInWithKakao = useCallback(async () => {
    // 해시나 토큰이 붙지 않은 순수한 현재 페이지 경로만 추출합니다.
    const redirectUrl = window.location.origin + window.location.pathname;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: redirectUrl, // 깔끔한 경로로 리다이렉트
      },
    });
    if (error) {
      console.error('Error signing in with Kakao:', error);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  return { signInWithKakao, signOutUser };
};