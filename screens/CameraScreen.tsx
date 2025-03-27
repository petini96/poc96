import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image, FlatList } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const db = SQLite.openDatabase("photos.db");

export default function CameraScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [showCamera, setShowCamera] = useState(true);
    const [photos, setPhotos] = useState<{ uri: string; fileName: string }[]>([]);
    const [cameraType, setCameraType] = useState(CameraType.back);
    const [cameraRatio, setCameraRatio] = useState<string | undefined>(undefined);
    const cameraRef = useRef<Camera | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, timestamp TEXT);",
                [],
                () => console.log("Tabela criada com sucesso"),
                (_, error) => {
                    console.error("Erro ao criar tabela:", error);
                    return false;
                }
            );
        });
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);
    
    const setCameraRatioAsync = async () => {
        if (cameraRef.current) {
            const ratios = await cameraRef.current.getSupportedRatiosAsync();
            const preferredRatio = ratios.includes("16:9") ? "16:9" : ratios.includes("4:3") ? "4:3" : ratios[0];
            setCameraRatio(preferredRatio);
        }
    };

    const takePicture = async () => {
        if (cameraRef.current && cameraReady) {
            try {
                const photo = await cameraRef.current.takePictureAsync();

                const timestamp = Date.now();
                const fileName = `${FileSystem.documentDirectory}${timestamp}.jpg`;
                await FileSystem.moveAsync({
                    from: photo.uri,
                    to: fileName,
                });

                db.transaction((tx) => {
                    tx.executeSql(
                        "INSERT INTO photos (uri, timestamp) VALUES (?, ?);",
                        [fileName, new Date().toISOString()],
                        (_, { insertId }) => {
                            console.log("Foto salva no SQLite com ID:", insertId);
                            Alert.alert("Sucesso", "Foto salva com sucesso!");
                            setPhotos((prevPhotos) => [
                                { uri: fileName, fileName: `${timestamp}.jpg` },
                                ...prevPhotos,
                            ]);
                            setShowCamera(false);
                        },
                        (_, error) => {
                            console.error("Erro ao salvar no SQLite:", error);
                            return false;
                        }
                    );
                });
            } catch (error) {
                console.error("Erro ao tirar foto:", error);
                Alert.alert("Erro", "Falha ao tirar a foto.");
            }
        }
    };

    const toggleCameraType = () => {
        setCameraType((current) =>
            current === CameraType.back ? CameraType.front : CameraType.back
        );
        setCameraRatioAsync();
    };

    const openCameraAgain = () => {
        setShowCamera(true);
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Solicitando permissão...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text>Sem acesso à câmera</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {showCamera ? (
                <>
                    <Camera
                        style={styles.camera}
                        type={cameraType}
                        ratio={cameraRatio}
                        ref={cameraRef}
                        onCameraReady={() => {
                            setCameraReady(true);
                            setCameraRatioAsync();
                        }}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={toggleCameraType}
                        >
                            <MaterialIcons
                                name={cameraType === CameraType.back ? "camera-front" : "camera-rear"}
                                size={40}
                                color="#fff"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={takePicture}
                            disabled={!cameraReady}
                        >
                            <MaterialIcons name="camera" size={40} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.previewContainer}>
                    <Text style={styles.previewTitle}>Fotos Tiradas</Text>
                    {photos.length > 0 ? (
                        <FlatList
                            data={photos}
                            keyExtractor={(item) => item.uri}
                            renderItem={({ item }) => (
                                <View style={styles.photoItem}>
                                    <Image source={{ uri: item.uri }} style={styles.previewImage} />
                                    <View style={styles.photoInfo}>
                                        <Text style={styles.fileInfo}>Nome: {item.fileName}</Text>
                                        <Text style={styles.fileInfo}>Pasta: {FileSystem.documentDirectory}</Text>
                                    </View>
                                </View>
                            )}
                            contentContainerStyle={styles.listContainer}
                        />
                    ) : (
                        <Text style={styles.noPhotosText}>Nenhuma foto tirada ainda</Text>
                    )}
                    <View style={styles.previewButtons}>
                        <TouchableOpacity style={styles.previewButton} onPress={openCameraAgain}>
                            <MaterialIcons name="camera-alt" size={30} color="#fff" />
                            <Text style={styles.previewButtonText}>Tirar outra foto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.previewButton} onPress={() => navigation.goBack()}>
                            <MaterialIcons name="arrow-back" size={30} color="#fff" />
                            <Text style={styles.previewButtonText}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 30,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    button: {
        backgroundColor: "#333",
        borderRadius: 50,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    toggleButton: {
        backgroundColor: "#333",
        borderRadius: 50,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    previewContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    previewTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 20,
        textAlign: "center",
    },
    listContainer: {
        paddingBottom: 20,
    },
    photoItem: {
        flexDirection: "row",
        marginBottom: 20,
        backgroundColor: "#fafafa",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    photoInfo: {
        flex: 1,
    },
    fileInfo: {
        fontSize: 14,
        color: "#555",
        marginBottom: 5,
    },
    noPhotosText: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        marginTop: 20,
    },
    previewButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 20,
    },
    previewButton: {
        backgroundColor: "#333",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        flexDirection: "row",
    },
    previewButtonText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 10,
    },
});