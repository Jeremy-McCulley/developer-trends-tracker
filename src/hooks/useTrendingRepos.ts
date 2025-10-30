// Import a special tool (hook) from the React Query library for managing and caching data fetching.
import { useQuery } from '@tanstack/react-query';
// Import the necessary data shapes (like blueprints) for the repository and chart data.
import type { RepoData, ChartData } from '../types';
// Import the function we wrote earlier to actually call the GitHub API and get the raw data.
import { fetchTrendingReposApi } from '../api/github';

// Define the blueprint for optional filters that can be passed to the data fetcher.
interface RepoFilters {
  // Option to filter repositories by a country or region.
  location?: string;
  // Option to filter repositories by a specific programming language or tech topic.
  topic?: string;
}

// This function takes the raw list of repositories and turns it into a simple list
// that is ready to be displayed on the chart (like a bar chart).
export const processRepoDataForChart = (repos: RepoData[]): ChartData[] => {
  // 1. Count the languages: Loop through all the repositories and count how many
  //    times each programming language appears.
  const languageMap = repos.reduce((acc, repo) => {
    // Check if the repository actually has a language property.
    if (repo.language) {
      // If it does, increase the count for that language by 1.
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    // Return the updated map (the list of language counts).
    return acc;
  }, {} as Record<string, number>);

  // 2. Format, Sort, and Limit: Take the counted languages and prepare them for the chart.
  return Object.entries(languageMap)
    // Convert the map (like { 'JavaScript': 10, 'Python': 5 }) into a list of objects
    // like [{ name: 'JavaScript', count: 10 }].
    .map(([name, count]) => ({ name, count }))
    // Sort the list so the language with the highest count is at the top.
    .sort((a, b) => b.count - a.count)
    // Only keep the top 10 most used languages for display on the chart.
    .slice(0, 10);
};

// This custom React Hook handles fetching, loading, error handling, and caching
// the trending repository data using React Query.
export const useTrendingRepos = (filters: RepoFilters = {}) => {
  // Use the useQuery hook to manage the asynchronous data fetching process.
  return useQuery<RepoData[], Error>({
    // A unique key that React Query uses to identify and cache this data.
    // It changes when the 'filters' change, which tells React Query to fetch new data.
    queryKey: ['trendingRepos', filters], 
    
    // The actual function that runs to fetch the data. It calls our GitHub API function.
    queryFn: () => fetchTrendingReposApi(filters), 
    
    // How long (in milliseconds) the data is considered fresh before it might be
    // fetched again in the background (1 hour in this case).
    staleTime: 1000 * 60 * 60,
  });
};