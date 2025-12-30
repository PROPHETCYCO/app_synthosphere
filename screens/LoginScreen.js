// screens/LoginScreen.js
import { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://backend-test-1-jn83.onrender.com/api/users/login';

export default function LoginScreen() {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { isAuthenticated, login } = useContext(AuthContext);
    const navigation = useNavigation();

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrPhone, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

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
            {/* 3D CARD */}
            <View style={styles.card}>
                <Text style={styles.title}>Login Here</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={18} color="#000000ff" />
                    <TextInput
                        placeholder="Email or Phone"
                        placeholderTextColor="#000000ff"
                        value={emailOrPhone}
                        onChangeText={setEmailOrPhone}
                        style={styles.input}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={18} color="#000000ff" />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#000000ff"
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: 'rgba(14, 18, 85, 1)' ,
    },

    /* 3D CARD STYLE */
    card: {
        backgroundColor: '#dcdfecff',
        borderRadius: 20,
        padding: 24,

        // iOS Shadow
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 10 },
        
        // shadowRadius: 15,

        // Android Shadow
        // elevation: 12,
    },

    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000000ff',
        textAlign: 'center',
        marginBottom: 28,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 239, 239, 0.15)',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 16,
        height: 48,
        backgroundColor: 'rgba(16, 34, 113, 0.20)',
    },

    input: {
        flex: 1,
        marginLeft: 8,
        color: '#000000ff',
    },

    button: {
        backgroundColor: '#b53f96',
        height: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },

    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
