import { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ROOT_URL = 'https://backend-test-1-jn83.onrender.com';

export default function OrderHistoryScreen() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.userId) return;

            try {
                const res = await axios.post(
                    `${ROOT_URL}/api/users/getorderdetailsbyuser`,
                    { userId: user.userId }
                );

                // only paid orders
                const paidOrders = res.data.filter(
                    (order) => order.paymentStatus === 'paid'
                );

                setOrders(paidOrders);
            } catch (err) {
                console.log('Error fetching orders', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!orders.length) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>No orders available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
         

            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <View style={styles.card}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.orderNo}>
                                Order {index + 1}
                            </Text>
                            <Text style={styles.amount}>
                                ₹{item.amount}
                            </Text>
                        </View>

                        <InfoRow
                            label="Course"
                            value={item.coursename || 'N/A'}
                        />
                        <InfoRow
                            label="Package"
                            value={item.packagename || 'N/A'}
                        />
                        <InfoRow
                            label="Payment ID"
                            value={item.razorpay_payment_id || 'N/A'}
                        />
                        <InfoRow
                            label="Date"
                            value={new Date(item.createdAt).toLocaleDateString()}
                        />

                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>PAID</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

/* ---------- INFO ROW ---------- */
const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 18,
        backgroundColor: '#F9FAFB',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 19,
        marginBottom: 18,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,

    },
    orderNo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    amount: {
        fontSize: 20,
        fontWeight: '700',
        color: '#b53f96',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    label: {
        fontSize: 16,
        color: '#6B7280',
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        maxWidth: '65%',
        textAlign: 'right',
    },
    statusBadge: {
        marginTop: 15,
        alignSelf: 'flex-start',
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#166534',
        fontSize: 14,
        fontWeight: '700',
    },
});
