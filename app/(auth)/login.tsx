import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function login() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });
      
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("OAuth error:", error);
    }
  };
  return (
    <View style={styles.container}>
      {/* Brand Section */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={32} color={Colors.PRIMARY} />
        </View>
        <Text style={styles.appName}>Spotlight</Text>
        <Text style={styles.tagline}>don't miss anything</Text>
      </View>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("@/assets/images/login.png")}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      {/* Login Section */}
      <View style={styles.loginSection}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleGoogleSignIn}
          style={styles.googleButton}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={Colors.SURFACE} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
