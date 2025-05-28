import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ffzwzzramtduivskoynx.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmend6enJhbXRkdWl2c2tveW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTg5NTksImV4cCI6MjA2MzU3NDk1OX0.Fg1YdvLhBDFF108UaflycfBHt48S7-7bB_iAdXLTBAI';

export const supabase = createClient(supabaseUrl, supabaseKey);
