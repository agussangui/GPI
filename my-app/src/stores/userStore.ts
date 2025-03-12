import { writable } from 'svelte/store';
import type { Session } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

interface UserStore {
    authUser: User | null;
    session: Session | null;
}

export const userStore = writable<UserStore>({
    authUser: null,
    session: null,
});
