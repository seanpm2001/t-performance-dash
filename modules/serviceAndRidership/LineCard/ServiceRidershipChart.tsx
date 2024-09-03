import React, { useMemo } from 'react';

import type { LineData } from '../types';

import type { Dataset } from '../../../common/components/charts/TimeSeriesChart';
import { TimeSeriesChart } from '../../../common/components/charts/TimeSeriesChart';
import styles from './LineCard.module.css';

type Props = {
  ridershipHistory: LineData['ridershipHistory'];
  serviceHistory: LineData['serviceHistory'];
  color: string;
  startDate: null | string;
  endDate: null | string;
  lineTitle: string;
  lineId: string;
};

const dateFormatter = new Intl.DateTimeFormat('en-US');

const getRidershipNoun = (lineId: string) => {
  if (['line-Red', 'line-Orange', 'line-Blue', 'line-Green'].includes(lineId)) {
    return 'faregate validations';
  }
  return 'riders';
};

const asPercentString = (p: number) => Math.round(100 * p).toString() + '%';

const getNormalizedData = (
  data: Record<string, number>,
  startDate: null | string,
  endDate: null | string
) => {
  const dateStringsWithinRange = Object.keys(data)
    .filter((date) => {
      if (!startDate || !endDate) {
        return true;
      }
      return date >= startDate && date <= endDate;
    })
    .sort();
  const baseline = data[dateStringsWithinRange[0]];
  return dateStringsWithinRange.map((date) => ({
    date,
    value: data[date] / baseline,
    actualValue: data[date],
  }));
};

export const ServiceRidershipChart = (props: Props) => {
  const { color, serviceHistory, ridershipHistory, startDate, endDate, lineTitle, lineId } = props;

  const data = useMemo((): Dataset[] => {
    const service: Dataset = {
      label: 'Service levels',
      data: getNormalizedData(serviceHistory, startDate, endDate),
      style: {
        fillPattern: 'striped' as const,
        tooltipLabel(point) {
          const { actualValue } = point as unknown as { actualValue: number };
          return `Service levels: ${actualValue} trips/day`;
        },
      },
    };
    if (ridershipHistory) {
      return [
        service,
        {
          label: 'Ridership',
          data: getNormalizedData(ridershipHistory, startDate, endDate),
          style: {
            tooltipLabel(point) {
              const { actualValue } = point as unknown as { actualValue: number };
              return `Ridership: ${actualValue} ${getRidershipNoun(lineId)}/day`;
            },
          },
        },
      ];
    }
    return [service];
  }, [serviceHistory, startDate, endDate, ridershipHistory, lineId]);

  //   const columns = useMemo(() => {
  //     const ridershipNoun = getRidershipNoun(lineId);
  //     return [
  //       { title: 'Date', values: dateStrings },
  //       ridershipHistory && {
  //         title: `Ridership (${ridershipNoun}/day)`,
  //         values: ridershipHistory,
  //       },
  //       ridershipPercentage && {
  //         title: 'Ridership (percentage)',
  //         values: ridershipPercentage.map(asPercentString),
  //       },
  //       serviceHistory && { title: 'Service levels (trips/day)', values: serviceHistory },
  //       servicePercentage && {
  //         title: 'Service levels (percentage)',
  //         values: servicePercentage.map(asPercentString),
  //       },
  //     ].filter((x) => x);
  //   }, [dateStrings, ridershipHistory, ridershipPercentage, serviceHistory, servicePercentage]);

  return (
    <div className={styles.serviceAndRidershipChartContainer}>
      {/* <DataTable columns={columns} caption={`Service levels and ridership (${lineTitle})`} /> */}
      <TimeSeriesChart
        data={data}
        valueAxis={{ renderTickLabel: asPercentString, min: 0 }}
        timeAxis={{ granularity: 'week' }}
        legend={{ visible: true, align: 'end', position: 'top' }}
        style={{ color, stepped: true, fill: true }}
      />
    </div>
  );
};
