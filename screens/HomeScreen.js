// screens/HomeScreen.js
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

HomeScreen.navigationOptions = {
  headerLeft: ({ navigation }) => (
    <Pressable onPress={() => navigation.toggleDrawer()}>
      <Ionicons name="menu" size={24} />
    </Pressable>
  ),
};