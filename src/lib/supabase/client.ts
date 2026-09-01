import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export type GoodCallSupabaseClient = SupabaseClient<Database>;

export const supabaseClient: GoodCallSupabaseClient | undefined =
  supabaseUrl === undefined ||
  supabaseUrl.length === 0 ||
  supabasePublishableKey === undefined ||
  supabasePublishableKey.length === 0
    ? undefined
    : createClient<Database>(supabaseUrl, supabasePublishableKey, {
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: false,
          persistSession: false,
        },
      });
