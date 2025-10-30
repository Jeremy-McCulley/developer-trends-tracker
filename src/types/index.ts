// Define the exact structure (blueprint) for a single repository's data,
// which is pulled directly from the GitHub API.
export interface RepoData {
  // A unique number identifier for the repository.
  id: number;
  // The name of the repository (e.g., "developer-trends-tracker").
  name: string;
  // The main programming language used in the repository (can be null if not defined).
  language: string | null;
  // The total number of stars (popularity) the repository has.
  stargazers_count: number;
  // The total number of times the repository has been copied (forked).
  forks_count: number;
  // A short text describing what the repository does (can be null).
  description: string | null;
}

// Define the simple structure needed for a single bar on the chart.
export interface ChartData {
  // The label for the bar (e.g., the language name like "JavaScript").
  name: string;
  // The value that determines the height of the bar (e.g., the count of repositories).
  count: number;
}

// Define the full structure of the response we expect to get back from the
// GitHub Search API when we look for repositories.
export interface GithubApiResponse {
  // The total number of results found by the search (across all pages).
  total_count: number;
  // A flag indicating if the search results might be incomplete.
  incomplete_results: boolean;
  // The actual list of repositories that matched the search query on this specific page.
  items: RepoData[];
}