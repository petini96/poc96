import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions, FlatList, Image } from "react-native";
import SignatureCanvas from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import * as ScreenOrientation from "expo-screen-orientation";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const db = SQLite.openDatabase("signatures.db");

export default function SignatureScreen() {
    const signatureRef = useRef<any>(null);
    const navigation = useNavigation();
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));
    const [signatures, setSignatures] = useState<{ uri: string; timestamp: string }[]>([]);
    const [showCanvas, setShowCanvas] = useState(true);
    
    useEffect(() => {
        navigation.setOptions({
            headerShown: !showCanvas,
        });
    }, [showCanvas, navigation]);
    
    useEffect(() => {
        const subscription = Dimensions.addEventListener("change", ({ window }) => {
            setDimensions(window);
        });

        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        };
        lockOrientation();
        
        loadSignatures();

        return () => {
            subscription?.remove();
        };
    }, []);
    
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS signatures (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, timestamp TEXT);",
                [],
                () => console.log("Tabela de assinaturas criada com sucesso"),
                (_, error) => {
                    console.error("Erro ao criar tabela de assinaturas:", error);
                    return false;
                }
            );
        });
    }, []);
    
    const loadSignatures = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT uri, timestamp FROM signatures ORDER BY timestamp DESC;",
                [],
                (_, { rows }) => {
                    const loadedSignatures = rows._array.map((row) => ({
                        uri: row.uri,
                        timestamp: row.timestamp,
                    }));
                    setSignatures(loadedSignatures);
                },
                (_, error) => {
                    console.error("Erro ao carregar assinaturas:", error);
                    return false;
                }
            );
        });
    };

    const saveSignature = () => {
        signatureRef.current.readSignature();
    };

    const handleSignature = async (signature: string) => {
        try {
            const base64Data = signature.replace("data:image/png;base64,", "");
            const timestamp = Date.now();
            const fileName = `${FileSystem.documentDirectory}signature_${timestamp}.png`;

            await FileSystem.writeAsStringAsync(fileName, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            });

            db.transaction((tx) => {
                tx.executeSql(
                    "INSERT INTO signatures (uri, timestamp) VALUES (?, ?);",
                    [fileName, new Date().toISOString()],
                    async (_, { insertId }) => {
                        console.log("Assinatura salva no SQLite com ID:", insertId);
                        Alert.alert("Sucesso", "Assinatura salva com sucesso!");
                        setSignatures((prev) => [
                            { uri: fileName, timestamp: new Date().toISOString() },
                            ...prev,
                        ]);
                        setShowCanvas(false);
                    },
                    (_, error) => {
                        console.error("Erro ao salvar assinatura no SQLite:", error);
                        Alert.alert("Erro", "Falha ao salvar a assinatura.");
                        return false;
                    }
                );
            });
        } catch (error) {
            console.error("Erro ao salvar assinatura:", error);
            Alert.alert("Erro", "Falha ao processar a assinatura.");
        }
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    };

    const clearSignature = () => {
        signatureRef.current.clearSignature();
    };

    const handleBack = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        navigation.goBack();
    };

    const openCanvasAgain = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        setShowCanvas(true);
    };

    const deleteSignature = (uri: string) => {
        Alert.alert(
            "Excluir Assinatura",
            "Tem certeza que deseja excluir esta assinatura?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => {
                        db.transaction((tx) => {
                            tx.executeSql(
                                "DELETE FROM signatures WHERE uri = ?;",
                                [uri],
                                () => {
                                    
                                    FileSystem.deleteAsync(uri).catch((err) =>
                                        console.error("Erro ao excluir arquivo:", err)
                                    );
                                    
                                    setSignatures((prev) => prev.filter((sig) => sig.uri !== uri));
                                    Alert.alert("Sucesso", "Assinatura excluída com sucesso!");
                                },
                                (_, error) => {
                                    console.error("Erro ao excluir assinatura do SQLite:", error);
                                    Alert.alert("Erro", "Falha ao excluir a assinatura.");
                                    return false;
                                }
                            );
                        });
                    },
                },
            ]
        );
    };

    const { width, height } = dimensions;

    return (
        <View style={styles.container}>
            {showCanvas ? (
                <View style={styles.canvasContainer}>
                    <SignatureCanvas
                        ref={signatureRef}
                        onOK={handleSignature}
                        penColor="#000"
                        descriptionText=""
                        clearText="Limpar"
                        confirmText="Salvar"
                        autoClear={false}
                        webStyle={`
                            .m-signature-pad { 
                                border: 2px solid #ddd; 
                                border-radius: 10px; 
                                box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
                                width: ${width}px; 
                                height: ${height}px; 
                                margin: 0; 
                                padding: 0;
                                position: absolute;
                                top: 0;
                                left: 0;
                            }
                            .m-signature-pad--body { 
                                background-color: #fff; 
                                width: 100%; 
                                height: 100%; 
                            }
                            .m-signature-pad--body canvas { 
                                width: 100% !important; 
                                height: 100% !important; 
                            }
                            .m-signature-pad--footer { 
                                display: flex; 
                                flex-direction: row; 
                                justify-content: space-around; 
                                padding: 10px; 
                                position: absolute; 
                                bottom: 0; 
                                width: 100%; 
                            }
                        `}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={clearSignature}>
                            <MaterialIcons name="clear" size={30} color="#fff" />
                            <Text style={styles.buttonText}>Limpar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={saveSignature}>
                            <MaterialIcons name="save" size={30} color="#fff" />
                            <Text style={styles.buttonText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleBack}>
                            <MaterialIcons name="arrow-back" size={30} color="#fff" />
                            <Text style={styles.buttonText}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.previewContainer}>
                    <Text style={styles.previewTitle}>Assinaturas Salvas</Text>
                    {signatures.length > 0 ? (
                        <FlatList
                            data={signatures}
                            keyExtractor={(item) => item.uri}
                            renderItem={({ item }) => (
                                <View style={styles.signatureItem}>
                                    <Image source={{ uri: item.uri }} style={styles.previewImage} />
                                    <View style={styles.signatureInfo}>
                                        <Text style={styles.fileInfo}>
                                            Data: {new Date(item.timestamp).toLocaleString()}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => deleteSignature(item.uri)}
                                        >
                                            <MaterialIcons name="delete" size={24} color="#fff" />
                                            <Text style={styles.deleteButtonText}>Excluir</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            contentContainerStyle={styles.listContainer}
                        />
                    ) : (
                        <Text style={styles.noSignaturesText}>Nenhuma assinatura salva ainda</Text>
                    )}
                    <View style={styles.previewButtons}>
                        <TouchableOpacity style={styles.previewButton} onPress={openCanvasAgain}>
                            <MaterialIcons name="edit" size={30} color="#fff" />
                            <Text style={styles.previewButtonText}>Nova Assinatura</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.previewButton} onPress={handleBack}>
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
        backgroundColor: "#f5f5f5",
    },
    canvasContainer: {
        flex: 1,
        position: "relative",
    },
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    button: {
        backgroundColor: "#333",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        flexDirection: "row",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 10,
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
    signatureItem: {
        flexDirection: "row",
        marginBottom: 20,
        backgroundColor: "#fafafa",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
    },
    previewImage: {
        width: 100,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    signatureInfo: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    fileInfo: {
        fontSize: 14,
        color: "#555",
    },
    deleteButton: {
        backgroundColor: "#d32f2f",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 14,
        marginLeft: 5,
    },
    listContainer: {
        paddingBottom: 20,
    },
    noSignaturesText: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        marginTop: 20,
    },
    previewButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
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