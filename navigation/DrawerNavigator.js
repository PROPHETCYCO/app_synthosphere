// // navigation/DrawerNavigator.js
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { Image, Pressable } from 'react-native';
// import HomeScreen from '../screens/HomeScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// //import SettingsScreen from '../screens/SettingsScreen';

// const Drawer = createDrawerNavigator();

// export default function DrawerNavigator() {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       screenOptions={({ navigation }) => ({
//         headerRight: () => (
//           <Pressable
//             onPress={() => navigation.navigate('Profile')}
//             style={{ marginRight: 16 }}
//           >
//             <Image
//               source={require('../assets/userphoto.png')}
//               style={{
//                 width: 30,
//                 height: 30,
//                 borderRadius: 18,
//                 marginTop: 4,
//               }}
//             />
//           </Pressable>
//         ),
//       })}
//     >
//       <Drawer.Screen name="Home" component={HomeScreen} />
//       {/* <Drawer.Screen name="Profile" component={ProfileScreen} /> */}
//       {/* <Drawer.Screen name="Settings" component={SettingsScreen} /> */}
//     </Drawer.Navigator>
//   );
// }

// navigation/DrawerNavigator.js
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import HomeScreen from '../screens/HomeScreen';
import { Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Drawer = createDrawerNavigator();

function HeaderProfileButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate('Profile')}
      style={{ marginRight: 16 }}
    >
      <Image
        source={require('../assets/userphoto.png')}
        style={{ width: 30, height: 30, borderRadius: 15 }}
      />
    </Pressable>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerRight: () => <HeaderProfileButton />,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Signup" component={SignupScreen} />
    </Drawer.Navigator>
  );
}