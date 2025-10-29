// src/hooks/useTrendingRepos.ts

import { useQuery } from '@tanstack/react-query';
import type { RepoData, ChartData } from '../types';
import { fetchTrendingReposApi } from '../api/github';

// ------------------------------
// UPDATED: Define the filter interface
// ------------------------------
interface RepoFilters {
  location?: string;
  topic?: string;
}

export const processRepoDataForChart = (repos: RepoData[]): ChartData[] => {
  const languageMap = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(languageMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

// ------------------------------
// UPDATED: Hook now accepts and uses filters
// ------------------------------
export const useTrendingRepos = (filters: RepoFilters = {}) => {
  return useQuery<RepoData[], Error>({
    // CRITICAL: queryKey now includes filters for unique caching/refetching
    queryKey: ['trendingRepos', filters], 
    
    // Pass the entire filters object to the API function
    queryFn: () => fetchTrendingReposApi(filters), 
    
    staleTime: 1000 * 60 * 60,
  });
};