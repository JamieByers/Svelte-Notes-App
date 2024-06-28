// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
// const PUBLIC_SUPABASE_URL = import.meta.env.SUPABASE_URL;
// const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY;
const VITE_PUBLIC_SUPABASE_URL = 'https://vvtibvjudvdwarssjjsl.supabase.co';
const VITE_PUBLIC_SUPABASE_ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGlidmp1ZHZkd2Fyc3NqanNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzNTQ4MzcsImV4cCI6MjAzNDkzMDgzN30.-oAczYGRHHPIi6HQ3fF6WoxZOAtmz7IEFpOZDoDvG7E';

export const supabase = createClient(VITE_PUBLIC_SUPABASE_URL, VITE_PUBLIC_SUPABASE_ANON_KEY);
