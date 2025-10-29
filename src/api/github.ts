import type { GithubApiResponse, RepoData } from "../types";
// Using a hardcoded recent date for the GitHub Search API for trending repos
const GITHUB_API_URL = 'https://api.github.com/search/repositories?q=created:%3E2025-10-21&sort=stars&order=desc';
export const fetchTrendingReposApi = async(): Promise<RepoData[]> => {
    const response = await fetch(GITHUB_API_URL, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
        },
    });
    if(!response.ok){
        throw new Error('Github API request failed: ${response.status}');
    }
    const data: GithubApiResponse = await response.json();
    return data.items;
}