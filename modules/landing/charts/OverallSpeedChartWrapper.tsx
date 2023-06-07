import React from 'react';
import { useSpeedDataLanding } from '../../../common/api/hooks/speed';
import { ChartPlaceHolder } from '../../../common/components/graphics/ChartPlaceHolder';
import { OverallSpeedChart } from './OverallSpeedChart';
import { DonutChartSpeed } from './DonutChartSpeed';

export const OverallSpeedChartWrapper: React.FC = () => {
  const speedData = useSpeedDataLanding();
  const speedDataReady = speedData.some((query) => !query.isError && query.data);
  if (!speedDataReady) return <ChartPlaceHolder query={speedData[0]} />;
  const speedDataFiltered = speedData
    .map((query) => query.data)
    .filter((e): e is Exclude<typeof e, undefined> => e !== undefined);
  return (
    <div className="flex flex-row">
      <div className="flex h-[300px] items-center justify-center">
        <DonutChartSpeed data={speedDataFiltered} />
      </div>
      <OverallSpeedChart speedData={speedDataFiltered} />
    </div>
  );
};
