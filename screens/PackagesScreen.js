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
     {
      name: "Teacher Course",
      price: " 11800 ",
       subcription: "One year",
      points: "10000",
      paymentUrl: "https://rzp.io/rzp/0tfCXyMC",
      features: [
        "A To Z Advance Crypto Knowledge",

        "Pro Buy/Sell On Centralized Exchange",

        "Advance Crypto SIP Guide",

        "Advance Portfolio Management",

        "Spot & Future Trading Call (6 Months)",

        "Advance Fundamental Analysis, Technical Analysis",

        "Online 27 Videos",

        "Risk Management Strategy",

        "Regular PNL Strategy",

        "Basic Liquidation Strategy",
        "Gem Coin Finding Strategy",
        "Premium Future Trading Strategy",

        "Premium Portfolio Management Strategy",

        "Five Long-Term Holding Coins Name",

        "Trading Fund Management Strategy",

        "A To Z Advance Fundamental Analysis, Technical Analysis",

        "Whales Wallet Tracking",

        "Crypto Taxation",

        "Crypto Rules & Knowledge",

        "DEX & CEX Arbitrage Model",
      ],
    },
       {
      name: "Pro Teacher Course",
      price: " 59000",
      subcription: "One year",
      points: "25000",
      paymentUrl: "https://rzp.io/rzp/l0v8sIii",
      features: [
        "Advance Crypto SIP Guide",
"Advance Portfolio Management",
"Spot & Future Trading Call (12 Months)",
"Advance Fundamental Analysis, Technical Analysis",
"Online 30 Videos",
"Risk Management Strategy",
"Regular PNL Strategy",
"Basic Liquidation Strategy",
"Gem Coin Finding Strategy",
"Premium Future Trading Strategy",
"Premium Portfolio Management Strategy",
"Five Long-Term Holding Coins Name",
"Trading Fund Management Strategy",
"A To Z Advance Fundamental Analysis, Technical Analysis",
"Whales Wallet Tracking",
"Crypto Taxation",
"Crypto Rules & Knowledge",
"Dex & Cex Arbitrage Model",
"Monthly 2% Scholarship"
      ],
    },
     {
      name: "Monthly Subscription",
      price: " 944",
      points: "800",
      paymentUrl: "https://rzp.io/rzp/yx0C4LX",
      gold: true,
      features: [
        "Monthly Trading Guidance",
        "Monthly Special Classes",
        "Expert Advice",
        "Two Coin Suggestion",
        "One Special Call",
        "Trade Call Signals(1 Month)"
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
                    <View style={styles.cardHeader}>
                        <Text style={styles.title}>{course.name}</Text>

                        <Text style={styles.price}>
                            ₹{course.price} (Incl. GST)
                        </Text>
                        </View>
                        <View style={{marginBottom: 10, flexDirection: 'column', alignItems: 'center'}}>
                        <Text style={styles.points}>
                            🌟 {course.points} Points
                        </Text>

                        {course.subcription && (
                            <Text style={styles.subscription}>
                                {course.subcription} Subscription
                            </Text>
                        )}
                        </View>

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
        fontSize: 20,
        fontWeight: '700',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        marginTop: 6,
        fontWeight: '700',
    },
    points: {
        
        color: '#ffae42',
        fontWeight: '700',
        marginTop: 4,
        fontSize: 20,
    },
    subscription: {
        fontWeight: '600',
        marginVertical: 6,
        fontSize: 20,
        color: '#1e2097ff',
    },
    feature: {
        marginTop: 4,
        fontSize: 17,
    },
    seeMore: {
        marginTop: 8,
        color: '#2563EB',
        fontWeight: '600',
    },
    enrollButton: {
        backgroundColor: '#b53f96',
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