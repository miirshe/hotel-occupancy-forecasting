"use client"
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ChartComponent = ({ data }) => {
  const { bookings, cancellations } = data || {};
  console.log("data v1:", data)

  const processData = (dataObj) => {
    if (!dataObj) {
      return { labels: [], values: [] };
    }

    const labels = Object.keys(dataObj).map((key) => key.replace(/[()]/g, ''));
    const values = Object.values(dataObj);
    return { labels, values };
  };

  const bookingsYearly = processData(bookings?.yearly);
  const cancellationsYearly = processData(cancellations?.yearly);
  const bookingsMonthly = processData(bookings?.monthly);
  const cancellationsMonthly = processData(cancellations?.monthly);
  const bookingsPerMonth = processData(bookings?.per_month);
  const cancellationsPerMonth = processData(cancellations?.per_month);

  return (
    <div className='container'>
      <h2>Yearly Bookings</h2>
      <Bar
        data={{
          labels: bookingsYearly.labels,
          datasets: [
            {
              label: 'Bookings',
              data: bookingsYearly.values,
              backgroundColor: 'rgba(75,192,192,0.6)',
            },
          ],
        }}
      />

      <h2>Yearly Cancellations</h2>
      <Bar
        data={{
          labels: cancellationsYearly.labels,
          datasets: [
            {
              label: 'Cancellations',
              data: cancellationsYearly.values,
              backgroundColor: 'rgba(255,99,132,0.6)',
            },
          ],
        }}
      />

      <h2>Monthly Bookings</h2>
      <Line
        data={{
          labels: bookingsMonthly.labels,
          datasets: [
            {
              label: 'Bookings',
              data: bookingsMonthly.values,
              backgroundColor: 'rgba(75,192,192,0.6)',
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
            },
          ],
        }}
      />

      <h2>Monthly Cancellations</h2>
      <Line
        data={{
          labels: cancellationsMonthly.labels,
          datasets: [
            {
              label: 'Cancellations',
              data: cancellationsMonthly.values,
              backgroundColor: 'rgba(255,99,132,0.6)',
              fill: false,
              borderColor: 'rgba(255,99,132,1)',
            },
          ],
        }}
      />

      <h2>Bookings Per Month</h2>
      <Bar
        data={{
          labels: bookingsPerMonth.labels,
          datasets: [
            {
              label: 'Bookings',
              data: bookingsPerMonth.values,
              backgroundColor: 'rgba(75,192,192,0.6)',
            },
          ],
        }}
      />

      <h2>Cancellations Per Month</h2>
      <Bar
        data={{
          labels: cancellationsPerMonth.labels,
          datasets: [
            {
              label: 'Cancellations',
              data: cancellationsPerMonth.values,
              backgroundColor: 'rgba(255,99,132,0.6)',
            },
          ],
        }}
      />
    </div>
  );
};

export default ChartComponent;
