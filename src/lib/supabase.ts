import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://upomdutpizmoranesiax.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb21kdXRwaXptb3JhbmVzaWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMzE4NjYsImV4cCI6MjA4NzkwNzg2Nn0.6vSAGHiHw_OtTBXQpm2ijeVoi9n14ewNtRrFTW-hlmk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
