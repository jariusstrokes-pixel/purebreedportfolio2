import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.89.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { action, walletAddress, referralCode } = await req.json();

    // Validate wallet address format (basic validation)
    if (walletAddress && !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return new Response(
        JSON.stringify({ error: 'Invalid wallet address format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'getOrCreateCode': {
        if (!walletAddress) {
          return new Response(
            JSON.stringify({ error: 'Wallet address required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check if user already has a referral code
        const { data: existingCode, error: fetchError } = await supabase
          .from('referral_codes')
          .select('*')
          .eq('wallet_address', walletAddress)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching referral code:', fetchError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch referral code' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (existingCode) {
          return new Response(
            JSON.stringify({ 
              code: existingCode.code,
              totalReferrals: existingCode.total_referrals,
              totalRewards: Number(existingCode.total_rewards),
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create new referral code
        const hash = walletAddress.slice(2, 10).toUpperCase();
        const newCode = `FCBC-${hash}`;

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
          return new Response(
            JSON.stringify({ error: 'Failed to create referral code' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Created referral code ${newCode} for wallet ${walletAddress}`);

        return new Response(
          JSON.stringify({
            code: newCodeData.code,
            totalReferrals: newCodeData.total_referrals,
            totalRewards: Number(newCodeData.total_rewards),
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'submitReferral': {
        if (!walletAddress || !referralCode) {
          return new Response(
            JSON.stringify({ error: 'Wallet address and referral code required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check if this user has already been referred
        const { data: existingReferral } = await supabase
          .from('referrals')
          .select('id')
          .eq('referred_address', walletAddress)
          .maybeSingle();

        if (existingReferral) {
          return new Response(
            JSON.stringify({ error: 'This wallet has already been referred' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Find the referrer by code
        const { data: referrerData, error: referrerError } = await supabase
          .from('referral_codes')
          .select('wallet_address')
          .eq('code', referralCode)
          .maybeSingle();

        if (referrerError || !referrerData) {
          return new Response(
            JSON.stringify({ error: 'Invalid referral code' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (referrerData.wallet_address.toLowerCase() === walletAddress.toLowerCase()) {
          return new Response(
            JSON.stringify({ error: 'You cannot refer yourself' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
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
          return new Response(
            JSON.stringify({ error: 'Failed to submit referral' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Update referrer's stats atomically
        const { error: updateError } = await supabase.rpc('increment_referral_count', {
          p_wallet_address: referrerData.wallet_address
        });

        // Fallback if RPC doesn't exist
        if (updateError) {
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
        }

        console.log(`Referral submitted: ${walletAddress} referred by ${referrerData.wallet_address}`);

        return new Response(
          JSON.stringify({ success: true, message: 'Referral submitted successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'getLeaderboard': {
        // Return aggregated leaderboard data without exposing individual wallet addresses
        const { data: leaderboard, error: leaderboardError } = await supabase
          .from('referral_codes')
          .select('code, total_referrals, total_rewards')
          .order('total_referrals', { ascending: false })
          .limit(10);

        if (leaderboardError) {
          console.error('Error fetching leaderboard:', leaderboardError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch leaderboard' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Mask wallet addresses - only return referral codes and stats
        return new Response(
          JSON.stringify({ leaderboard }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'getMyStats': {
        if (!walletAddress) {
          return new Response(
            JSON.stringify({ error: 'Wallet address required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get user's own stats only
        const { data: stats, error: statsError } = await supabase
          .from('referral_codes')
          .select('code, total_referrals, total_rewards')
          .eq('wallet_address', walletAddress)
          .maybeSingle();

        if (statsError) {
          console.error('Error fetching stats:', statsError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch stats' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ stats }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in referrals function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
