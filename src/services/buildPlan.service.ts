import { httpClient, ApiResponse } from './http.client';
import { BuildPlanResponse, BuildPlanDetailRequest } from '../types';

class BuildPlanService {
    private readonly baseUrl = '/build_plans';

    async createPlan(request: BuildPlanDetailRequest): Promise<ApiResponse<BuildPlanResponse>> {
        return httpClient.post<BuildPlanResponse>(this.baseUrl, request);
    }

    async getPlanById(id: number): Promise<ApiResponse<BuildPlanResponse>> {
        return httpClient.get<BuildPlanResponse>(`${this.baseUrl}/${id}`);
    }

    async getPlansByUser(userId: number): Promise<ApiResponse<BuildPlanResponse[]>> {
        return httpClient.get<BuildPlanResponse[]>(`${this.baseUrl}/user/${userId}`);
    }

    async updatePlan(id: number, request: BuildPlanDetailRequest): Promise<ApiResponse<BuildPlanResponse>> {
        return httpClient.put<BuildPlanResponse>(`${this.baseUrl}/${id}`, request);
    }

    async deletePlan(id: number): Promise<ApiResponse<string>> {
        return httpClient.delete<string>(`${this.baseUrl}/${id}`);
    }
}

export const buildPlanService = new BuildPlanService();
