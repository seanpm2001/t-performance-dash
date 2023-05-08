import React from 'react';
import { Alerts } from '../commute/alerts/Alerts';
import { Speed } from '../commute/speed/Speed';
import { SlowZonesMap } from '../slowzones/map';
import { WidgetDiv } from '../../common/components/widgets/WidgetDiv';
import { useSlowzoneAllData, useSpeedRestrictionData } from '../../common/api/hooks/slowzones';
import { PageWrapper } from '../../common/layouts/PageWrapper';
import { Service } from '../commute/service/Service';
import { WidgetTitle } from './WidgetTitle';

interface TodayProps {
  lineShort: 'Red' | 'Orange' | 'Blue' | 'Green';
}

export const Today: React.FC<TodayProps> = ({ lineShort }) => {
  const allSlow = useSlowzoneAllData();
  const speedRestrictions = useSpeedRestrictionData();
  const canShowSlowZonesMap = lineShort !== 'Green';

  return (
    <PageWrapper pageTitle={'Today'}>
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 flex-col gap-x-4 gap-y-4 md:grid-cols-2 xl:flex-row">
          {canShowSlowZonesMap && <Service />}
          {canShowSlowZonesMap && <Speed />}
          <Alerts />
        </div>
        {canShowSlowZonesMap && allSlow.data && speedRestrictions.data && (
          <WidgetDiv className="h-full">
            <WidgetTitle title="Slow Zones" />
            <SlowZonesMap
              key={lineShort}
              slowZones={allSlow.data}
              speedRestrictions={speedRestrictions.data}
              lineName={lineShort}
              direction="horizontal-on-desktop"
            />
          </WidgetDiv>
        )}
      </div>
    </PageWrapper>
  );
};
