import type { GithubApiResponse, RepoData } from '../types'; 
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || 'YOUR_FALLBACK_TOKEN'; 
const getThirtyDaysAgoDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
};
const START_DATE = getThirtyDaysAgoDate();
interface RepoFilters {
  location?: string;
  topic?: string;
}
export const fetchTrendingReposApi = async (filters: RepoFilters = {}): Promise<RepoData[]> => {
  const MAX_PAGES = 3;  
  let allRepos: RepoData[] = [];
  let searchQuery = `created:>${START_DATE}`; 
  if (filters.location) {
    searchQuery += ` location:${filters.location}`; 
  }
  if (filters.topic) {
    searchQuery += ` topic:${filters.topic}`; 
  }
  const baseParams = `&sort=stars&order=desc&per_page=100`;
  const BASE_URL = 
    `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}${baseParams}`;
  for (let page = 1; page <= MAX_PAGES; page++) {
    // Use the dynamically constructed BASE_URL
    const url = `${BASE_URL}&page=${page}`;
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    if (GITHUB_TOKEN && GITHUB_TOKEN !== 'YOUR_FALLBACK_TOKEN') {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    const response = await fetch(url, { headers });
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`GitHub API request failed with status 403: Rate limit likely exceeded. 
          Ensure you have a valid GitHub Personal Access Token set in your .env file.`);
      }
      throw new Error(`GitHub API request failed on page ${page} with status: ${response.status}`);
    }
    const data: GithubApiResponse = await response.json();
    allRepos = allRepos.concat(data.items); 
    if (data.items.length < 100) {
      console.log(`Finished fetching. Total pages: ${page}. Total repos: ${allRepos.length}`);
      break; 
    }
    await new Promise(resolve => setTimeout(resolve, 500)); 
  }
  return allRepos;
};