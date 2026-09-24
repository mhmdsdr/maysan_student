import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mlmsfucvwzswtifklicv.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_KEY ||
  'sb_publishable_EMj2cEyjPZUQ7Pf2TqjjUQ_5T64_SL9';

export const supabase = createClient(supabaseUrl, supabaseKey);
