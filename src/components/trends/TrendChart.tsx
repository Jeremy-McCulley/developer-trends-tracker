import React from 'react';
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import type {ChartData} from '../../types';
interface TrendChartProps{
    data: ChartData[];
    title: string;
}
export const TrendChart: React.FC<TrendChartProps> = ({data, title}) => (
    // Update the markup with semantic elements and remove the inline. This will be done after the main logic for the app is complete
    <div style={{padding: '20px', border: '1px solid #eee', borderRadius: '8px'}}>
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#555" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Repositories" fill="#2979FF" />
            </BarChart>
    </ResponsiveContainer>
    </div>
);