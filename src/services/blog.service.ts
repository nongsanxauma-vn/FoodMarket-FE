import { httpClient, ApiResponse } from './http.client';

export interface BlogResponse {
    id: number;
    title: string;
    content: string;
    pictureUrl: string;
    status: string;
    createAt: string;
    adminId: number;
    adminName: string;
}

export interface BlogCreationRequest {
    title: string;
    content: string;
    status: string;
}

class BlogService {
    async getAllBlogs(): Promise<ApiResponse<BlogResponse[]>> {
        return httpClient.get<BlogResponse[]>('/blogs');
    }

    async getPublishedBlogs(): Promise<ApiResponse<BlogResponse[]>> {
        return httpClient.get<BlogResponse[]>('/blogs/published');
    }

    async getBlogById(id: number): Promise<ApiResponse<BlogResponse>> {
        return httpClient.get<BlogResponse>(`/blogs/${id}`);
    }

    async createBlog(data: BlogCreationRequest, picture?: File): Promise<ApiResponse<BlogResponse>> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (picture) {
            formData.append('picture', picture);
        }
        return httpClient.post<BlogResponse>('/blogs', formData);
    }

    async updateBlog(id: number, data: Partial<BlogCreationRequest>, picture?: File): Promise<ApiResponse<BlogResponse>> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (picture) {
            formData.append('picture', picture);
        }
        return httpClient.put<BlogResponse>(`/blogs/${id}`, formData);
    }

    async deleteBlog(id: number): Promise<ApiResponse<void>> {
        return httpClient.delete<void>(`/blogs/${id}`);
    }

    /**
     * Upload rich‑text editor images. Backend returns an object containing `url`.
     */
    async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
        // backend expects field name "file" and returns a simple { url: ... } map
        const formData = new FormData();
        formData.append('file', file);
        return httpClient.post<{ url: string }>('/blogs/upload-image', formData);
    }
}

export const blogService = new BlogService();
