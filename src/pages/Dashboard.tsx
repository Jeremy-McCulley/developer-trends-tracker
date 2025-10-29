// src/pages/Dashboard.tsx

import React from 'react';
// Make sure this import is correct:
import { useTrendingRepos, processRepoDataForChart } from '../hooks/useTrendingRepos';
import { TrendChart } from '../components/trends/TrendChart';
const LoadingState: React.FC = () => <div>Loading developer trends...</div>;
const ErrorState: React.FC<{ message: string }> = ({ message }) => 
  <div style={{ color: 'red' }}>Error loading trends: {message}.</div>;
export const Dashboard: React.FC = () => {
  const { data, isLoading, isError, error, isFetching } = useTrendingRepos();
  if (isLoading) return <LoadingState />; // Block the UI only on first load
  if (isError) return <ErrorState message={error?.message || 'Unknown error'} />;
  const chartData = processRepoDataForChart(data || []);
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
      
      <TrendChart 
        data={chartData} 
        title="Top 10 Trending Languages (Repository Count)" 
      />
      <footer style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        <small>Data sourced from the GitHub Search API.</small>
      </footer>
    </div>
  );
};