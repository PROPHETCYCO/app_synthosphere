import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Pressable,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const courses = [
    {
        name: 'Learner Course',
        price: '1770',
        points: '1500',
        subcription: 'One Month',
        features: [
            'Basic Crypto Knowledge',
            'Basic Buy/Sell On Centralised Exchange',
            'Crypto SIP Guide',
            'Portfolio Management Guide',
            'One Month Spot Call',
            'Basic FA & TA',
            'Online 17 Videos',
        ],
    },
    {
        name: 'Master Course',
        price: '3540',
        points: '3000',
        subcription: 'Three Months',
        features: [
            'Advance Crypto Knowledge',
            'Pro Buy/Sell On Centralised Exchange',
            'Advance Crypto SIP Guide',
            'Advance Portfolio Management',
            'Spot & Future Trading Calls',
            'Advanced FA & TA',
            'Online 22 Videos',
        ],
    },
    {
        name: 'Pro Master Course',
        price: '7080',
        points: '6000',
        subcription: 'Six Months',
        features: [
            'A to Z Advance Crypto Knowledge',
            'Pro Buy/Sell On Centralised Exchange',
            'Advanced SIP Guide',
            'Advanced Portfolio Management',
            'Spot & Future Trading Calls',
            'Risk Management Strategy',
            'Online 25 Videos',
            'Premium Trading Strategies',
        ],
    },
];

export default function PackagesScreen() {
    const navigation = useNavigation();
    const { isAuthenticated, user } = useContext(AuthContext);
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (index) => {
        setExpanded((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleEnroll = (course) => {
        // ❌ Not logged in
        if (!isAuthenticated) {
            Alert.alert(
                'Login Required',
                'Please login before you proceed'
            );
            return;
        }

        // ❌ Logged in but not active
        if (user?.status !== 'active') {
            Alert.alert(
                'Account Not Active',
                'User not active, please contact your admin'
            );
            return;
        }

        // ✅ Allowed
        navigation.navigate('Checkout', { course });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {courses.map((course, index) => {
                const isExpanded = expanded[index];
                const visibleFeatures = isExpanded
                    ? course.features
                    : course.features.slice(0, 5);

                return (
                    <View key={index} style={styles.card}>
                        <Text style={styles.title}>{course.name}</Text>

                        <Text style={styles.price}>
                            ₹ {course.price} (Incl. GST)
                        </Text>

                        <Text style={styles.points}>
                            🌟 {course.points} Points
                        </Text>

                        {course.subcription && (
                            <Text style={styles.subscription}>
                                {course.subcription} Subscription
                            </Text>
                        )}

                        {visibleFeatures.map((feature, i) => (
                            <Text key={i} style={styles.feature}>
                                • {feature}
                            </Text>
                        ))}

                        {course.features.length > 5 && (
                            <Pressable onPress={() => toggleExpand(index)}>
                                <Text style={styles.seeMore}>
                                    {isExpanded ? 'See Less ▲' : 'See More ▼'}
                                </Text>
                            </Pressable>
                        )}

                        <Pressable
                            style={styles.enrollButton}
                            onPress={() => handleEnroll(course)}
                        >
                            <Text style={styles.enrollText}>Enroll Now</Text>
                        </Pressable>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    price: {
        fontSize: 16,
        marginTop: 6,
    },
    points: {
        color: '#ffae42',
        fontWeight: '600',
        marginTop: 4,
    },
    subscription: {
        fontWeight: '600',
        marginVertical: 6,
    },
    feature: {
        marginTop: 4,
        fontSize: 14,
    },
    seeMore: {
        marginTop: 8,
        color: '#2563EB',
        fontWeight: '600',
    },
    enrollButton: {
        backgroundColor: '#2563EB',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 14,
    },
    enrollText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 15,
    },
});