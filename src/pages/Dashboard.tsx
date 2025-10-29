// src/pages/Dashboard.tsx

import React, { useState } from 'react'; 
// Import the new debouncing hook
import { useDebounce } from '../hooks/useDebounce'; 
import { useTrendingRepos, processRepoDataForChart } from '../hooks/useTrendingRepos';
import { TrendChart } from '../components/trends/TrendChart';

// -----------------------------------------------------------------
// Assuming these helper components are defined here or imported:
const LoadingState: React.FC = () => <div>Loading developer trends...</div>;
const ErrorState: React.FC<{ message: string }> = ({ message }) => 
  <div style={{ color: 'red' }}>Error loading trends: {message}.</div>;
// -----------------------------------------------------------------

export const Dashboard: React.FC = () => {
  // 1. STATE: Tracks the input fields instantly (for UI feedback)
  const [inputValues, setInputValues] = useState({
    location: '',
    topic: '',
  });

  // 2. DEBOUNCE: This state only updates 500ms after the user stops typing
  const debouncedFilters = useDebounce(inputValues, 500); 

  // 3. API CALL: The hook uses the SLOW, DEBOUNCED state
  const { data, isLoading, isError, error, isFetching } = useTrendingRepos(debouncedFilters);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={error?.message || 'Unknown error'} />;

  const chartData = processRepoDataForChart(data || []);
  
  // Helper function to update the INSTANT input state
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // Update the inputValues immediately, but leave the debouncedFilters alone
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard-layout" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1>🚀 Developer Interest Tracker</h1>
        <p>Tracking the top trending languages and repositories on GitHub.</p>
        
        {isFetching && (
          <small style={{ color: '#4CAF50', marginLeft: '10px' }}>
            Updating data in background...
          </small>
        )}
      </header>
      
      {/* Input UI uses the INSTANT state */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <input
          type="text"
          name="location"
          placeholder="Filter by Location (e.g., California)"
          value={inputValues.location} // Use inputValues here
          onChange={handleFilterChange}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          name="topic"
          placeholder="Filter by Topic (e.g., llm, typescript)"
          value={inputValues.topic} // Use inputValues here
          onChange={handleFilterChange}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <TrendChart 
        data={chartData} 
        title={`Top 10 Trending Languages (Repository Count) ${debouncedFilters.location || debouncedFilters.topic ? '— FILTERED' : ''}`}
      />
      
      <footer>
        <small>Data sourced from the GitHub Search API.</small>
      </footer>
    </div>
  );
};