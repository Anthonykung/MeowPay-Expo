import { Pressable, Text } from 'react-native'
import { makeRedirectUri } from 'expo-auth-session'
import * as QueryParams from 'expo-auth-session/build/QueryParams'
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import "../global.css";

WebBrowser.maybeCompleteAuthSession() // required for web only
const redirectTo = makeRedirectUri()

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url)

  if (errorCode) throw new Error(errorCode)
  const { access_token, refresh_token } = params

  if (!access_token) return

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  })
  if (error) throw error
  return data.session
}

const performOAuth = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  })
  if (error) throw error

  const res = await WebBrowser.openAuthSessionAsync(data?.url ?? '', redirectTo)

  if (res.type === 'success') {
    const { url } = res
    await createSessionFromUrl(url)
  }
}

export default function Auth() {
  // Handle linking into app from email app.
  const url = Linking.useURL()
  if (url) createSessionFromUrl(url)

  return (
    <>
      <Pressable onPress={performOAuth} className='bg-blue-500 rounded-lg p-4'>
        <Text className='text-white'>Sign in with Discord</Text>
      </Pressable>
    </>
  )
}