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
const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB

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
            Alert.alert(
                'Login Required',
                'Please login to complete KYC',
                [
                    {
                        text: 'OK',
                        onPress: () =>
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            }),
                    },
                ]
            );
        }
    }, [isAuthenticated]);

    /* ---------- FETCH EXISTING KYC ---------- */
    useEffect(() => {
        if (!isAuthenticated || !user?.userId) return;

        const fetchDetails = async () => {
            try {
                setForm((prev) => ({
                    ...prev,
                    userId: user.userId,
                }));

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

    /* ---------- IMAGE PICKER (SAME AS SIGNUP) ---------- */
    const pickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                'Permission required',
                'Please allow photo library access'
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
        });

        if (result.canceled) return;

        const asset = result.assets?.[0];
        if (!asset?.uri) {
            Alert.alert('Error', 'Unable to read selected image');
            return;
        }

        const info = await FileSystem.getInfoAsync(asset.uri);

        if (!info.exists) {
            Alert.alert('Error', 'Image file does not exist');
            return;
        }

        if (info.size && info.size > MAX_IMAGE_SIZE) {
            Alert.alert(
                'Image too large',
                'Image must be smaller than 1 MB'
            );
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
            Alert.alert('Error', 'Passbook photo is required');
            return;
        }

        const data = new FormData();
        Object.entries(form).forEach(([key, value]) =>
            data.append(key, value)
        );

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
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            Alert.alert('Success', 'KYC submitted successfully');
            setBankDetails(res.data.data);
        } catch (error) {
            Alert.alert(
                'Error',
                error?.response?.data?.message ||
                error?.message ||
                'KYC submission failed'
            );
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------- BLOCK RENDER IF LOGGED OUT ---------- */
    if (!isAuthenticated) return null;

    /* ---------- LOADING ---------- */
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    /* ---------- KYC ALREADY SUBMITTED ---------- */
    if (bankDetails) {
        return (
            <View style={styles.center}>
                <Text style={styles.title}>KYC Status</Text>
                <Text>User ID: {bankDetails.userId}</Text>
                <Text>Name: {bankDetails.nameAsPerDocument}</Text>
                <Text>Status: {bankDetails.status}</Text>
            </View>
        );
    }

    /* ---------- KYC FORM ---------- */
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
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
                disabled={submitting}
            />

            <Pressable
                style={[
                    styles.submit,
                    submitting && { opacity: 0.7 },
                ]}
                onPress={handleSubmit}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.submitText}>Submit KYC</Text>
                )}
            </Pressable>
        </ScrollView>
    );
}

/* ---------- UPLOAD BUTTON ---------- */
function UploadButton({ label, onPress, file, disabled }) {
    return (
        <Pressable
            style={[
                styles.upload,
                disabled && { opacity: 0.6 },
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            {file ? (
                <Image
                    source={{ uri: file.uri }}
                    style={styles.preview}
                />
            ) : (
                <Ionicons name="cloud-upload-outline" size={20} />
            )}
            <Text>{file ? 'Change Photo' : label}</Text>
        </Pressable>
    );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    upload: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
    },
    submit: {
        backgroundColor: '#2563EB',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    submitText: {
        color: '#fff',
        fontWeight: '600',
    },
    preview: {
        width: 50,
        height: 50,
        borderRadius: 6,
        marginRight: 8,
    },
});