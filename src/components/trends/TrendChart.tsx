import React from 'react';
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import type {ChartData} from '../../types';
interface TrendChartProps{
    data: ChartData[];
    title: string;
}
export const TrendChart: React.FC<TrendChartProps> = ({data, title}) => (
    <section className='graphContainer'>
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
    </section>
);