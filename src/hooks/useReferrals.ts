import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ReferralData {
  code: string | null;
  totalReferrals: number;
  totalRewards: number;
  isLoading: boolean;
}

export function useReferrals(walletAddress: string | undefined) {
  const [referralData, setReferralData] = useState<ReferralData>({
    code: null,
    totalReferrals: 0,
    totalRewards: 0,
    isLoading: false,
  });

  const fetchOrCreateReferralCode = useCallback(async () => {
    if (!walletAddress) return;
    
    setReferralData(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('referrals', {
        body: {
          action: 'getOrCreateCode',
          walletAddress,
        },
      });

      if (error) {
        console.error('Error fetching referral code:', error);
        setReferralData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      if (data.error) {
        console.error('API error:', data.error);
        setReferralData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      setReferralData({
        code: data.code,
        totalReferrals: data.totalReferrals,
        totalRewards: data.totalRewards,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error in referral code operation:', error);
      setReferralData(prev => ({ ...prev, isLoading: false }));
    }
  }, [walletAddress]);

  const submitReferral = useCallback(async (referralCode: string) => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('referrals', {
        body: {
          action: 'submitReferral',
          walletAddress,
          referralCode,
        },
      });

      if (error) {
        console.error('Error submitting referral:', error);
        toast.error('Failed to submit referral');
        return false;
      }

      if (data.error) {
        toast.error(data.error);
        return false;
      }

      toast.success('Referral submitted successfully!');
      return true;
    } catch (error) {
      console.error('Error submitting referral:', error);
      toast.error('Failed to submit referral');
      return false;
    }
  }, [walletAddress]);

  const getReferralLink = useCallback(() => {
    if (!referralData.code) return '';
    return `${window.location.origin}?ref=${referralData.code}`;
  }, [referralData.code]);

  const copyReferralLink = useCallback(() => {
    const link = getReferralLink();
    if (link) {
      navigator.clipboard.writeText(link);
      toast.success('Referral link copied!');
    }
  }, [getReferralLink]);

  useEffect(() => {
    if (walletAddress) {
      fetchOrCreateReferralCode();
    }
  }, [walletAddress, fetchOrCreateReferralCode]);

  // Check for referral code in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode && walletAddress) {
      // Store the referral code to be submitted later
      localStorage.setItem('pendingReferral', refCode);
    }
  }, [walletAddress]);

  return {
    ...referralData,
    getReferralLink,
    copyReferralLink,
    submitReferral,
    refetchCode: fetchOrCreateReferralCode,
  };
}
