// src/pages/Dashboard.tsx

// Import the tools needed from React: useState for component memory and React itself.
import React, { useState } from 'react'; 
// Import the custom tool (hook) that delays the update of a search value.
import { useDebounce } from '../hooks/useDebounce'; 
// Import the tools needed to fetch GitHub data and format it for the chart.
import { useTrendingRepos, processRepoDataForChart } from '../hooks/useTrendingRepos';
// Import the component that draws the bar chart.
import { TrendChart } from '../components/trends/TrendChart';

// A small component to display a simple message while data is being loaded for the very first time.
const LoadingState: React.FC = () => <div><p>Loading developer trends...</p></div>;

// A small component to display a clear error message if the data fetching fails.
const ErrorState: React.FC<{ message: string }> = ({ message }) => 
  <div style={{ color: 'red' }}>Error loading trends: {message}.</div>;

// The main component that displays the entire trends dashboard.
export const Dashboard: React.FC = () => {
  // 1. Component State (Memory)
  // Store the current text that the user types into the input boxes.
  const [inputValues, setInputValues] = useState({
    location: '', // Current text for the country filter
    topic: '',    // Current text for the topic filter
  });

  // 2. Debouncing
  // Use the debouncing tool to delay sending the filter values to the API.
  // The 'debouncedFilters' will only update 500ms after the user stops typing.
  const debouncedFilters = useDebounce(inputValues, 500); 

  // 3. Data Fetching
  // Fetch the trending repository data, passing the stable, debounced filter values.
  // This hook handles the loading, success, and error states automatically.
  const { data, isLoading, isError, error, isFetching } = useTrendingRepos(debouncedFilters);

  // 4. Early Exits (Handling States)
  // If the data is loading for the first time, show the loading message and stop here.
  if (isLoading) return <LoadingState />;
  // If an error occurred (e.g., API rate limit hit), show the error message and stop here.
  if (isError) return <ErrorState message={error?.message || 'Unknown error'} />;

  // 5. Data Processing
  // Take the successfully fetched raw data and format it into a list that the chart component can use.
  const chartData = processRepoDataForChart(data || []);

  // 6. Event Handler
  // Function called every time the user types a character into an input field.
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get the name (location/topic) and the new text value from the input.
    const { name, value } = event.target;
    // Update the state with the new value, keeping the other filter value the same.
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  // 7. Component Display (Render)
  return (
    <section className="dashboard-layout">
      <div className='appTitleText'>
        <h1>Developer Trends Tracker</h1>
        <p>Tracking the top trending languages and repositories on GitHub.</p>
        
        {/* Show a message if the data is being updated in the background (after the initial load). */}
        {isFetching && (
          <small style={{ color: '#4CAF50', marginLeft: '10px' }}>
            Updating data in background...
          </small>
        )}
      </div>
      
      {/* Container for the filter input fields. */}
      <div className='filterContainer'>
        {/* Input for filtering by country/location. */}
        <input
          type="text"
          name="location"
          placeholder="Filter by Country"
          value={inputValues.location} // Display the current user input
          onChange={handleFilterChange} // Call handler when input changes
        />
        {/* Input for filtering by programming language/topic. */}
        <input
          type="text"
          name="topic"
          placeholder="Filter by Topic"
          value={inputValues.topic} // Display the current user input
          onChange={handleFilterChange} // Call handler when input changes
        />
      </div>

      {/* The chart component, passed the formatted data and a dynamic title. */}
      <TrendChart 
        data={chartData} 
        // The title dynamically adds "— FILTERED" if either filter has a value.
        title={`Top 10 Trending Languages (Repository Count) ${debouncedFilters.location || debouncedFilters.topic ? '— FILTERED' : ''}`}
      />
    </section>
  );
};