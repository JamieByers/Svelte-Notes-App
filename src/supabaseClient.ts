// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
const PUBLIC_SUPABASE_URL = import.meta.env.SUPABASE_URL;
const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY;


export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);