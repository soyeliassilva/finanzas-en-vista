
import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = 'https://wuwlgfesqgjuymkwbcdb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1d2xnZmVzcWdqdXlta3diY2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMDQ3MjgsImV4cCI6MjA1OTc4MDcyOH0.BJjJyDITi9swHgYmgFTIuM95Ov7Mz5Ta1asSDrMfe7w';

export const supabase = createClient(supabaseUrl, supabaseKey);
