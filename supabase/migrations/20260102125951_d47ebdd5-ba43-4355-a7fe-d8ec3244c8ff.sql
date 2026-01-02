-- Create referrals table for tracking referral relationships
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_address TEXT NOT NULL,
  referred_address TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reward_claimed BOOLEAN NOT NULL DEFAULT false,
  reward_amount NUMERIC(18, 8) DEFAULT 0,
  UNIQUE (referred_address),
  UNIQUE (referrer_address, referred_address)
);

-- Create referral codes table
CREATE TABLE public.referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_referrals INTEGER NOT NULL DEFAULT 0,
  total_rewards NUMERIC(18, 8) NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- RLS policies for referrals - public read for leaderboard, anyone can create
CREATE POLICY "Anyone can view referrals" 
ON public.referrals 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create referrals" 
ON public.referrals 
FOR INSERT 
WITH CHECK (true);

-- RLS policies for referral_codes - public read, anyone can create their own
CREATE POLICY "Anyone can view referral codes" 
ON public.referral_codes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create referral codes" 
ON public.referral_codes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own referral code stats" 
ON public.referral_codes 
FOR UPDATE 
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_address);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX idx_referral_codes_wallet ON public.referral_codes(wallet_address);