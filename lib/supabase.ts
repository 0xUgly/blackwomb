import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zzuuyponibhxtzhwssze.supabase.co/'
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dXV5cG9uaWJoeHR6aHdzc3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MjI1MTYsImV4cCI6MjA1MDI5ODUxNn0.JBll_yTSI66EcTQQh7FC-GURCPliansflIGP_jmHzEA'
if (!supabaseAnonKey) {
    throw new Error('Missing Supabase Anonymous Key. Check your environment variables.');
  }
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    detectSessionInUrl: false,
    autoRefreshToken: false
  }
});






// const supabaseUrl = 'https://uwuqzmecvnmuilzmbmcm.supabase.co';
// const supabaseAnonKey = process.env.SUPABASE_KEY;
// if (!supabaseAnonKey) {
//   throw new Error('Missing Supabase Anonymous Key. Check your environment variables.');
// }