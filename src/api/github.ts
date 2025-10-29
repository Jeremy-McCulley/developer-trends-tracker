import type { GithubApiResponse, RepoData } from '../types';

/**
 * Calculates the date 30 days ago and formats it as YYYY-MM-DD for the GitHub API query.
 * @returns {string} The date 30 days ago.
 */
const getThirtyDaysAgoDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
};

const START_DATE = getThirtyDaysAgoDate();
const BASE_GITHUB_API_URL = 
  `https://api.github.com/search/repositories?q=created:>${START_DATE}&sort=stars&order=desc&per_page=100`;

/**
 * Fetches up to the top 1000 trending repositories from GitHub (up to 10 pages).
 * @returns {Promise<RepoData[]>} An array of repository data objects.
 */
export const fetchTrendingReposApi = async (): Promise<RepoData[]> => {
  const MAX_PAGES = 10; 
  let allRepos: RepoData[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${BASE_GITHUB_API_URL}&page=${page}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      // You should add more specific error handling for rate limit (status 403) here
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