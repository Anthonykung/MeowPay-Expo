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
* @file   credits.tsx
* @author Anthony Kung <hi@anth.dev> (anth.dev)
* @date   Created on 04/17/2024 17:20:20
*/
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Session } from '@supabase/supabase-js';
import { CardField, useStripe } from '@stripe/stripe-react-native';

export default function Credit({ session }: { session: Session }) {
  const stripe = useStripe();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Convert amount to cents (Stripe expects the amount in cents)
      const amountInCents = parseFloat(amount) * 100;

      // TODO: Process payment

      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        balance: balance + amountInCents / 100,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) {
        throw error
      }

      Alert.alert('Payment successful', `Your balance is now $${(balance + amountInCents / 100).toFixed(2)}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginBottom: 5 }}>Balance</Text>
          <Text>$ {balance.toFixed(2)}</Text>
        </View>
        <TextInput
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <CardField
          postalCodeEnabled={false}
          style={styles.cardField}
        />
        <Button
          title={loading ? 'Processing...' : 'Pay Now'}
          onPress={handlePayment}
          disabled={loading || !amount}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '100%',
    fontSize: 16,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginBottom: 20,
  },
  button: {
    width: '100%',
  },
});