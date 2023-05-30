import React from 'react';
import { PercentageProgress } from '../../common/components/percentages/PercentageProgress';
import { PercentageTitles } from './PercentageTitles';
import { LineTitles } from './LineTitles';

export const OverviewPercentages: React.FC = () => {
  return (
    <div className="grid w-full grid-cols-9">
      <div />
      <LineTitles title="Red" line="red" />
      <LineTitles title="Orange" line="orange" />
      <LineTitles title="Blue" line="blue" />
      <LineTitles title="Green" line="green" />
      <PercentageTitles title="Speed" />
      <PercentageProgress value={75} line={'line-red'} pageName="speed" />
      <PercentageProgress value={60} line={'line-orange'} pageName="speed" />
      <PercentageProgress value={80} line={'line-blue'} pageName="speed" />
      <PercentageProgress value={80} line={'line-green'} pageName="speed" />
      <PercentageTitles title="Service" />
      <PercentageProgress value={43} line={'line-red'} pageName="service" />
      <PercentageProgress value={43} line={'line-orange'} pageName="service" />
      <PercentageProgress value={43} line={'line-blue'} pageName="service" />
      <PercentageProgress value={43} line={'line-green'} pageName="service" />
      <PercentageTitles title="Ridership" />
      <PercentageProgress value={43} line={'line-red'} pageName="ridership" />
      <PercentageProgress value={43} line={'line-orange'} pageName="ridership" />
      <PercentageProgress value={43} line={'line-blue'} pageName="ridership" />
      <PercentageProgress value={43} line={'line-green'} pageName="ridership" />
    </div>
  );
};
