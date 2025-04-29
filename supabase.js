// supabase.js
import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and anon public key
const SUPABASE_URL = 'https://mpgjvpykqbyvplncfqhh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wZ2p2cHlrcWJ5dnBsbmNmcWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4Nzc4NTcsImV4cCI6MjA2MTQ1Mzg1N30.BSAhBMul1A4IzU-OHC7JYJ06OSvrAt4VTPJk857rtfE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
