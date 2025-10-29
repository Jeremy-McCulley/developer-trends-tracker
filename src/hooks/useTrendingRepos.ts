import { useQuery } from '@tanstack/react-query';
import type { RepoData, ChartData } from '../types';
import { fetchTrendingReposApi } from '../api/github';
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


export const useTrendingRepos = () => {
  return useQuery<RepoData[], Error>({
    queryKey: ['trendingRepos'],
    queryFn: fetchTrendingReposApi,
    staleTime: 1000 * 60 * 60,
  });
};