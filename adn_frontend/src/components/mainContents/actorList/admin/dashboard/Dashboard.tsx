import { Tabs, Tab, Container } from 'react-bootstrap';
import GetAppointmentPercentage from './GetAppoinmentPercentage';
import GetRating from './GetRating';
import Stats from './GetStats';
import RevenueDashboard from './GetTotalRevenue';
import TransactionHistory from './TransactionHistory';
import { TopDesposit, TopPayment } from './TopCustomer';

export const DashBoard = () => {
  return (
    <Container fluid className="mt-4 px-4">
      <Tabs
        defaultActiveKey="overview"
        id="dashboard-tabs"
        className="mb-4"
        fill
      >
        <Tab eventKey="overview" title="Tổng quan hệ thống">
          <div className="py-3">
            <Stats />
            <TopPayment />
            <TopDesposit />
            <GetAppointmentPercentage />
            <RevenueDashboard />
            <GetRating />
          </div>
        </Tab>
        <Tab eventKey="transactions" title="Lịch sử giao dịch">
          <div className="py-3">
            <TransactionHistory />
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};
