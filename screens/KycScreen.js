import { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    ScrollView,
    Image,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'https://backend-test-1-jn83.onrender.com';
const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

export default function KycScreen() {
    const { user, isAuthenticated } = useContext(AuthContext);
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [bankDetails, setBankDetails] = useState(null);

    const normalizeUri = (uri) =>
        uri.startsWith('file://') ? uri : `file://${uri}`;

    const [form, setForm] = useState({
        userId: '',
        name: '',
        nameAsPerDocument: '',
        bankName: '',
        accountNo: '',
        branchName: '',
        ifscCode: '',
    });

    const [files, setFiles] = useState({
        passbookPhoto: null,
    });

    /* ---------- AUTH GUARD ---------- */
    useEffect(() => {
        if (!isAuthenticated) {
            Alert.alert('Login Required', 'Please login to complete KYC', [
                {
                    text: 'OK',
                    onPress: () =>
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        }),
                },
            ]);
        }
    }, [isAuthenticated]);

    /* ---------- FETCH ---------- */
    useEffect(() => {
        if (!isAuthenticated || !user?.userId) return;

        const fetchDetails = async () => {
            try {
                setForm((prev) => ({ ...prev, userId: user.userId }));

                const res = await axios.post(
                    `${API_URL}/api/users/full-details`,
                    { userId: user.userId }
                );

                if (res.data?.data?.bankDetails) {
                    setBankDetails(res.data.data.bankDetails);
                }
            } catch {
                console.log('No existing KYC');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [isAuthenticated, user]);

    /* ---------- IMAGE PICK ---------- */
    const pickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please allow photo access');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
        });

        if (result.canceled) return;

        const asset = result.assets?.[0];
        const info = await FileSystem.getInfoAsync(asset.uri);

        if (info.size > MAX_IMAGE_SIZE) {
            Alert.alert('Image too large', 'Max size 1 MB');
            return;
        }

        setFiles({ passbookPhoto: asset });
    };

    /* ---------- SUBMIT ---------- */
    const handleSubmit = async () => {
        if (submitting) return;

        for (const key in form) {
            if (!form[key]) {
                Alert.alert('Error', 'All fields are required');
                return;
            }
        }

        if (!files.passbookPhoto) {
            Alert.alert('Error', 'Passbook photo required');
            return;
        }

        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));

        data.append('passbookPhoto', {
            uri: normalizeUri(files.passbookPhoto.uri),
            name: 'passbook.jpg',
            type: 'image/jpeg',
        });

        try {
            setSubmitting(true);
            const res = await axios.post(
                `${API_URL}/api/bankdetails/save`,
                data,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            Alert.alert('Success', 'KYC submitted');
            setBankDetails(res.data.data);
        } catch (err) {
            Alert.alert('Error', err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isAuthenticated) return null;

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    /* ---------- STATUS ---------- */
    if (bankDetails) {
        return (
            <View style={styles.center}>
                <View style={styles.card}>
                    <Text style={styles.title}>KYC Status</Text>
                    <Text style={styles.info}>User ID: {bankDetails.userId}</Text>
                    <Text style={styles.info}>
                       User Name: {bankDetails.nameAsPerDocument}
                    </Text>
                    <Text style={styles.status}>
                        Status: {bankDetails.status}
                    </Text>
                </View>
            </View>
        );
    }

    /* ---------- FORM ---------- */
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>KYC Verification</Text>

                {[
                    ['Full Name', 'name'],
                    ['Name as per Document', 'nameAsPerDocument'],
                    ['Bank Name', 'bankName'],
                    ['Account Number', 'accountNo'],
                    ['Branch Name', 'branchName'],
                    ['IFSC Code', 'ifscCode'],
                ].map(([label, key]) => (
                    <TextInput
                        key={key}
                        placeholder={label}
                        placeholderTextColor="#9ca3af"
                        style={styles.input}
                        value={form[key]}
                        onChangeText={(v) =>
                            setForm({ ...form, [key]: v })
                        }
                    />
                ))}

                <UploadButton
                    label="Upload Passbook Photo"
                    onPress={pickImage}
                    file={files.passbookPhoto}
                />

                <Pressable style={styles.submit} onPress={handleSubmit}>
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitText}>Submit KYC</Text>
                    )}
                </Pressable>
            </View>
        </ScrollView>
    );
}

/* ---------- UPLOAD ---------- */
function UploadButton({ label, onPress, file }) {
    return (
        <Pressable style={styles.upload} onPress={onPress}>
            {file ? (
                <Image source={{ uri: file.uri }} style={styles.preview} />
            ) : (
                <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color="#fff"
                />
            )}
            <Text style={{ color: '#fff' }}>
                {file ? 'Change Photo' : label}
            </Text>
        </Pressable>
    );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fdfdfdff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e9ebefff',
    },

    /* 3D CARD */
    card: {
        backgroundColor: '#0d1154',
        borderRadius: 20,
        padding: 50,
        width: '90%',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 12,
    },

    title: {
        fontSize: 25,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },

    info: {
        color: '#e5e7eb',
        marginBottom: 10,
        fontSize: 20,
    },

    status: {
        color: '#22c55e',
        fontWeight: '700',
        marginTop: 9,
        fontSize: 19,
    },

    input: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        color: '#fff',
    },

    upload: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },

    submit: {
        backgroundColor: '#2563EB',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },

    submitText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },

    preview: {
        width: 50,
        height: 50,
        borderRadius: 6,
    },
});
