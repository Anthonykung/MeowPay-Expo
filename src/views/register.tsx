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
* @file   register.tsx
* @author Anthony Kung <hi@anth.dev> (anth.dev)
* @date   Created on 04/16/2024 19:20:40
*/

/// <reference types="nativewind/types" />

import { useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, Animated, Pressable } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { hashPassword } from '@/lib/security';

export default function Register({ route, navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setErrorMsg('');
    if (username === '' || password === '') {
      setErrorMsg('Please fill in all fields');
      setLoading(false);
      return;
    }
    try {
      const hashedPassword = await hashPassword(password);
      await SecureStore.setItemAsync('username', username);
      await SecureStore.setItemAsync('password', hashedPassword);
      setLoading(false);
      navigation.navigate('Home');
    } catch (e) {
      setErrorMsg('An error occurred');
      setLoading(false);
    }
  }

  return (
    <>
      <View className="container">
        <Image source={require('@/../assets/MeowPay Transparent.png')} />
        <Text>Register for MeowPay</Text>
        <TextInput
          className='input'
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          className='input'
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />
        <Text>{errorMsg}</Text>
        <Pressable onPress={handleRegister}>
          <Text>Register</Text>
        </Pressable>
        <Text>Already have an account?</Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text>Login</Text>
        </Pressable>
      </View>
    </>
  );
}