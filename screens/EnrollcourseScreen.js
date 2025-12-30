import { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ROOT_URL = "https://backend-test-1-jn83.onrender.com";

export default function EnrollCourseScreen() {
    const { user } = useContext(AuthContext);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!user?.userId) {
                Alert.alert('Session Expired', 'Please login again');
                setLoading(false);
                return;
            }

            try {
                const res = await axios.post(
                    `${ROOT_URL}/api/users/full-details`,
                    { userId: user.userId }
                );

                setCourse(res.data.data.courseDetails);
            } catch (err) {
                console.log(err);
                Alert.alert('Error', 'Unable to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (!course) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>
                    No Enrolled Courses Found
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.screen}>
            {/* HEADER */}
            

            {/* COURSE CARD */}
            <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.label}>Course Name</Text>
                    <Text style={styles.value}>
                        {course.courseName || 'N/A'}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>Package</Text>
                    <Text style={styles.value}>
                        {course.packageName || 'N/A'}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>Enrolled On</Text>
                    <Text style={styles.value}>
                        {new Date(course.createdAt).toLocaleDateString()}
                    </Text>
                </View>

                {/* STATUS BADGE */}
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>ACTIVE</Text>
                </View>
            </View>
        </ScrollView>
    );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
    },

    emptyText: {
        fontSize: 16,
        color: '#64748B',
    },

    /* HEADER */
  
    /* CARD */
    card: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 18,
        borderRadius: 16,

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        position: 'relative',
    },

    row: {
        marginBottom: 14,
    },

    label: {
        fontSize: 18,
        color: '#64748B',
        marginBottom: 4,
    },

    value: {
        fontSize: 17,
        fontWeight: '600',
        color: '#060910ff',
    },

    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 10,
    },

    /* STATUS BADGE */
    statusBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        color: '#15803D',
        fontSize: 14,
        fontWeight: '700',
    },
});
