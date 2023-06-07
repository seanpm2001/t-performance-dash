import React from 'react';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale);
import type { SpeedDataPoint } from '../../../common/types/dataPoints';
import { PEAK_COMPLETE_TRIP_TIMES } from '../../../common/constants/baselines';
import { COLORS } from '../../../common/constants/colors';
import { hexWithAlpha } from '../../../common/utils/general';

interface DonutChartSpeedProps {
  data: SpeedDataPoint[][];
}

export const DonutChartSpeed: React.FC<DonutChartSpeedProps> = ({ data }) => {
  if (!data) return null;
  const newData = data.map(
    (data) =>
      (100 * (1 / data[data.length - 1].value)) / (1 / PEAK_COMPLETE_TRIP_TIMES[data[0].line].value)
  );
  return (
    <div className="h-[150px]">
      <PolarArea
        data={{
          datasets: [
            {
              data: newData,
              backgroundColor: [COLORS.mbta.red, COLORS.mbta.orange, COLORS.mbta.blue],
              borderColor: [COLORS.mbta.red, COLORS.mbta.orange, COLORS.mbta.blue],
              borderWidth: 0,
            },
            {
              data: [100, 100, 100],
              borderColor: [COLORS.mbta.red, COLORS.mbta.orange, COLORS.mbta.blue],
              borderWidth: 2,
              backgroundColor: [
                hexWithAlpha(COLORS.mbta.red, 0.2),
                hexWithAlpha(COLORS.mbta.orange, 0.2),
                hexWithAlpha(COLORS.mbta.blue, 0.2),
              ],
            },
          ],
        }}
        options={{
          backgroundColor: '#FFF',
          interaction: { axis: 'r', mode: 'nearest', intersect: false },
          plugins: {
            tooltip: {
              filter: (tooltipItem) => tooltipItem.datasetIndex === 0,
            },
            legend: {
              display: false,
            },
          },
          scales: {
            r: {
              max: 100,
              ticks: {
                display: false,
                color: 'white',
                backdropColor: 'transparent',
                callback: (value) => `${value}%`,
                stepSize: 100,
              },
              grid: {
                display: false,
                color: 'white',
              },
            },
          },
        }}
      />
    </div>
  );
};
