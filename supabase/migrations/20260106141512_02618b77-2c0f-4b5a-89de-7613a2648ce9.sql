-- Drop overly permissive policies on referrals table
DROP POLICY IF EXISTS "Anyone can view referrals" ON public.referrals;
DROP POLICY IF EXISTS "Anyone can create referrals" ON public.referrals;

-- Drop overly permissive policies on referral_codes table
DROP POLICY IF EXISTS "Anyone can view referral codes" ON public.referral_codes;
DROP POLICY IF EXISTS "Anyone can create referral codes" ON public.referral_codes;
DROP POLICY IF EXISTS "Users can update their own referral code stats" ON public.referral_codes;

-- Create restrictive policies that block all direct client access
-- Data will only be accessible through the Edge Function using service role key

-- referrals table: No public access
CREATE POLICY "No direct access to referrals"
ON public.referrals
FOR ALL
USING (false)
WITH CHECK (false);

-- referral_codes table: No public access  
CREATE POLICY "No direct access to referral_codes"
ON public.referral_codes
FOR ALL
USING (false)
WITH CHECK (false);

-- Create atomic increment function for referral counts
CREATE OR REPLACE FUNCTION public.increment_referral_count(p_wallet_address TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE referral_codes 
  SET total_referrals = total_referrals + 1
  WHERE wallet_address = p_wallet_address;
END;
$$;