import axios from 'axios';
import { API_BASE_URL } from '@env';

export interface PostResponse {
    id: number;
    media: string;
    mediaMobile: string;
    title: string;
    description: string;
    order: number;
}

interface ApiResponse {
    content: PostResponse[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: { empty: boolean; sorted: boolean; unsorted: boolean };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export async function getPosts(): Promise<PostResponse[]> {
    try {
        const response = await axios.get<ApiResponse>(`${API_BASE_URL}/posts`);
        console.log(response.data);
        return response.data.content;
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        return [];
    }
}

export async function getPostById(id: number): Promise<PostResponse | null> {
    try {
        const response = await axios.get<PostResponse>(`${API_BASE_URL}/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar post com ID ${id}:`, error);
        return null;
    }
}