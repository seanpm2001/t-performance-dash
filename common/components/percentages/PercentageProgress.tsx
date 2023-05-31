import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Link from 'next/link';
import type { Line } from '../../types/lines';
import { LINE_COLORS, LINE_COLORS_LIGHT } from '../../constants/colors';
import { LINE_OBJECTS } from '../../constants/lines';
import type { Page } from '../../constants/pages';

interface PercentageProgressProps {
  value: number;
  line: Line;
  pageName: Page;
}
export const PercentageProgress: React.FC<PercentageProgressProps> = ({
  value,
  line,
  pageName,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="col-span-2 flex w-full justify-center">
      <Link
        href={`/${LINE_OBJECTS[line].path}/${pageName}`}
        className="w-24 cursor-pointer items-center rounded-full p-1 md:w-40 lg:p-4"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          strokeWidth={hovered ? 20 : 12}
          background
          backgroundPadding={6}
          circleRatio={0.75}
          styles={buildStyles({
            // Text size
            textSize: '1.25rem',
            strokeLinecap: 'butt',
            rotation: 1 / 2 + 1 / 8,

            // Colors
            pathColor: LINE_COLORS[line ?? 'DEFAULT'],
            textColor: '#fff',
            trailColor: '#d6d6d6',
            backgroundColor: hovered ? LINE_COLORS_LIGHT[line ?? 'DEFAULT'] : 'transparent',
          })}
        />
        <p className="truncate text-center text-white">from last month</p>
      </Link>
    </div>
  );
};
