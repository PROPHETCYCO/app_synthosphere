// screens/LoginScreen.js
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://backend-test-1-jn83.onrender.com/api/users/login';

export default function LoginScreen() {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { isAuthenticated } = useContext(AuthContext);
    const navigation = useNavigation();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        }
    }, [isAuthenticated]);

    const handleLogin = async () => {
        if (!emailOrPhone || !password) {
            Alert.alert('Error', 'Email/Phone and Password are required.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailOrPhone,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // await AsyncStorage.setItem('token', data.token);
            // await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await login(data.token, data.user);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });

            Alert.alert('Success', 'Login successful');
        } catch (error) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={18} color="#6b7280" />
                <TextInput
                    placeholder="Email or Phone"
                    value={emailOrPhone}
                    onChangeText={setEmailOrPhone}
                    style={styles.input}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={18} color="#6b7280" />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <Pressable
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 32,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        height: 48,
    },
    input: {
        flex: 1,
        marginLeft: 8,
    },
    button: {
        backgroundColor: '#2563EB',
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});