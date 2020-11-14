import React, { useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import ReactApexChart from 'react-apexcharts';

import { useStyles } from '../hooks/styles';
import { useData } from '../hooks/socket-data';

const UPLOAD_COLOR = '#bf71ff';
const DOWNLOAD_COLOR = '#6afff3';

export const Chart = ({ socket }: { socket: SocketIOClient.Socket }): JSX.Element => {
  const data = useData(socket);
  const { paper } = useStyles();

  return (
    <Paper className={paper} elevation={3}>
      <ReactApexChart
        height="100%"
        type="area"
        options={{
          chart: {
            type: 'area',
            stacked: true,
          },
          colors: [DOWNLOAD_COLOR, UPLOAD_COLOR],
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'smooth',
          },
          fill: {
            type: 'gradient',
            gradient: {
              opacityFrom: 0.6,
              opacityTo: 0.8,
            },
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left',
            labels: {
              colors: '#ffffff',
              useSeriesColors: false,
            },
          },
          grid: {
            yaxis: {
              lines: {
                show: false,
              },
            },
          },
          xaxis: {
            type: 'datetime',
            labels: {
              style: {
                colors: '#ffffff',
              },
            },
          },
          yaxis: {
            labels: {
              formatter: (value: number) => value + ' Mbps',
              style: {
                colors: '#ffffff',
              },
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
        }}
        series={[
          {
            name: 'Download',
            data: data
              .filter((value) => new Date(value.date) > new Date(Date.now() - 900000))
              .map((value) => [value.date, parseFloat((value.download / 1000 / 1000 * 8).toFixed(2))]),
          },
          {
            name: 'Upload',
            data: data
              .filter((value) => new Date(value.date) > new Date(Date.now() - 900000))
              .map((value) => [value.date, parseFloat((value.upload / 1000 / 1000 * 8).toFixed(2))]),
          },
        ]}
      />
    </Paper>
  );
};