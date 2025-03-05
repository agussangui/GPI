// import { writable } from 'svelte/store';
// import { supabase } from '$lib/supabase';
// import type { User } from '@supabase/supabase-js';
// import { browser } from '$app/environment';  // Import for detecting the browser environment

// // Store to track the user state
// export const user = writable<User | null>(null);

// // Function to initialize the auth state
// export async function initializeAuth() {
//     if (browser) {  // Only run in the browser, avoid server-side code execution
//         // Check if we have a session stored in localStorage
//         const storedUser = localStorage.getItem('user');
        
//         if (storedUser) {
//             // If user data exists in localStorage, parse and set the user in the store
//             user.set(JSON.parse(storedUser));
//         } else {
//             // Otherwise, get the session from Supabase
//             const { data, error } = await supabase.auth.getSession();

//             if (error) {
//                 console.error('Error getting session:', error);
//                 return;
//             }

//             // Set user data in store
//             user.set(data.session?.user || null);
            
//             // Persist the user session in localStorage
//             if (data.session?.user) {
//                 localStorage.setItem('user', JSON.stringify(data.session.user));
//             }
//         }
//     }
// }

// // Listen for auth state changes
// supabase.auth.onAuthStateChange((event, session) => {
//     console.log('Auth state changed:', event, session);

//     if (browser) {  // Only run in the browser
//         if (session?.user) {
//             // Update user in the store and persist it
//             user.set(session.user);
//             localStorage.setItem('user', JSON.stringify(session.user));
//         } else {
//             // Remove user from the store and localStorage when logged out
//             user.set(null);
//             localStorage.removeItem('user');
//         }
//     }
// });

// // Initialize auth state on load
// initializeAuth();
