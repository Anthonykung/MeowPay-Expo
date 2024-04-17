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
* @file   login.tsx
* @author Anthony Kung <hi@anth.dev> (anth.dev)
* @date   Created on 04/16/2024 19:21:13
*/

/// <reference types="nativewind/types" />

import { useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, Animated, Pressable } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { comparePassword } from '@/lib/security';

export default function Login({ route, navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    if (username === '' || password === '') {
      setErrorMsg('Please fill in all fields');
      setLoading(false);
      return;
    }
    try {
      const storedUsername = await SecureStore.getItemAsync('username');
      const storedPassword = await SecureStore.getItemAsync('password');
      if (storedUsername === null || storedPassword === null) {
        setErrorMsg('No account found');
        setLoading(false);
        return;
      }
      const passwordMatch = await comparePassword(password, storedPassword);
      if (storedUsername === username && passwordMatch) {
        setLoading(false);
        navigation.navigate('Home');
      } else {
        setErrorMsg('Invalid credentials');
        setLoading(false);
      }
    } catch (e) {
      setErrorMsg('An error occurred');
      setLoading(false);
    }
  }

  return (
    <>
      <View className="container">
        <Image source={require('@/../assets/MeowPay Transparent.png')} />
        <Text>Login to MeowPay</Text>
        <TextInput
          className='input'
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          className='input'
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />
        <Text>{errorMsg}</Text>
        <Pressable onPress={handleLogin}>
          <Text>Login</Text>
        </Pressable>
        <Button title="Register" onPress={() => navigation.navigate('Register')} />
      </View>
    </>
  );
}