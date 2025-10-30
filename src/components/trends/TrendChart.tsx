// Import the necessary tools from the 'react' library.
import React from 'react';
// Import the specific components we need to build a bar chart from the 'recharts' library.
// BarChart, Bar, XAxis, YAxis, Tooltip, Legend, and ResponsiveContainer are all parts of the chart.
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
// Import the data shape (blueprint) for the chart data.
import type {ChartData} from '../../types';

// This is the blueprint for the information the component needs to work.
interface TrendChartProps{
    // 'data' is the actual list of numbers and labels that will be drawn on the chart.
    data: ChartData[];
    // 'title' is the text displayed above the chart.
    title: string;
}

// Define the main component called 'TrendChart'. It's a functional component that
// accepts 'data' and 'title' as its inputs (props).
export const TrendChart: React.FC<TrendChartProps> = ({data, title}) => (
    // The main container for the chart, using a CSS class for styling.
    <section className='graphContainer'>
        {/* Display the title of the chart */}
        <p>{title}</p>
        
        {/* A container that makes the chart automatically adjust its size to fit the screen. */}
        <ResponsiveContainer width="100%" height={300}>
            {/* The main bar chart component. We give it the data to draw. */}
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                
                {/* Defines the horizontal (X) axis. It uses the 'name' field from the data for labels. */}
                <XAxis dataKey="name" />
                
                {/* Defines the vertical (Y) axis, which typically shows the count/value. */}
                <YAxis />
                
                {/* The little box that appears when you hover over a bar to show details. */}
                <Tooltip />
                
                {/* A guide that explains what each color/bar represents (though only one bar is used here). */}
                <Legend />
                
                {/* Defines the actual bars in the chart. 
                    'dataKey="count"' uses the 'count' field from the data to determine the height of the bars.
                    'name="Repositories"' sets the label for this series of bars in the Legend. 
                */}
                <Bar dataKey="count" name="Repositories" />
                
            </BarChart>
        </ResponsiveContainer>
    </section>
);