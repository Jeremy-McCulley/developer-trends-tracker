// Import necessary data shapes (like blueprints) for the function.
import type { GithubApiResponse, RepoData } from '../types'; 

// Get the secret GitHub access token from your setup, or use a placeholder if not found.
// This token is needed to make more requests to GitHub without hitting rate limits.
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || 'YOUR_FALLBACK_TOKEN'; 

// This helper function figures out the date exactly 30 days ago.
const getThirtyDaysAgoDate = (): string => {
  // Create a new date object for today.
  const date = new Date();
  // Subtract 30 days from the current date.
  date.setDate(date.getDate() - 30);
  // Convert the date into a simple YYYY-MM-DD string format that GitHub needs.
  return date.toISOString().split('T')[0];
};

// Store the calculated start date (30 days ago) for use in the search.
const START_DATE = getThirtyDaysAgoDate();

// Defines the options you can use to filter the search results.
interface RepoFilters {
  // Option to filter repositories by a country or region.
  location?: string;
  // Option to filter repositories by a specific programming language or tech topic.
  topic?: string;
}

// Main function to fetch the most popular (trending) GitHub repositories.
// It takes optional filters (like location or topic) and returns a list of repositories.
export const fetchTrendingReposApi = async (filters: RepoFilters = {}): Promise<RepoData[]> => {
  // Set a maximum limit on how many pages of results the function will try to fetch.
  const MAX_PAGES = 3; 
  // An empty list to store all the repositories we find across all pages. 
  let allRepos: RepoData[] = [];
  
  // Start the GitHub search query. The first part ensures we only get
  // repositories created since the START_DATE (30 days ago).
  let searchQuery = `created:>${START_DATE}`; 
  
  // If the user provided a location filter, add it to the search query.
  if (filters.location) {
    searchQuery += ` location:${filters.location}`; 
  }
  
  // If the user provided a topic filter, add it to the search query.
  if (filters.topic) {
    searchQuery += ` topic:${filters.topic}`; 
  }
  
  // Set the standard search settings: sort by stars (most popular first)
  // and get 100 results per page.
  const baseParams = `&sort=stars&order=desc&per_page=100`;
  
  // Build the main URL for the GitHub API request.
  const BASE_URL = 
    `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}${baseParams}`;
  
  // Loop through the defined number of pages (up to MAX_PAGES).
  for (let page = 1; page <= MAX_PAGES; page++) {
    // Append the current page number to the URL for pagination.
    const url = `${BASE_URL}&page=${page}`;
    
    // Set up the request headers (like a note to GitHub about what kind of data we want).
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    // If a valid secret token exists, add it to the headers to get higher rate limits.
    if (GITHUB_TOKEN && GITHUB_TOKEN !== 'YOUR_FALLBACK_TOKEN') {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    
    // Send the request to the GitHub API.
    const response = await fetch(url, { headers });
    
    // Check if the request was successful (status code 200-299).
    if (!response.ok) {
      // If the error is 403, it means the rate limit was hit.
      if (response.status === 403) {
        throw new Error(`GitHub API request failed with status 403: Rate limit likely exceeded. 
          Ensure you have a valid GitHub Personal Access Token set in your .env file.`);
      }
      // For any other error, stop and report the issue.
      throw new Error(`GitHub API request failed on page ${page} with status: ${response.status}`);
    }
    
    // Convert the response from GitHub into a JavaScript object.
    const data: GithubApiResponse = await response.json();
    
    // Add the list of repositories from the current page to our main list.
    allRepos = allRepos.concat(data.items); 
    
    // If the number of results on this page is less than 100,
    // it means we've reached the end of the results, so we stop early.
    if (data.items.length < 100) {
      console.log(`Finished fetching. Total pages: ${page}. Total repos: ${allRepos.length}`);
      break; // Stop the loop.
    }
    
    // Wait for half a second (500ms) before making the next request.
    // This helps avoid hitting rate limits or overwhelming the server.
    await new Promise(resolve => setTimeout(resolve, 500)); 
  }
  
  // Return the complete list of trending repositories.
  return allRepos;
};