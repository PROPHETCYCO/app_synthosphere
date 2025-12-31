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


      {/* Course Card */}
      <View style={styles.courseCard}>
        <View style={styles.priceRow}>
          <Text style={styles.courseLabel}>Selected Course</Text>
          <Text style={styles.courseName}>{course.name}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <Text style={styles.price}>₹ {course.price}</Text>
        </View>
      </View>

      {/* Billing Section */}
      <Text style={styles.sectionTitle}>Billing Details</Text>

      <View style={styles.formCard}>
        <TextInput
          style={[styles.input, styles.disabled]}
          value={user.name}
          editable={false}
          placeholder="Full Name"
        />

        <TextInput
          style={[styles.input, styles.disabled]}
          value={user.phone}
          editable={false}
          placeholder="Phone"
        />

        <TextInput
          style={[styles.input, styles.disabled]}
          value={user.email}
          editable={false}
          placeholder="Email"
        />

        <TextInput
          style={[styles.input, styles.address]}
          placeholder="Billing Address"
          placeholderTextColor="#4f4d4dff"
          value={address}
          onChangeText={setAddress}
          multiline
        />
      </View>

      {/* Pay Button */}
      <Pressable
        style={({ pressed }) => [
          styles.payButton,
          pressed && { opacity: 0.85 },
        ]}
        onPress={handleCheckout}
        disabled={loading}
      >
        <Text style={styles.payText}>
          {loading ? 'Processing Payment...' : `Pay ₹ ${course.price}`}
        </Text>
      </Pressable>

      <Text style={styles.footerText}>
        100% secure payment powered by Razorpay
      </Text>
    </ScrollView>
  );


}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4F6FA',
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 18,
    color: '#111827',
  },

  courseCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  courseLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 6,
  },

  courseName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#142fb8ff',
    marginBottom: 14,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priceLabel: {
    fontSize: 15,
    color: '#374151',
  },

  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#8630bf',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
    color: '#111827',
  },

  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },

  input: {
    borderWidth: 1,
    borderColor: '#d3d8e2ff',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 14,
    backgroundColor: '#f2eeeeff',
    color: '#020306ff',
  },

  disabled: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },

  address: {
    height: 90,
    textAlignVertical: 'top',
    color: '#000000',
  },

  payButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
  },

  payText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },

  footerText: {
    textAlign: 'center',
    marginTop: 14,
    fontSize: 13,
    color: '#6B7280',
  },

});