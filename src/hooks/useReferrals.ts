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

  const generateCode = (address: string): string => {
    // Generate a unique code based on wallet address
    const hash = address.slice(2, 10).toUpperCase();
    return `FCBC-${hash}`;
  };

  const fetchOrCreateReferralCode = useCallback(async () => {
    if (!walletAddress) return;
    
    setReferralData(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Check if user already has a referral code
      const { data: existingCode, error: fetchError } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('wallet_address', walletAddress)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching referral code:', fetchError);
        setReferralData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      if (existingCode) {
        setReferralData({
          code: existingCode.code,
          totalReferrals: existingCode.total_referrals,
          totalRewards: Number(existingCode.total_rewards),
          isLoading: false,
        });
        return;
      }

      // Create new referral code
      const newCode = generateCode(walletAddress);
      const { data: newCodeData, error: createError } = await supabase
        .from('referral_codes')
        .insert({
          wallet_address: walletAddress,
          code: newCode,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating referral code:', createError);
        setReferralData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      setReferralData({
        code: newCodeData.code,
        totalReferrals: newCodeData.total_referrals,
        totalRewards: Number(newCodeData.total_rewards),
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
      // Check if this user has already been referred
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('id')
        .eq('referred_address', walletAddress)
        .maybeSingle();

      if (existingReferral) {
        toast.error('This wallet has already been referred');
        return false;
      }

      // Find the referrer by code
      const { data: referrerData, error: referrerError } = await supabase
        .from('referral_codes')
        .select('wallet_address')
        .eq('code', referralCode)
        .maybeSingle();

      if (referrerError || !referrerData) {
        toast.error('Invalid referral code');
        return false;
      }

      if (referrerData.wallet_address === walletAddress) {
        toast.error('You cannot refer yourself');
        return false;
      }

      // Create the referral
      const { error: insertError } = await supabase
        .from('referrals')
        .insert({
          referrer_address: referrerData.wallet_address,
          referred_address: walletAddress,
          referral_code: referralCode,
        });

      if (insertError) {
        console.error('Error creating referral:', insertError);
        toast.error('Failed to submit referral');
        return false;
      }

      // Update referrer's stats by incrementing total_referrals
      const { data: currentStats } = await supabase
        .from('referral_codes')
        .select('total_referrals')
        .eq('wallet_address', referrerData.wallet_address)
        .single();
      
      if (currentStats) {
        await supabase
          .from('referral_codes')
          .update({ total_referrals: currentStats.total_referrals + 1 })
          .eq('wallet_address', referrerData.wallet_address);
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
