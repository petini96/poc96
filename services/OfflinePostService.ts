import * as SQLite from 'expo-sqlite';
import { PostResponse } from './PostService';

const db = SQLite.openDatabase('posts.db');

export class OfflinePostService {
    static initDatabase() {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, title TEXT, description TEXT, media TEXT, mediaMobile TEXT, order_num INTEGER)'
            );
        });
    }

    static async savePosts(posts: PostResponse[]) {
        return new Promise<void>((resolve, reject) => {
            db.transaction(tx => {
                // Limpar tabela antes de inserir novos posts
                tx.executeSql('DELETE FROM posts');

                // Inserir novos posts
                posts.forEach(post => {
                    tx.executeSql(
                        'INSERT INTO posts (id, title, description, media, mediaMobile, order_num) VALUES (?, ?, ?, ?, ?, ?)',
                        [post.id, post.title, post.description, post.media, post.mediaMobile, post.order]
                    );
                });
            }, reject, resolve);
        });
    }

    static async getPosts(): Promise<PostResponse[]> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM posts ORDER BY order_num',
                    [],
                    (_, { rows }) => {
                        const posts = rows._array as PostResponse[];
                        resolve(posts);
                    },
                    (_, error) => {
                        reject(error);
                        return false;
                    }
                );
            });
        });
    }
}

// Inicializar banco de dados quando o aplicativo iniciar
OfflinePostService.initDatabase();