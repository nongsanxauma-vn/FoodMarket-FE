import { httpClient, ApiResponse } from './http.client';

export interface MysteryBox {
  id: number;
  boxType: string;
  imageUrl?: string;
  price: number;
  description?: string;
  note?: string;
  shopOwnerId: number;
}

class MysteryBoxService {
  async getMyBoxes(): Promise<ApiResponse<MysteryBox[]>> {
    return httpClient.get<MysteryBox[]>('/mystery-boxes/me');
  }

  async getById(id: number): Promise<ApiResponse<MysteryBox>> {
    return httpClient.get<MysteryBox>(`/mystery-boxes/${id}`);
  }
}

export const mysteryBoxService = new MysteryBoxService();

