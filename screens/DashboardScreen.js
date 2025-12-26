import { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Pressable,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'https://backend-test-1-jn83.onrender.com';

export default function DashboardScreen() {
    const { user, isAuthenticated } = useContext(AuthContext);

    const [userDetails, setUserDetails] = useState(null);
    const [bankDetails, setBankDetails] = useState(null);
    const [courseDetails, setCourseDetails] = useState(null);
    const [payoutDetails, setPayoutDetails] = useState(null);
    const [teamDetails, setTeamDetails] = useState(null);
    const [rank, setRank] = useState('No Rank');

    /* ---------- Rank Table ---------- */
    const rankTable = [
        { name: 'Class 1', minTeam: 0, minDirect: 3, minPoint: 1 },
        { name: 'Class 2', minTeam: 50, minDirect: 10, minPoint: 5001 },
        { name: 'Class 3', minTeam: 100, minDirect: 20, minPoint: 15001 },
        { name: 'Class 4', minTeam: 200, minDirect: 30, minPoint: 50001 },
        { name: 'Class 5', minTeam: 500, minDirect: 40, minPoint: 100001 },
        { name: 'Class 6', minTeam: 1000, minDirect: 50, minPoint: 300001 },
    ];

    const calculateRank = (team, direct, points) => {
        let r = 'No Rank';
        for (const item of rankTable) {
            if (
                points >= item.minPoint &&
                team >= item.minTeam &&
                direct >= item.minDirect
            ) {
                r = item.name;
            }
        }
        return r;
    };

    /* ---------- Fetch Data ---------- */
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchAll = async () => {
            try {
                const userId = user.userId;

                const [full, payout, team] = await Promise.all([
                    axios.post(`${API_URL}/api/users/full-details`, { userId }),
                    axios.post(`${API_URL}/api/referral/realtime`, {
                        userId,
                        name: user.name,
                    }),
                    axios.post(`${API_URL}/api/referral/teamsummary`, { userId }),
                ]);

                setUserDetails(full.data.data.user);
                setBankDetails(full.data.data.bankDetails);
                setCourseDetails(full.data.data.courseDetails);
                setPayoutDetails(payout.data.data);
                setTeamDetails(team.data);

                const calculatedRank = calculateRank(
                    team.data.totalDownlineCount,
                    team.data.directReferrals,
                    team.data.totalPoints
                );
                setRank(calculatedRank);
            } catch (err) {
                console.log(err);
                Alert.alert('Error', 'Failed to load dashboard data');
            }
        };

        fetchAll();
    }, [isAuthenticated]);

    if (!userDetails) {
        return (
            <View style={styles.center}>
                <Text>Loading dashboard...</Text>
            </View>
        );
    }

    const referralLink = userDetails.referralLink;

    const showCopyHint = () => {
        Alert.alert(
            'Copy Referral Link',
            'Long-press the link to copy it.'
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Dashboard</Text>

            <View style={styles.grid}>
                <Card title="User Status" value={userDetails.status} />
                <Card title="Package" value={courseDetails?.packageName || 'N/A'} />
                <Card title="KYC Status" value={bankDetails?.status || 'N/A'} />
                <Card
                    title="Course Expiry"
                    value={
                        courseDetails?.validityEnd
                            ? new Date(courseDetails.validityEnd).toLocaleDateString('en-GB')
                            : 'N/A'
                    }
                />
                <Card title="Direct Team" value={teamDetails?.directReferrals || 0} />
                <Card title="Total Team" value={teamDetails?.totalDownlineCount || 0} />
                <Card title="Self Points" value={userDetails.totalSelfPoints || 0} />
                <Card
                    title="Referred Points"
                    value={payoutDetails?.referralPoint || 0}
                />
                <Card title="Current Rank" value={rank} />
            </View>

            <View style={styles.referralBox}>
                <Text style={styles.refTitle}>Your Referral Link</Text>

                {/* selectable = native copy support */}
                <Text style={styles.refLink} selectable>
                    {referralLink}
                </Text>

                <Pressable style={styles.copyBtn} onPress={showCopyHint}>
                    <Text style={styles.copyText}>How to Copy</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

/* ---------- UI Components ---------- */

const Card = ({ title, value }) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
    </View>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 14,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 13,
        color: '#555',
    },
    cardValue: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 6,
    },
    referralBox: {
        marginTop: 20,
        padding: 14,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    refTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    refLink: {
        fontSize: 13,
        color: '#2563EB',
    },
    copyBtn: {
        marginTop: 10,
        backgroundColor: '#2563EB',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    copyText: {
        color: '#fff',
        fontWeight: '700',
    },
});