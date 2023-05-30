import React from 'react';

interface PercentageTitlesProps {
  title: string;
}

export const PercentageTitles: React.FC<PercentageTitlesProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-end">
      <h2 className="text-end text-xl text-white">{title}</h2>
    </div>
  );
};
