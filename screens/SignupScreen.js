// import { useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     Pressable,
//     StyleSheet,
//     Alert,
//     ScrollView,
//     Image,
// } from 'react-native';
// import axios from 'axios';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system/legacy';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const API_URL = 'https://backend-test-1-jn83.onrender.com/api/users/register';

// export default function SignupScreen() {
//     const navigation = useNavigation();

//     const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB

//     const normalizeUri = (uri) =>
//         uri.startsWith('file://') ? uri : `file://${uri}`;

//     const [form, setForm] = useState({
//         name: '',
//         phone: '',
//         email: '',
//         address: '',
//         aadharNo: '',
//         panNo: '',
//         password: '',
//         parentId: '',
//     });

//     const [files, setFiles] = useState({
//         aadharFront: null,
//         aadharBack: null,
//         panPhoto: null,
//     });

//     const pickImage = async (key) => {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

//         if (status !== 'granted') {
//             Alert.alert(
//                 'Permission required',
//                 'Please allow photo library access'
//             );
//             return;
//         }

//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ['images'], // ✅ stable, no warnings
//             allowsEditing: true,
//             quality: 0.7,
//         });

//         if (result.canceled) return;

//         const asset = result.assets?.[0];
//         if (!asset?.uri) {
//             Alert.alert('Error', 'Unable to read selected image');
//             return;
//         }

//         const info = await FileSystem.getInfoAsync(asset.uri);

//         if (!info.exists) {
//             Alert.alert('Error', 'Image file does not exist');
//             return;
//         }

//         if (info.size && info.size > MAX_IMAGE_SIZE) {
//             Alert.alert(
//                 'Image too large',
//                 'Image must be smaller than 1 MB'
//             );
//             return;
//         }

//         setFiles((prev) => ({
//             ...prev,
//             [key]: asset,
//         }));
//     };

//     const handleSubmit = async () => {
//         const requiredFields = [
//             'name',
//             'phone',
//             'email',
//             'address',
//             'aadharNo',
//             'panNo',
//             'password',
//             'parentId',
//         ];

//         for (const field of requiredFields) {
//             if (!form[field]) {
//                 Alert.alert('Error', 'All fields are required');
//                 return;
//             }
//         }

//         if (!files.aadharFront || !files.aadharBack || !files.panPhoto) {
//             Alert.alert('Error', 'All document images are required');
//             return;
//         }

//         const data = new FormData();

//         Object.entries(form).forEach(([key, value]) => {
//             if (value) data.append(key, value);
//         });

//         data.append('aadharFront', {
//             uri: normalizeUri(files.aadharFront.uri),
//             name: 'aadhar-front.jpg',
//             type: 'image/jpeg',
//         });

//         data.append('aadharBack', {
//             uri: normalizeUri(files.aadharBack.uri),
//             name: 'aadhar-back.jpg',
//             type: 'image/jpeg',
//         });

//         data.append('panPhoto', {
//             uri: normalizeUri(files.panPhoto.uri),
//             name: 'pan.jpg',
//             type: 'image/jpeg',
//         });

//         try {
//             const response = await axios.post(API_URL, data, {
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'multipart/form-data',
//                 },
//                 timeout: 15000,
//                 maxBodyLength: Infinity,
//                 maxContentLength: Infinity,
//             });

//             const result = response.data;

//             if (!response.ok) {
//                 throw new Error(result.message || 'Registration failed');
//             }

//             Alert.alert('Success', 'Registration successful. Please login.');

//             navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Login' }],
//             });

//         } catch (error) {
//             Alert.alert('Error', error.message);
//         }
//     };

//     return (
//         <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//             <Text style={styles.title}>Create Account</Text>

//             {[
//                 ['Name', 'name'],
//                 ['Phone', 'phone'],
//                 ['Email', 'email'],
//                 ['Address', 'address'],
//                 ['Aadhar Number', 'aadharNo'],
//                 ['PAN Number', 'panNo'],
//                 ['Password', 'password'],
//                 ['Referral ID (Optional)', 'parentId'],
//             ].map(([label, key]) => (
//                 <TextInput
//                     key={key}
//                     placeholder={label}
//                     secureTextEntry={key === 'password'}
//                     style={styles.input}
//                     value={form[key]}
//                     onChangeText={(v) => setForm({ ...form, [key]: v })}
//                 />
//             ))}

//             <UploadButton label="Aadhar Front" onPress={() => pickImage('aadharFront')} file={files.aadharFront} />
//             <UploadButton label="Aadhar Back" onPress={() => pickImage('aadharBack')} file={files.aadharBack} />
//             <UploadButton label="PAN Photo" onPress={() => pickImage('panPhoto')} file={files.panPhoto} />

//             <Pressable style={styles.submit} onPress={handleSubmit}>
//                 <Text style={styles.submitText}>Sign Up</Text>
//             </Pressable>
//         </ScrollView>
//     );
// }

