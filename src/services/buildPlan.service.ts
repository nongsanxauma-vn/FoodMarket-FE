import { httpClient, ApiResponse } from './http.client';
import { BuildPlanResponse, BuildPlanCreateRequest, BuildPlanItemCreateRequest } from '../types';

class BuildPlanService {
    private readonly baseUrl = '/build-plans';

    async createPlan(request: BuildPlanCreateRequest): Promise<ApiResponse<BuildPlanResponse>> {
        return httpClient.post<BuildPlanResponse>(this.baseUrl, request);
    }

    async getPlan(id: number): Promise<ApiResponse<BuildPlanResponse>> {
        return httpClient.get<BuildPlanResponse>(`${this.baseUrl}/${id}`);
    }

    async getPlansByBuyer(buyerId: number): Promise<ApiResponse<BuildPlanResponse[]>> {
        return httpClient.get<BuildPlanResponse[]>(`${this.baseUrl}/buyer/${buyerId}`);
    }

    async addMeal(planId: number, request: BuildPlanItemCreateRequest): Promise<ApiResponse<void>> {
        return httpClient.post<void>(`${this.baseUrl}/${planId}/meals`, request);
    }

    async markMealCompleted(mealId: number): Promise<ApiResponse<void>> {
        return httpClient.put<void>(`${this.baseUrl}/meals/${mealId}/complete`, {});
    }

    async deletePlan(planId: number): Promise<ApiResponse<void>> {
        return httpClient.delete<void>(`${this.baseUrl}/${planId}`);
    }

    async deleteMeal(mealId: number): Promise<ApiResponse<void>> {
        return httpClient.delete<void>(`${this.baseUrl}/meals/${mealId}`);
    }
}

export const buildPlanService = new BuildPlanService();
