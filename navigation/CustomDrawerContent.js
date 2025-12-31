
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function CustomDrawerContent(props) {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <View style={styles.root}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.container}
      >
        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          <Image
            source={require("../assets/userphoto.png")}
            style={styles.avatar}
          />

          <View>
            <Text style={styles.name}>
              {isAuthenticated ? user?.name : "Guest"}
            </Text>

            <Text style={styles.statusText}>
              {isAuthenticated ? `ID: ${user?.userId}` : "Not logged in"}
            </Text>
          </View>
        </View>

        {/* ---------- MENU ---------- */}
        <View style={styles.menu}>
          {/* Home - always visible */}
          <DrawerItem
            label="Home"
            icon={({ size }) => (
              <Ionicons name="home-outline" size={size} />
            )}
            onPress={() => props.navigation.navigate("Home")}
          />

          {/* 🔒 Protected routes */}
          {isAuthenticated && (
            <>
              <DrawerItem
                label="Dashboard"
                icon={({ size }) => (
                  <Ionicons name="grid-outline" size={size} />
                )}
                onPress={() => props.navigation.navigate("Dashboard")}
              />

              <DrawerItem
                label="Packages"
                icon={({ size }) => (
                  <Ionicons name="pricetags-outline" size={size} />
                )}
                onPress={() => props.navigation.navigate("Packages")}
              />

              <DrawerItem
                label="Course View"
                icon={({ size }) => (
                  <Ionicons name="play-outline" size={size} />
                )}
                onPress={() => props.navigation.navigate("CourseView")}
              />

              <DrawerItem
                label="KYC"
                icon={({ size }) => (
                  <Ionicons name="document-text-outline" size={size} />
                )}
                onPress={() => props.navigation.navigate("Kyc")}
              />

              <DrawerItem
                label=" New User Registration"
                icon={({ size }) => (
                  <Ionicons name="person-add-outline" size={size} />
                )}
                onPress={() => props.navigation.navigate("Registrationfromuser")}
              />

              <DrawerItem
                label="Genealogy"
                icon={({ size }) => (
                  <Ionicons name="git-network-outline" size={size} />
                )}
                onPress={() => props.navigation.navigate("Genealogy")}
              />

              <DrawerItem
                label="Direct Team"
                icon={({ size }) => (
                  <Ionicons name="people-outline" size={size} />
                )}
                onPress={() => props.navigation.navigate("DirectTeam")}
              />

              <DrawerItem
                label="Enrolled Course"
                icon={({ size }) => (
                  <Ionicons name="book-outline" size={size} />
                )}
                onPress={() => props.navigation.navigate("EnrollCourse")}
              />

              <DrawerItem
                label="Order History"
                icon={({ size }) => (
                  <Ionicons name="receipt-outline" size={size} />
                )}
                onPress={() => props.navigation.navigate("OrderHistory")}
              />

              <DrawerItem
                label="Payouts"
                icon={({ size }) => (
                  <Ionicons name="wallet-outline" size={size} />
                )}
                onPress={() => props.navigation.navigate("Payout")}
              />

            </>
          )}
        </View>
      </DrawerContentScrollView>

      {/* ---------- FOOTER ---------- */}
      <View style={styles.footer}>
        {!isAuthenticated ? (
          <>
            <Pressable
              style={[styles.button, styles.login]}
              onPress={() => props.navigation.navigate("Login")}
            >
              <Ionicons name="log-in-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.signup]}
              onPress={() => props.navigation.navigate("Signup")}
            >
              <Ionicons name="person-add-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Signup</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            style={[styles.button, styles.logout]}
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.buttonText}>Sign out</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "rgba(24, 29, 129, 1)",
    padding: 20,
    marginHorizontal: -16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  statusText: {
    color: "#ccc",
    fontSize: 15,
  },
  menu: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    padding: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#d5d6d8ff",
    backgroundColor: "#fff",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    gap: 6,
  },
  login: {
    backgroundColor: "rgba(24, 29, 129, 1)",
  },
  signup: {
    backgroundColor: '#b53f96',
  },
  logout: {
    backgroundColor: "#d85353ff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});