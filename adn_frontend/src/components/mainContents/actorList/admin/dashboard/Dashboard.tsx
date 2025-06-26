import GetDaily from './GetDaily';
import Stats from './GetStats';
import RevenueDashboard from './GetTotalRevenue';

export const DashBoard = () => {
  return (
    <div>
      <Stats />
      <RevenueDashboard />
      <GetDaily />
    </div>
  );
};
