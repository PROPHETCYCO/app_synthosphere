import { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'https://backend-test-1-jn83.onrender.com';

export default function CheckoutScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { course } = route.params || {};
    const { user, isAuthenticated } = useContext(AuthContext);

    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            Alert.alert('Login Required', 'Please login to continue');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
            return;
        }

        if (!course) {
            Alert.alert('Error', 'Invalid package selected');
            navigation.goBack();
        }
    }, []);

    const handleCheckout = async () => {
        if (!address) {
            Alert.alert('Error', 'Please enter billing address');
            return;
        }

        try {
            setLoading(true);

            /* 1️⃣ Create order from backend */
            const { data } = await axios.post(
                `${API_URL}/api/users/checkout`,
                {
                    amount: Number(course.price),
                    userId: user.userId,
                    fullname: user.name,
                    phoneno: user.phone,
                    email: user.email,
                    address,
                    packagename: course.name,
                    coursename: 'Crypto Trading Course',
                },
                {
                    timeout: 120000,
                }
            );

            const { order } = data;

            /* 2️⃣ Razorpay options */
            const options = {
                description: course.name,
                image: 'https://synthosphereacademy.com/logo.png',
                currency: 'INR',
                key: 'rzp_test_Rrt6SRaU3EQgQW', // replace with test key if needed
                amount: order.amount,
                name: 'Synthosphere Academy',
                order_id: order.id,
                prefill: {
                    email: user.email,
                    contact: user.phone,
                    name: user.name,
                },
                theme: { color: '#3399cc' },
            };

            /* 3️⃣ Open Razorpay */
            RazorpayCheckout.open(options)
                .then(() => {
                    // ✅ RESET NAVIGATION FIRST
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Main',
                                params: {
                                    screen: 'Home',
                                },
                            },
                        ],
                    });

                    // ✅ OPTIONAL success message
                    setTimeout(() => {
                        Alert.alert(
                            'Payment Successful',
                            'We are processing your enrollment'
                        );
                    }, 300);
                })
                .catch((error) => {
                    console.log('PAYMENT CANCELLED', error);
                    Alert.alert('Payment Cancelled', 'You can try again');
                });
        } catch (error) {
            console.log('CHECKOUT ERROR', error);
            Alert.alert('Error', 'Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Checkout</Text>

            <View style={styles.card}>
                <Text style={styles.label}>
                    Course: <Text style={styles.value}>{course.name}</Text>
                </Text>

                <Text style={styles.label}>
                    Price: <Text style={styles.value}>₹ {course.price}</Text>
                </Text>
            </View>

            <Text style={styles.section}>Billing Details</Text>

            <TextInput
                style={styles.input}
                value={user.name}
                editable={false}
                placeholder="Full Name"
            />

            <TextInput
                style={styles.input}
                value={user.phone}
                editable={false}
                placeholder="Phone"
            />

            <TextInput
                style={styles.input}
                value={user.email}
                editable={false}
                placeholder="Email"
            />

            <TextInput
                style={styles.input}
                placeholder="Billing Address"
                value={address}
                onChangeText={setAddress}
            />

            <Pressable
                style={styles.payButton}
                onPress={handleCheckout}
                disabled={loading}
            >
                <Text style={styles.payText}>
                    {loading ? 'Processing...' : 'Pay Now'}
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
    },
    value: {
        fontWeight: '600',
    },
    section: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    payButton: {
        backgroundColor: '#2563EB',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    payText: {
        color: '#fff',
        fontWeight: '700',
    },
});