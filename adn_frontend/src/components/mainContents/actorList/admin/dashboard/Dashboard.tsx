import GetAppointmentPercentage from './GetAppoinmentPercentage';
import GetDaily from './GetDaily';
import GetRating from './GetRating';
import Stats from './GetStats';
import RevenueDashboard from './GetTotalRevenue';

export const DashBoard = () => {
  return (
    <div>
      <Stats />
      <RevenueDashboard />
      <GetDaily />
      <GetRating />
      <GetAppointmentPercentage />
    </div>
  );
};
