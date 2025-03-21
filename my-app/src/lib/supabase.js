/**
 * ⚠️ DEPRECATED - DO NOT USE DIRECTLY ⚠️
 * 
 * This client does not handle cookies properly for authentication.
 * 
 * Instead:
 * - In server routes (+page.server.ts, +server.ts), use: event.locals.supabase
 * - In client components, use: $page.data.supabase or import from the layout props
 * 
 * The proper clients are set up in:
 * - src/hooks.server.ts (for server)
 * - src/routes/+layout.ts (for client)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// This client won't maintain sessions properly! Use with caution.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
