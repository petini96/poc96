import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getPostById, PostResponse } from '../services/PostService';

const PostDetailScreen = ({ route }: any) => {
    const { postId } = route.params;
    const [post, setPost] = useState<PostResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPostById(postId);
                setPost(data);
                setLoading(false);
            } catch (err) {
                setError('Erro ao carregar o post');
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    if (error || !post) {
        return (
            <View style={styles.container}>
                <Text>{error || 'Post não encontrado'}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: post.mediaMobile }} style={styles.image} />
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.description}>{post.description}</Text>
            <Text style={styles.order}>Ordem: {post.order}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        color: '#555',
        marginBottom: 10,
    },
    order: {
        fontSize: 16,
        color: '#999',
    },
});

export default PostDetailScreen;