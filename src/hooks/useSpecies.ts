import { useQuery } from '@tanstack/react-query';

export interface Species {
  symbol: string;
  name: string;
  id: string;
  status: string;
  rarity: string;
  image: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  marketCapFormatted: string;
  holders: number;
  tokenAddress: string;
}

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: Species[];
}

export function useSpecies(count: number = 250) {
  return useQuery<Species[]>({
    queryKey: ['species', count],
    queryFn: async () => {
      const response = await fetch(`https://server.fcbc.fun/api/v1/zora/species?count=${count}`);
      if (!response.ok) throw new Error('Failed to fetch species');
      const json: ApiResponse = await response.json();
      return json.data;
    },
    staleTime: 30000,
  });
}
