/**
* Copyright (c) 2024 Anthony Kung (anth.dev)
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     https://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* @file   dashboard.tsx
* @author Anthony Kung <hi@anth.dev> (anth.dev)
* @date   Created on 04/17/2024 16:58:06
*/

import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Avatar } from 'react-native-elements';
import { Session } from '@supabase/supabase-js';

export default function Dashboard({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (session) getProfile()
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`user_metadata, balance`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.user_metadata.full_name)
        setAvatarUrl(data.user_metadata.avatar_url)
        setBalance(data.balance)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Avatar
            rounded
            source={avatarUrl as any}
            size="large"
          />
          <View style={styles.userInfoText}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.quota}>Balance: {balance.toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Link href="/credits">
            <Text style={styles.addButtonLabel}>Add Credits</Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Link href="/payment">
            <Text style={styles.addButtonLabel}>Make Payment</Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.discordButton}>
          <Link href="https://discord.com/oauth2/authorize?client_id=1230061466590380104">
            <Text style={styles.discordButtonLabel}>Discord Bot</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfoText: {
    marginLeft: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quota: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  discordButton: {
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  discordButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});