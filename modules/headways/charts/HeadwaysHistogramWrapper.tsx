import React from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { SingleDayDataPoint } from '../../../common/types/charts';
import type { Station } from '../../../common/types/stations';
import { ChartPlaceHolder } from '../../../common/components/graphics/ChartPlaceHolder';
import { WidgetCarousel } from '../../../common/components/general/WidgetCarousel';
import { CarouselGraphDiv } from '../../../common/components/charts/CarouselGraphDiv';
import { WidgetForCarousel } from '../../../common/components/widgets/internal/WidgetForCarousel';
import { NoDataNotice } from '../../../common/components/notices/NoDataNotice';
import { TimeWidgetValue } from '../../../common/types/basicWidgets';
import { HeadwaysHistogram } from './HeadwaysHistogram';

interface HeadwaysHistogramWrapperProps {
  query: UseQueryResult<SingleDayDataPoint[]>;
  toStation: Station | undefined;
  fromStation: Station | undefined;
}

export const HeadwaysHistogramWrapper: React.FC<HeadwaysHistogramWrapperProps> = ({
  query,
  toStation,
  fromStation,
}) => {
  const dataReady = !query.isError && query.data && toStation && fromStation;
  if (!dataReady) return <ChartPlaceHolder query={query} />;
  if (query.data.length < 1) return <NoDataNotice />;
  const sortedData = query.data.sort((a, b) => {
    if (a.headway_time_sec && b.headway_time_sec) return a.headway_time_sec - b.headway_time_sec;
    return 0;
  });

  return (
    <CarouselGraphDiv>
      <WidgetCarousel isSingleWidget>
        <WidgetForCarousel
          layoutKind="no-delta"
          analysis={'Median'}
          widgetValue={
            new TimeWidgetValue(sortedData[Math.round(sortedData.length / 2)].headway_time_sec)
          }
        />
      </WidgetCarousel>
      <HeadwaysHistogram headways={query.data} fromStation={fromStation} toStation={toStation} />
    </CarouselGraphDiv>
  );
};
