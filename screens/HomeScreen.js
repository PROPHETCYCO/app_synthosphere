// screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Banner Section */}
      <View style={styles.banner}>
        <View style={styles.content}>
          {/* Left Content */}
          <View style={styles.textContainer}>
            <Text style={styles.heading}>Find your course</Text>
            <Text style={styles.heading}>Change your life</Text>
            <Text style={styles.paragraph}>
              Discover Synthosphere Academy: Elevate Your Knowledge. Offering
              Expert-Led Programs, Innovative Resources and a Vibrant Community,
              Empowering You to Thrive in the World of Synthesis and Beyond.
            </Text>
          </View>
          {/* Right Image */}
          <Image
            source={require('../assets/Studying.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
      {/* features */}
      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresHeading}>
          Our Special Features For You
        </Text>
        <View style={styles.featuresGrid}>
          {/* Feature Card 1 */}
          <View style={styles.featureCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(143, 87, 247, 1);' }]}>
              <Image
                source={require('../assets/Book.png')}
                style={styles.featureIcon}
              />
            </View>
            <Text style={styles.cardTitle}>Pro Programs</Text>
            <Text style={styles.cardText}>
              Elite programs for professional skill enhancement and career advancement.
            </Text>
          </View>
          {/* Feature Card 2 */}
          <View style={styles.featureCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(253, 184, 20, 1)' }]}>
              <Image
                source={require('../assets/Frame.png')}
                style={styles.featureIcon}
              />
            </View>
            <Text style={styles.cardTitle}>24/7 Support</Text>
            <Text style={styles.cardText}>
              Around-the-clock assistance and guidance for all academy students.
            </Text>
          </View>
          {/* Feature Card 3 */}
          <View style={styles.featureCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(246, 119, 97, 1)' }]}>
              <Image
                source={require('../assets/Frame1.png')}
                style={styles.featureIcon}
              />
            </View>
            <Text style={styles.cardTitle}>Career Planning</Text>
            <Text style={styles.cardText}>
              Expert guidance to build personalized career paths and goals.
            </Text>
          </View>
          {/* Feature Card 4 */}
          <View style={styles.featureCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(34, 197, 94, 1)' }]}>
              <Image
                source={require('../assets/Frame1.png')}
                style={styles.featureIcon}
              />
            </View>
            <Text style={styles.cardTitle}>Professional Learning</Text>
            <Text style={styles.cardText}>
              Advanced learning opportunities designed for professionals.
            </Text>
          </View>
        </View>
      </View>
      {/* Learning Steps Section */}
      <View style={styles.stepsSection}>
        <Text style={styles.stepsHeading}>Learning Steps For You</Text>
        {/* Step 1 */}
        <View style={styles.steprowcontainer}>
          <View style={styles.stepRow}>
            <View style={styles.stepIconWrap}>
              <Image
                source={require('../assets/IconsStep3.png')}
                style={styles.stepIcon}
              />
            </View>
            <View>
              <Text style={styles.stepTitle}>Create Account</Text>
              <Text style={styles.stepSub}>Have to create an account</Text>
            </View>
          </View>
          {/* Step 2 */}
          <View style={styles.stepRow}>
            <View style={styles.stepIconWrap}>
              <Image
                source={require('../assets/IconsStep2.png')}
                style={styles.stepIcon}
              />
            </View>
            <View>
              <Text style={styles.stepTitle}>Choose Course</Text>
              <Text style={styles.stepSub}>Choose any course</Text>
            </View>
          </View>
          {/* Step 3 */}
          <View style={styles.stepRow}>
            <View style={styles.stepIconWrap}>
              <Image
                source={require('../assets/IconsStep4.png')}
                style={styles.stepIcon}
              />
            </View>
            <View>
              <Text style={styles.stepTitle}>Enjoy Learning</Text>
              <Text style={styles.stepSub}>Buy and enjoy learning</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Why Choose Us Section */}
      <Image
        source={require('../assets/Kids.png')}
        style={styles.chooseImage}
        resizeMode="contain"
      />
      <View style={styles.chooseSection}>
        {/* Points */}
        <View style={styles.choosePoint}>
          <Ionicons name="checkmark-circle" size={30} color="#b223baff" />
          <Text style={styles.choosePointText}>600+ people joined</Text>
        </View>
        <View style={styles.choosePoint}>
          <Ionicons name="checkmark-circle" size={30} color="#2b22c5ff" />
          <Text style={styles.choosePointText}>20+ upcoming courses</Text>
        </View>
        <View style={styles.choosePoint}>
          <Ionicons name="checkmark-circle" size={30} color="#e5da46ff" />
          <Text style={styles.choosePointText}>10+ brand companies</Text>
        </View>
        <View style={styles.choosePoint}>
          <Ionicons name="checkmark-circle" size={30} color="#e54646ff" />
          <Text style={styles.choosePointText}>40+ experienced teachers</Text>
        </View>
        {/* Image */}
      </View>
    </ScrollView>
  );
}
HomeScreen.navigationOptions = {
  headerLeft: ({ navigation }) => (
    <Pressable onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 15 }}>
      <Ionicons name="menu" size={26} color="#000" />
    </Pressable>
  ),
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    backgroundColor: 'rgba(14, 18, 85, 1)',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 20,
    flex: 1,
    alignItems: 'center',
  },
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 40,
  },
  paragraph: {
    color: '#fff',
    fontSize: 16,
    marginTop: 40,
    lineHeight: 24,
    flex: 1,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
  featuresSection: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  featuresHeading: {
    fontSize: 29,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 30,
    color: '#141987ff',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#1d2026ff',
    lineHeight: 18,
  },
  stepsSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  stepsHeading: {
    fontSize: 30,
    fontWeight: '700',
    color: '#101347ff',
    marginBottom: 30,
    flex: 1,
    textAlign: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    backgroundColor: '#f1f2f8ff',
    padding: 15,
    width: '90%',
    borderRadius: 15,
  },
  stepIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 25,
    backgroundColor: '#f1f2f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 40,
  },
  stepIcon: {
    width: 50,
    height: 55,
    resizeMode: 'contain',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  stepSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  stepsImage: {
    width: '100%',
    height: 260,
    marginTop: 30,
  },
  steprowcontainer: {
    flex: 1,
    alignItems: 'center',
  },
  chooseSection: {
    paddingVertical: 20,
    paddingHorizontal: 80,
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  chooseHeading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0E1255',
  },
  choosePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  choosePointText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    color: '#111827',
  },
  chooseImage: {
    width: '100%',
    height: 260,
    marginTop: 30,
  },
});