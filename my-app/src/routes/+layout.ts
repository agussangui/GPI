import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
    /**
     * Declare a dependency so the layout can be invalidated, for example, on
     * session refresh.
     */
    depends('supabase:auth')
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    const supabase = isBrowser()
        ? createBrowserClient(supabaseUrl, anonKey, {
            global: {
                fetch,
            },
            cookies: {
                get(key) {
                    const cookies = document.cookie.split('; ')
                    const cookie = cookies.find(c => c.startsWith(`${key}=`))
                    return cookie?.split('=')[1]
                },
                set(key, value, options) {
                    document.cookie = `${key}=${value}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; secure`
                },
                remove(key, options) {
                    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
                }
            }
        })
        : createServerClient(supabaseUrl, anonKey, {
            global: {
                fetch,
            },
            cookies: {
                getAll() {
                    return data.cookies
                },
            },
        })

    // For SSR, we get the session from the server-side data
    // This is important because it prevents flashing on page load
    const serverSession = data.session

    // For client-side, we need to get the session directly
    let clientSession = null
    if (isBrowser()) {
        const { data: sessionData } = await supabase.auth.getSession()
        clientSession = sessionData.session
    }

    // Use server session if available, otherwise use client session
    const session = serverSession || clientSession
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    return { session, supabase, user }
}