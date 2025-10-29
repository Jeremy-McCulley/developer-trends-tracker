// src/pages/Dashboard.tsx

import React, { useState } from 'react'; 
// Import the new debouncing hook
import { useDebounce } from '../hooks/useDebounce'; 
import { useTrendingRepos, processRepoDataForChart } from '../hooks/useTrendingRepos';
import { TrendChart } from '../components/trends/TrendChart';
const LoadingState: React.FC = () => <div>Loading developer trends...</div>;
const ErrorState: React.FC<{ message: string }> = ({ message }) => 
  <div style={{ color: 'red' }}>Error loading trends: {message}.</div>;
export const Dashboard: React.FC = () => {
  const [inputValues, setInputValues] = useState({
    location: '',
    topic: '',
  });
  const debouncedFilters = useDebounce(inputValues, 500); 
  const { data, isLoading, isError, error, isFetching } = useTrendingRepos(debouncedFilters);
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={error?.message || 'Unknown error'} />;
  const chartData = processRepoDataForChart(data || []);
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValues(prev => ({ ...prev, [name]: value }));
  };
  return (
    <section className="dashboard-layout">
      <div className='appTitleText'>
        <h1>Developer Trends Tracker</h1>
        <p>Tracking the top trending languages and repositories on GitHub.</p>
        
        {isFetching && (
          <small style={{ color: '#4CAF50', marginLeft: '10px' }}>
            Updating data in background...
          </small>
        )}
      </div>
      <div className='filterContainer'>
        <input
          type="text"
          name="location"
          placeholder="Filter by Country"
          value={inputValues.location}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="topic"
          placeholder="Filter by Topic"
          value={inputValues.topic}
          onChange={handleFilterChange}
        />
      </div>

      <TrendChart 
        data={chartData} 
        title={`Top 10 Trending Languages (Repository Count) ${debouncedFilters.location || debouncedFilters.topic ? '— FILTERED' : ''}`}
      />
    </section>
  );
};