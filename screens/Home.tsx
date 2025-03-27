import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Button } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useHookExample } from "../hooks/useHookExample";
import { getPosts, PostResponse } from "../services/PostService";
import { MaterialIcons } from "@expo/vector-icons";
import Logo from "../assets/logo.svg";

type RootStackParamList = {
    Home: undefined;
    Camera: undefined;
    Location: undefined;
    PostDetail: { postId: number };
};

export default function Home() {
    const hookExampleResponse = useHookExample();
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPosts();
            setPosts(data);
            setLoading(false);
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            setLoading(false);
            console.error("Erro ao buscar posts:", error);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={fetchPosts} style={styles.headerLeft}>
                    <Logo width={30} height={30} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, fetchPosts]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Erro: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => navigation.navigate("Camera")}
            >
                <MaterialIcons name="camera-alt" size={24} color="#fff" />
                <Text style={styles.cameraButtonText}> Tirar foto </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => navigation.navigate("Location")}
            >
                <MaterialIcons name="location-on" size={24} color="#fff" />
                <Text style={styles.cameraButtonText}> Ver Localização </Text>
            </TouchableOpacity>
            {posts.length > 0 ? (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.postContainer}
                            onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
                        >
                            <Text style={styles.postTitle}>{item.title}</Text>
                            <Text style={styles.postDescription}>{item.description}</Text>
                            <Image
                                source={{ uri: item.mediaMobile }}
                                style={styles.postImage}
                                onError={(e) => console.log("Erro ao carregar imagem:", e.nativeEvent.error)}
                            />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <Text>Nenhum post encontrado</Text>
            )}
        </View>
    );
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },

    postContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 10,
        backgroundColor: "#fafafa",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    postTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#222",
        flexShrink: 1,
    },
    postDescription: {
        fontSize: 16,
        color: "#555",
        marginTop: 4,
        flexShrink: 1,
    },
    postOrder: {
        fontSize: 14,
        color: "#999",
        marginTop: 4,
    },
    postImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    headerLeft: {
        marginLeft: 15,
    },
    logo: {
        width: 30,
        height: 30,
    },
    cameraButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333",
        padding: 15,
        margin: 10,
        borderRadius: 5,
    },
    cameraButtonText: {
        color: "#fff",
        marginLeft: 10,
        fontSize: 16,
    },
});