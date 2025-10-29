// src/pages/Dashboard.tsx

import React, { useState } from 'react'; // UPDATED: Import useState
import { useTrendingRepos, processRepoDataForChart } from '../hooks/useTrendingRepos';
import { TrendChart } from '../components/trends/TrendChart';

const LoadingState: React.FC = () => <div>Loading developer trends...</div>;
const ErrorState: React.FC<{ message: string }> = ({ message }) => 
  <div style={{ color: 'red' }}>Error loading trends: {message}.</div>;

export const Dashboard: React.FC = () => {
  // ----------------------------------------------------------------------
  // NEW: State for the filters (location and topic)
  // ----------------------------------------------------------------------
  const [filters, setFilters] = useState({
    location: '', // User will input values like 'California' or 'UK'
    topic: '',    // User will input values like 'llm' or 'react'
  });

  // Pass the state to the hook
  const { data, isLoading, isError, error, isFetching } = useTrendingRepos(filters);

  // Helper function to update state when an input changes
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  // ----------------------------------------------------------------------

  if (isLoading) return <LoadingState />; // Block the UI only on first load
  if (isError) return <ErrorState message={error?.message || 'Unknown error'} />;

  const chartData = processRepoDataForChart(data || []);
  
  const isFiltered = filters.location || filters.topic;

  return (
    <div className="dashboard-layout" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1>🚀 Developer Interest Tracker</h1>
        <p>Tracking the top trending languages and repositories on GitHub.</p>
        
        {/* The subtle indicator for background refetches */}
        {isFetching && (
          <small style={{ color: '#4CAF50', marginLeft: '10px' }}>
            Updating data in background...
          </small>
        )}
      </header>
      
      {/* ---------------------------------------------------------------------- */}
      {/* NEW: Filter Input UI */}
      {/* ---------------------------------------------------------------------- */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <input
          type="text"
          name="location"
          placeholder="Filter by Location (e.g., California)"
          value={filters.location}
          onChange={handleFilterChange}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          name="topic"
          placeholder="Filter by Topic (e.g., llm, typescript)"
          value={filters.topic}
          onChange={handleFilterChange}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      {/* ---------------------------------------------------------------------- */}

      <TrendChart 
        data={chartData} 
        title={`Top 10 Trending Languages (Repository Count) ${isFiltered ? '— Filtered' : ''}`}
      />
      <footer style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        <small>Data sourced from the GitHub Search API.</small>
      </footer>
    </div>
  );
};