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
* @file   payment.tsx
* @author Anthony Kung <hi@anth.dev> (anth.dev)
* @date   Created on 04/17/2024 16:43:30
*/

import { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export default function Payment({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (session) getProfile()
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`balance`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
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

  const handleSubmit = async () => {
    // Add your code here
    Alert.alert('Payment', 'Payment submitted successfully');
  };

  return (
    <>
      <View style={{ padding: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginBottom: 5 }}>Balance</Text>
          <Text>$ {balance.toFixed(2)}</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginBottom: 5 }}>Username</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              borderRadius: 5,
            }}
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholder="Enter the username of the person you want to pay"
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginBottom: 5 }}>Amount</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              borderRadius: 5,
            }}
            value={amount}
            onChangeText={(text) => setAmount(text)}
            placeholder="Enter amount"
            keyboardType="numeric"
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginBottom: 5 }}>Comment</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              borderRadius: 5,
              height: 100,
            }}
            value={comment}
            onChangeText={(text) => setComment(text)}
            placeholder="Add a note to your payment"
            multiline
          />
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: '#008080',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
          }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}