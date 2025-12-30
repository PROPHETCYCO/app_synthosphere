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

export default function DirectTeamScreen() {
  const { user } = useContext(AuthContext);
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirectTeam = async () => {
      if (!user?.userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${ROOT_URL}/api/referral/${user.userId}`
        );

        setReferredUsers(response.data.data?.referredUsers || []);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectTeam();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (referredUsers.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No referred users found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.headerRow}>
      <Text style={[styles.headerText, { flex: 1 }]}>S/N</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>User ID</Text>
        <Text style={[styles.headerText, { flex: 2 }]}>Username</Text>
      </View>

      <FlatList
        data={referredUsers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item , index}) => (
          <View style={styles.row}>
          <Text style={[styles.cell, { flex: 1 }]}>{index+1}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{item.userId}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(14, 18, 85, 1)',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginBottom: 6,
    borderRadius: 8,
    elevation: 2,
  },
  cell: {
    textAlign: 'center',
    color: '#111827',
    fontSize: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
