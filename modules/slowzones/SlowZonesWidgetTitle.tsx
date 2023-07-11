import React from 'react';
import classNames from 'classnames';
import type { Line } from '../../common/types/lines';
import { useBreakpoint } from '../../common/hooks/useBreakpoint';
import { useDelimitatedRoute } from '../../common/utils/router';
import { LINE_OBJECTS } from '../../common/constants/lines';
import { formatDate } from '../../common/state/utils/dateStoreUtils';

interface SlowZonesWidgetTitle {
  line?: Line;
}

export const SlowZonesWidgetTitle: React.FC<SlowZonesWidgetTitle> = ({ line }) => {
  const isMobile = !useBreakpoint('md');
  const { query } = useDelimitatedRoute();
  const date = query.endDate ? formatDate(query.endDate) : undefined;

  return (
    <div className="flex w-full flex-col items-baseline justify-between gap-x-4 gap-y-1 pb-1 text-base md:flex-row md:text-xl">
      <div className="flex w-full flex-col md:w-auto ">
        <div className="flex w-full flex-row items-baseline justify-between">
          <h2
            className={classNames(
              'font-semibold',
              'whitespace-nowrap leading-tight text-stone-800'
            )}
          >
            Line map
          </h2>
          {isMobile && <Date date={date} line={line} />}
        </div>
      </div>
      <div className="flex w-full flex-shrink flex-col overflow-hidden md:items-end">
        {!isMobile && <Date date={date} line={line} />}
      </div>
    </div>
  );
};

const Date = ({ date, line }: { date?: string; line?: Line }) => {
  return line ? (
    <p className="rounded-md bg-stone-500 px-3 py-1 text-xs italic text-stone-100">{date}</p>
  ) : null;
};
