import { httpClient, ApiResponse } from './http.client';
import { PageResponse } from './product.service';

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

    async getAllBlogsPaged(page = 0, size = 10): Promise<ApiResponse<PageResponse<BlogResponse>>> {
        return httpClient.get<PageResponse<BlogResponse>>(`/blogs/paged?page=${page}&size=${size}`);
    }

    async getPublishedBlogs(): Promise<ApiResponse<BlogResponse[]>> {
        return httpClient.get<BlogResponse[]>('/blogs/published');
    }

    async getPublishedBlogsPaged(page = 0, size = 9): Promise<ApiResponse<PageResponse<BlogResponse>>> {
        return httpClient.get<PageResponse<BlogResponse>>(`/blogs/published/paged?page=${page}&size=${size}`);
    }

    async getBlogById(id: number): Promise<ApiResponse<BlogResponse>> {
        return httpClient.get<BlogResponse>(`/blogs/${id}`);
    }

    async createBlog(data: BlogCreationRequest, picture?: File): Promise<ApiResponse<BlogResponse>> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (picture) formData.append('picture', picture);
        return httpClient.post<BlogResponse>('/blogs', formData);
    }

    async updateBlog(id: number, data: Partial<BlogCreationRequest>, picture?: File): Promise<ApiResponse<BlogResponse>> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (picture) formData.append('picture', picture);
        return httpClient.put<BlogResponse>(`/blogs/${id}`, formData);
    }

    async deleteBlog(id: number): Promise<ApiResponse<void>> {
        return httpClient.delete<void>(`/blogs/${id}`);
    }
}

export const blogService = new BlogService();
