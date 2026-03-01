import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://upomdutpizmoranesiax.supabase.co';
const supabaseAnonKey = 'sb_publishable_TdOCwT8AMqAaY_2AE8-w2A_Nm_NM5_c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
