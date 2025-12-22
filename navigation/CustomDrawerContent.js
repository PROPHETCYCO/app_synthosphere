// navigation/CustomDrawerContent.js
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      
      {/* HEADER — DISPLAY ONLY */}
      <View style={styles.header}>
        <Image
          source={require('../assets/userphoto.png')}
          style={styles.avatar}
        />

        <View>
          <Text style={styles.name}>Dave Sebek</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Away</Text>
          </View>
        </View>
      </View>

      {/* MENU */}
      <View style={styles.menu}>
        <DrawerItem
          label="Home"
          icon={({ size }) => (
            <Ionicons name="home-outline" size={size} />
          )}
          onPress={() => props.navigation.navigate('Home')}
        />

        <DrawerItem
          label="Projects"
          icon={({ size }) => (
            <Ionicons name="grid-outline" size={size} />
          )}
          onPress={() => {}}
        />

        <DrawerItem
          label="Messages"
          icon={({ size }) => (
            <Ionicons name="chatbubble-outline" size={size} />
          )}
          onPress={() => {}}
        />
      </View>

      {/* SIGN OUT */}
      <View style={styles.footer}>
        <DrawerItem
          label="Sign out"
          icon={({ size }) => (
            <Ionicons name="log-out-outline" size={size} />
          )}
          onPress={() => {}}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: '#1e3272ff',
    padding: 20,
    marginHorizontal: -16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4d4f',
    marginRight: 6,
  },
  statusText: {
    color: '#ccc',
    fontSize: 12,
  },
  menu: {
    marginTop: 8,
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});