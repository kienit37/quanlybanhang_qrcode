import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Thiếu thông tin kết nối Supabase! Hãy kiểm tra file .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
