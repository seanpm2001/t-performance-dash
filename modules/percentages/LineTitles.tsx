import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import type { LinePath } from '../../common/types/lines';

interface LineTitlesProps {
  line: LinePath;
  title: string;
}

export const LineTitles: React.FC<LineTitlesProps> = ({ title, line }) => {
  return (
    <Link
      href={`/${line}`}
      className={classNames(
        title ? 'col-span-2' : 'col-span-1',
        'flex items-center justify-center'
      )}
    >
      <h2 className="text-3xl text-white">{title}</h2>
    </Link>
  );
};
