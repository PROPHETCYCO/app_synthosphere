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

export default function PayoutScreen() {
  const { user } = useContext(AuthContext);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayouts = async () => {
      if (!user?.userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${ROOT_URL}/api/payout/${user.userId}`
        );

        const result = response.data;

        if (result.success && result.data?.length > 0) {
          const validPayouts = result.data[0].payouts.filter(
            payout => payout.amount > 0
          );
          setPayouts(validPayouts);
        } else {
          setPayouts([]);
        }
      } catch (error) {
        console.error('Error fetching payout data:', error);
        setPayouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.warningText}>
        You will receive the payout after deducting 5% TDS.
      </Text>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, { flex: 0.6 }]}>#</Text>
        <Text style={[styles.headerText, { flex: 1.5 }]}>Amount (₹)</Text>
        <Text style={[styles.headerText, { flex: 1.5 }]}>Date</Text>
        <Text style={[styles.headerText, { flex: 2 }]}>After TDS</Text>
        <Text style={[styles.headerText, { flex: 1.5 }]}>Status</Text>
      </View>

      {payouts.length > 0 ? (
        <FlatList
          data={payouts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const afterTds = (item.amount - item.amount * 0.05).toFixed(2);

            return (
              <View style={styles.row}>
                <Text style={[styles.cell, { flex: 0.6 }]}>{index + 1}</Text>
                <Text style={[styles.cellBold, { flex: 1.5 }]}>
                  ₹{item.amount}
                </Text>
                <Text style={[styles.cell, { flex: 1.5 }]}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text style={[styles.cell, { flex: 2 }]}>₹{afterTds}</Text>
                <Text
                  style={[
                    styles.status,
                    item.status === 'paid'
                      ? styles.paid
                      : styles.pending,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            );
          }}
        />
      ) : (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No payouts found</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f9fafb',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    color: '#dc2626',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(14, 18, 85, 1)',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 12,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginBottom: 6,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  cell: {
    textAlign: 'center',
    color: '#111827',
  },
  cellBold: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#111827',
  },
  status: {
    flex: 1.5,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  paid: {
    color: '#16a34a',
  },
  pending: {
    color: '#f59e0b',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  },
});
