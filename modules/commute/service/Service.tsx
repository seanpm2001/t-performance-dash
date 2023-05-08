import React from 'react';
import classNames from 'classnames';
import { Tooltip } from 'flowbite-react';
import { useDelimitatedRoute } from '../../../common/utils/router';
import { lineColorBackground } from '../../../common/styles/general';
import { InfoTooltip } from '../../../common/components/general/InfoTooltip';
import { CompWidget } from '../../../common/components/widgets/internal/CompWidget';
import { MINIMUMS } from '../../speed/constants/speeds';
import { AlertEffect } from '../../../common/types/alerts';
import { ShuttleAlert } from '../alerts/ShuttleAlert';
import { getRelevantAlerts } from '../alerts/AlertBox';
import { randomUpsetEmoji } from '../../../common/utils/emoji';
import { SuspensionAlert } from '../alerts/SuspensionAlert';
import { useAlertsData } from '../../../common/api/hooks/alerts';

export const Service: React.FC = () => {
  const { line, lineShort } = useDelimitatedRoute();

  // Check if shuttling
  const alerts = useAlertsData(lineShort);
  const serviceAlert = alerts.data
    ? getRelevantAlerts(alerts.data, 'current').find(
        (alert) => alert?.type === AlertEffect.SHUTTLE || alert?.type === AlertEffect.SUSPENSION
      )
    : undefined;

  const divStyle = classNames(
    'items-center justify-center rounded-lg py-4 px-6 text-center text-opacity-95 text-white',
    lineColorBackground[line ?? 'DEFAULT']
  );

  const headwayPH = 'x:xx';
  const weeklyCompPH = 0;
  const peakCompPH = 0;

  return (
    <div className={divStyle}>
      <div className="flex flex-row items-baseline justify-between">
        <p className="text-2xl font-semibold">Service</p>
        <InfoTooltip info={`Placeholder`} />
      </div>
      {serviceAlert && headwayPH ? (
        <div className="mt-2 flex flex-col justify-center gap-x-1">
          <div className={'self-center'}>
            <Tooltip
              content={
                <p className="max-w-xs">
                  {
                    "We can't calculate train speed during line shuttling (even partial shuttling) or service suspensions"
                  }
                </p>
              }
            >
              <p
                className={classNames(
                  'm-3 select-none self-center rounded-lg bg-black bg-opacity-20 p-3 text-7xl'
                )}
              >
                {randomUpsetEmoji()}
              </p>
            </Tooltip>
          </div>
          {serviceAlert.type === AlertEffect.SHUTTLE ? (
            <ShuttleAlert alert={serviceAlert} lineShort={lineShort} type={'current'} />
          ) : serviceAlert.type === AlertEffect.SUSPENSION ? (
            <SuspensionAlert alert={serviceAlert} lineShort={lineShort} type={'current'} />
          ) : null}
        </div>
      ) : (
        <>
          <div className="mt-2 flex flex-row items-baseline justify-center gap-x-1">
            <p className={classNames('text-5xl font-semibold')}>{headwayPH ?? '...'}</p>
            <p className="text-xl">min</p>
          </div>
          <div className="pt-4">
            <div className="mt-2 flex flex-col gap-x-2 gap-y-2">
              <CompWidget
                value={weeklyCompPH}
                text={
                  <p>
                    Than <b>7 day</b> average
                  </p>
                }
              />
              <CompWidget
                value={peakCompPH}
                text={
                  <p>
                    Than <b>system peak</b> ({MINIMUMS[line ?? 'DEFAULT'].date})
                  </p>
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
