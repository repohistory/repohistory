'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signin() {
  const supabase = await createClient()

  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.SITE_URL}/auth/callback`,
    }
  })

  if (data.url) {
    return redirect(data.url)
  }

  redirect('/error')
}

export async function signout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  const cookieStore = await cookies()
  cookieStore.delete('provider_token')
  cookieStore.delete('provider_refresh_token')

  redirect('/signin')
}
