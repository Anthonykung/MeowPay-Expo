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
* @file   index.tsx
* @author Anthony Kung <hi@anth.dev> (anth.dev)
* @date   Created on 04/16/2024 23:39:44
*/

import { Link } from "expo-router";
import { Text, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

import Auth from "@/components/Auth";

export default function Page() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
      } else {
        // Do nothing
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/dashboard");
      } else {
        // Do nothing
      }
    });
  }, []);

  return (
    <View className="flex flex-1">
      <View className="flex flex-1 justify-center items-center">
        <Image source={require("@/assets/MeowPay Transparent.png")} className="w-32 h-32" />
        <Text className="text-2xl font-bold">Welcome to MeowPay</Text>
        <Auth />
      </View>
    </View>
  );
}