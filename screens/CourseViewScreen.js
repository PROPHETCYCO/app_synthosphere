import { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ROOT_URL = 'https://backend-test-1-jn83.onrender.com';
const { width } = Dimensions.get('window');

export default function CourseViewScreen() {
    const { user, isAuthenticated } = useContext(AuthContext);
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);

    /* ---------- VIDEO LIST ---------- */
    const videos = [
        { id: 1, title: 'Video 1 – Introduction', vimeoId: '1144782050' },
        { id: 2, title: 'Video 2 – What is Cryptocurrency', vimeoId: '1144782610' },
        { id: 3, title: 'Video 3 – What is Marketcap', vimeoId: '1144782421' },
        { id: 4, title: 'Video 4 – Token vs Coin', vimeoId: '1144782304' },
        { id: 5, title: 'Video 5 – Bitcoin & Altcoin', vimeoId: '1144782119' },
        { id: 6, title: 'Video 6 – Crypto Trading Basics', vimeoId: '1144794300' },
        { id: 7, title: 'Video 7 – First Trade', vimeoId: '1144794217' },
        { id: 8, title: 'Video 8 – Exchange & KYC', vimeoId: '1144794162' },
        { id: 9, title: 'Video 9 – CEX, DEX & Wallet', vimeoId: '1144794085' },
        { id: 10, title: 'Video 10 – Deposit & Withdraw', vimeoId: '1146159983' },
        { id: 11, title: 'Video 11 – Buy & Sell', vimeoId: '1146305836' },
        { id: 12, title: 'Video 12 – Fundamental Analysis', vimeoId: '1146160018' },
        { id: 13, title: 'Video 13 – Technical Analysis', vimeoId: '1146159841' },
        { id: 14, title: 'Video 14 – Time Frames', vimeoId: '1146159928' },
        { id: 15, title: 'Video 15 – Portfolio Management', vimeoId: '1146305654' },
        { id: 16, title: 'Video 16 – Holding Strategy', vimeoId: '1146305542' },
        { id: 17, title: 'Video 17 – Practice', vimeoId: '1146335360' },
        { id: 18, title: 'Video 18 – Google Authenticator', vimeoId: '1148583052' },
    ];

    /* ---------- AUTH GUARD ---------- */
    useEffect(() => {
        if (!isAuthenticated) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    }, [isAuthenticated]);

    /* ---------- FETCH ORDER DATA ---------- */
    useEffect(() => {
        const fetchOrder = async () => {
            if (!user?.userId) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.post(
                    `${ROOT_URL}/api/users/getorderdetailsbyuser`,
                    { userId: user.userId }
                );

                if (res.data?.error) {
                    setOrderData(null);
                } else {
                    setOrderData(res.data);
                }
            } catch (err) {
                console.log('No active package');
                setOrderData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [user]);

    /* ---------- FILTER VIDEOS ---------- */
    const allowedVideos = orderData ? videos : [videos[0]];

    useEffect(() => {
        setCurrentVideo(allowedVideos[0]);
    }, [orderData]);

    /* ---------- LOADING ---------- */
    if (loading || !currentVideo) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* VIDEO PLAYER */}
            <View style={styles.playerWrapper}>
                <WebView
                    source={{
                        uri: `https://player.vimeo.com/video/${currentVideo.vimeoId}`,
                    }}
                    style={styles.player}
                    allowsFullscreenVideo
                />
            </View>

            <Text style={styles.videoTitle}>{currentVideo.title}</Text>

            {/* LOCK MESSAGE */}
            {!orderData && (
                <View style={styles.lockBox}>
                    <Text style={styles.lockText}>
                        For more videos, purchase any package
                    </Text>
                    <Pressable
                        style={styles.buyBtn}
                        onPress={() => navigation.navigate('Packages')}
                    >
                        <Text style={styles.buyText}>Buy Package</Text>
                    </Pressable>
                </View>
            )}

            {/* VIDEO LIST */}
            <FlatList
                data={allowedVideos}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <Pressable
                        style={[
                            styles.videoItem,
                            currentVideo.id === item.id && styles.activeItem,
                        ]}
                        onPress={() => setCurrentVideo(item)}
                    >
                        <Text style={styles.videoItemText}>▶ {item.title}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerWrapper: {
        width: '100%',
        height: (width * 9) / 16,
        backgroundColor: '#000',
        borderRadius: 10,
        overflow: 'hidden',
    },
    player: {
        flex: 1,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginVertical: 10,
    },
    lockBox: {
        padding: 12,
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    lockText: {
        color: '#dc2626',
        fontWeight: '600',
        marginBottom: 8,
    },
    buyBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    buyText: {
        color: '#fff',
        fontWeight: '600',
    },
    videoItem: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        marginBottom: 8,
    },
    activeItem: {
        backgroundColor: '#eff6ff',
        borderColor: '#2563EB',
    },
    videoItemText: {
        fontWeight: '600',
    },
});