// function UploadButton({ label, onPress, file }) {
//     return (
//         <Pressable style={styles.upload} onPress={onPress}>
//             {file ? (
//                 <Image
//                     source={{ uri: file.uri }}
//                     style={styles.preview}
//                 />
//             ) : (
//                 <Ionicons name="cloud-upload-outline" size={20} />
//             )}
//             <Text>{file ? 'Change Photo' : label}</Text>
//         </Pressable>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//     },
//     title: {
//         fontSize: 22,
//         fontWeight: '700',
//         marginBottom: 20,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         padding: 12,
//         borderRadius: 8,
//         marginBottom: 12,
//     },
//     upload: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 8,
//         padding: 12,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 8,
//         marginBottom: 10,
//     },
//     submit: {
//         backgroundColor: '#2563EB',
//         padding: 14,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     submitText: {
//         color: '#fff',
//         fontWeight: '600',
//     },
//     preview: {
//         width: 50,
//         height: 50,
//         borderRadius: 6,
//         marginRight: 8,
//     },
// });


import { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';

const API_URL = 'https://backend-test-1-jn83.onrender.com/api/users/register';
const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

export default function SignupScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const normalizeUri = (uri) =>
        uri.startsWith('file://') ? uri : `file://${uri}`;

    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        aadharNo: '',
        panNo: '',
        password: '',
        parentId: '',
    });

    const [files, setFiles] = useState({
        aadharFront: null,
        aadharBack: null,
        panPhoto: null,
    });

    const pickImage = async (key) => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please allow photo library access');
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
            Alert.alert('Image too large', 'Image must be smaller than 1 MB');
            return;
        }

        setFiles((prev) => ({ ...prev, [key]: asset }));
    };

    const handleSubmit = async () => {
        if (loading) return;

        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));

        data.append('aadharFront', {
            uri: normalizeUri(files.aadharFront.uri),
            name: 'aadhar-front.jpg',
            type: 'image/jpeg',
        });
        data.append('aadharBack', {
            uri: normalizeUri(files.aadharBack.uri),
            name: 'aadhar-back.jpg',
            type: 'image/jpeg',
        });
        data.append('panPhoto', {
            uri: normalizeUri(files.panPhoto.uri),
            name: 'pan.jpg',
            type: 'image/jpeg',
        });

        try {
            setLoading(true);
            await axios.post(API_URL, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Alert.alert('Success', 'Registration successful');
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        } catch (err) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* 3D CARD */}
            <View style={styles.card}>
                <Text style={styles.title}>Create Account</Text>

                {[
                    ['Enter Your Full Name', 'name'],
                    ['Enter Your Phone Number', 'phone'],
                    ['Enter Your Email', 'email'],
                    ['Enter Your Address', 'address'],
                    ['Enter Your Aadhar Number', 'aadharNo'],
                    ['Enter Your PAN Number', 'panNo'],
                    ['Enter Your Password', 'password'],
                    ['Enter Your Referral ID', 'parentId'],
                ].map(([label, key]) => (
                    <TextInput
                        key={key}
                        placeholder={label}
                        placeholderTextColor="#000000ff"
                        secureTextEntry={key === 'password'}
                        autoCapitalize="none"
                        style={styles.input}
                        value={form[key]}
                        onChangeText={(v) =>
                            setForm({ ...form, [key]: v })
                        }
                    />
                ))}

                <UploadButton label="Aadhar Front" onPress={() => pickImage('aadharFront')} file={files.aadharFront} />
                <UploadButton label="Aadhar Back" onPress={() => pickImage('aadharBack')} file={files.aadharBack} />
                <UploadButton label="PAN Photo" onPress={() => pickImage('panPhoto')} file={files.panPhoto} />

                <Pressable style={styles.submit} onPress={handleSubmit}>
                    {loading ? (
                        <ActivityIndicator color="#000000ff" />
                    ) : (
                        <Text style={styles.submitText}>Sign Up</Text>
                    )}
                </Pressable>
            </View>
        </ScrollView>
    );
}

function UploadButton({ label, onPress, file }) {
    return (
        <Pressable style={styles.upload} onPress={onPress}>
            {file ? (
                <Image source={{ uri: file.uri }} style={styles.preview} />
            ) : (
                <Ionicons name="cloud-upload-outline" size={20} color="#000000ff" />
            )}
            <Text style={{ color: '#000000ff' }}>{file ? 'Change Photo' : label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 30,
        
        backgroundColor: '#0d1154',
    },

    /* 3D CARD */
    card: {
        backgroundColor: '#eef2ff',
        borderRadius: 20,
        padding: 20,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 12,
    },

    title: {
        fontSize: 29,
        fontWeight: '700',
        color: '#000000ff',
        textAlign: 'center',
        marginBottom: 20,
    },

    input: {
        backgroundColor: 'rgba(21, 34, 55, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        color: '#000000ff',
    },

    upload: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(192, 192, 192, 0.15)',
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.20)',
    },

    submit: {
        backgroundColor: '#b53f96',
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
