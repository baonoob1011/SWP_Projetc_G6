import GetAppointmentPercentage from './GetAppoinmentPercentage';
import GetRating from './GetRating';
import Stats from './GetStats';
import RevenueDashboard from './GetTotalRevenue';

export const DashBoard = () => {
  return (
    <div>
      <Stats />
      <GetAppointmentPercentage />
      <RevenueDashboard />
      <GetRating />
    </div>
  );
};
