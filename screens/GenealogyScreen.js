import { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://backend-test-1-jn83.onrender.com";
const userAvatar = require("../assets/userphoto.png");

export default function GenealogyScreen() {
    const { user, isAuthenticated } = useContext(AuthContext);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [rootUserId, setRootUserId] = useState(null);

    /* ---------- Fetch Tree ---------- */
    const fetchUserTree = async (userId) => {
        if (!userId) return;

        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/referral/${userId}`);
            setData(res.data.data);
        } catch (error) {
            Alert.alert("Error", "Failed to load genealogy data");
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Initial Load ---------- */
    useEffect(() => {
        if (!isAuthenticated) return;

        setRootUserId(user.userId);
        fetchUserTree(user.userId);
    }, [isAuthenticated]);

    /* ---------- Go To Top ---------- */
    const handleGoToTop = () => {
        if (!rootUserId) {
            Alert.alert("Error", "Root user not found");
            return;
        }
        fetchUserTree(rootUserId);
    };

    /* ---------- Guards ---------- */
    if (!isAuthenticated) {
        return (
            <View style={styles.center}>
                <Text>Please login to view genealogy</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 10 }}>Loading genealogy...</Text>
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.center}>
                <Text>No genealogy data found</Text>
            </View>
        );
    }

    /* ---------- Colors ---------- */
    const parentBg =
        data?.mainUser?.totalSelfPoints === 0 ? "#d82a2a" : "#3fc83f";

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* ---------- Top Button ---------- */}
            <Pressable style={styles.topButton} onPress={handleGoToTop}>
                <Text style={styles.topButtonText}>Extreme Top</Text>
            </Pressable>

            {/* ---------- Parent Node ---------- */}
            <View style={styles.parentNode}>
                <Image
                    source={userAvatar}
                    style={[styles.avatar, { backgroundColor: parentBg }]}
                />
                <Text style={styles.name}>{data.mainUser.name}</Text>
                <Text style={styles.userId}>{data.mainUser.userId}</Text>
            </View>

            {/* ---------- Connector ---------- */}
            <View style={styles.connector} />

            {/* ---------- Children ---------- */}
            <View style={styles.childrenRow}>
                {data.referredUsers && data.referredUsers.length > 0 ? (
                    data.referredUsers.map((ref, index) => {
                        const bgColor =
                            ref.totalSelfPoints === 0 ? "#d82a2a" : "#3fc83f";

                        return (
                            <Pressable
                                key={index}
                                style={styles.childNode}
                                onPress={() => fetchUserTree(ref.userId)}
                            >
                                <Image
                                    source={userAvatar}
                                    style={[styles.avatar, { backgroundColor: bgColor }]}
                                />
                                <Text style={styles.name}>{ref.name}</Text>
                                <Text style={styles.userId}>{ref.userId}</Text>
                            </Pressable>
                        );
                    })
                ) : (
                    <Text style={styles.noReferrals}>No referrals found</Text>
                )}
            </View>
        </ScrollView>
    );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    topButton: {
        backgroundColor: "#9a357f",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 20,
    },
    topButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    parentNode: {
        alignItems: "center",
        marginBottom: 10,
    },
    childrenRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 20,
    },
    childNode: {
        alignItems: "center",
        marginHorizontal: 10,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 6,
    },
    name: {
        fontWeight: "700",
    },
    userId: {
        fontSize: 12,
        color: "#555",
    },
    connector: {
        width: 2,
        height: 20,
        backgroundColor: "#999",
        marginVertical: 10,
    },
    noReferrals: {
        marginTop: 20,
        color: "#666",
    },
});