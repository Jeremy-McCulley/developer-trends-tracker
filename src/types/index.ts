export interface RepoData {
  id: number;
  name: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  description: string | null;
}

export interface ChartData {
  name: string;
  count: number;
}

export interface GithubApiResponse {
  total_count: number;
  incomplete_results: boolean;
  items: RepoData[];
}