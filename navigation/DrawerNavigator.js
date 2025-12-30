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
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import CustomDrawerContent from './CustomDrawerContent';
// import HomeScreen from '../screens/HomeScreen';
// import { Image, Pressable } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import LoginScreen from '../screens/LoginScreen';
// import SignupScreen from '../screens/SignupScreen';
// import PackagesScreen from '../screens/PackagesScreen';
// import DashboardScreen from '../screens/DashboardScreen';
// import KycScreen from '../screens/KycScreen';

// const Drawer = createDrawerNavigator();

// function HeaderProfileButton() {
//   const navigation = useNavigation();

//   return (
//     <Pressable
//       onPress={() => navigation.navigate('Profile')}
//       style={{ marginRight: 16 }}
//     >
//       <Image
//         source={require('../assets/userphoto.png')}
//         style={{ width: 30, height: 30, borderRadius: 15 }}
//       />
//     </Pressable>
//   );
// }

// export default function DrawerNavigator() {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         headerRight: () => <HeaderProfileButton />,
//       }}
//     >
//       <Drawer.Screen name="Home" component={HomeScreen} />
//       <Drawer.Screen name="Packages" component={PackagesScreen} options={{ title: 'Packages' }} />
//       <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
//       <Drawer.Screen name="Kyc" component={KycScreen} options={{ title: 'KYC' }} />
//       <Drawer.Screen name="Login" component={LoginScreen} />
//       <Drawer.Screen name="Signup" component={SignupScreen} />
//     </Drawer.Navigator>
//   );
// }

// navigation/DrawerNavigator.js
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';

import CustomDrawerContent from './CustomDrawerContent';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import PackagesScreen from '../screens/PackagesScreen';
import DashboardScreen from '../screens/DashboardScreen';
import EnrollCourseScreen from '../screens/EnrollcourseScreen';
import KycScreen from '../screens/KycScreen';
import OrderHistoryScreen from '../screens/OrderhistoryScreen';
import DirectTeamScreen from '../screens/DirectTeamScreen';
import PayoutScreen from '../screens/PayoutScreen';
import RegistrationfromuserScreen from '../screens/RegistrationfromuserScreen';

import { AuthContext } from '../context/AuthContext';
import GenealogyScreen from '../screens/GenealogyScreen';

const Drawer = createDrawerNavigator();

/* ---------- Header Profile Button ---------- */
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

/* ---------- Drawer Navigator ---------- */
export default function DrawerNavigator() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerRight: () => <HeaderProfileButton />,
      }}
    >
      {/* ✅ Public Screens */}
      <Drawer.Screen name="Home" component={HomeScreen} />

      {!isAuthenticated && (
        <>
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen name="Signup" component={SignupScreen} />
        </>
      )}

      {/* 🔒 Protected Screens */}
      {isAuthenticated && (
        <>
          <Drawer.Screen
            name="Packages"
            component={PackagesScreen}
            options={{ title: 'Packages' }}
          />
          <Drawer.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: 'Dashboard' }}
          />
          <Drawer.Screen
            name="Registrationfromuser"
            component={RegistrationfromuserScreen}
            options={{ title: 'User Registration' }}
          />
          <Drawer.Screen
            name="Kyc"
            component={KycScreen}
            options={{ title: 'KYC' }}
          />
          <Drawer.Screen
            name="Genealogy"
            component={GenealogyScreen}
            options={{ title: "Genealogy Tree" }}
          />
          <Drawer.Screen
            name="EnrollCourse"
            component={EnrollCourseScreen}
            options={{ title: 'Enrolled Course' }}
          />
          <Drawer.Screen
            name="OrderHistory"
            component={OrderHistoryScreen}
            options={{ title: 'Order History' }}
          />
          <Drawer.Screen
            name="DirectTeam"
            component={DirectTeamScreen}
            options={{ title: 'Direct Team' }}
          />
          <Drawer.Screen
            name="Payout"
            component={PayoutScreen}
            options={{ title: 'Payouts' }}
          />
          
        </>
      )}
    </Drawer.Navigator>
  );
}