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
* @file   home.tsx
* @author Anthony Kung <hi@anth.dev> (anth.dev)
* @date   Created on 04/16/2024 19:14:58
*/

/// <reference types="nativewind/types" />

import { useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, Animated, Pressable } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { comparePassword } from '@/lib/security';

export default function Home({ route, navigation }: any) {

  return (
    <>
      <View className="container">
        <Image source={require('@/../assets/MeowPay Transparent.png')} />
        <Text>Welcome to MeowPay</Text>
        <Button title="Logout" onPress={async () => {
          await SecureStore.deleteItemAsync('username');
          await SecureStore.deleteItemAsync('password');
          navigation.navigate('Login');
        }} />
      </View>
    </>
  );
}