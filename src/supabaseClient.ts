import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://vvtibvjudvdwarssjjsl.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGlidmp1ZHZkd2Fyc3NqanNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzNTQ4MzcsImV4cCI6MjAzNDkzMDgzN30.-oAczYGRHHPIi6HQ3fF6WoxZOAtmz7IEFpOZDoDvG7E'
);
console.log(supabase);
