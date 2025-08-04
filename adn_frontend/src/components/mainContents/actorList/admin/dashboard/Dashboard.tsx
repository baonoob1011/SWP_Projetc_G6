import React from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import GetAppointmentPercentage from './GetAppoinmentPercentage';
import GetRating from './GetRating';
import Stats from './GetStats';
import RevenueDashboard from './GetTotalRevenue';
import TransactionHistory from './TransactionHistory';

export const DashBoard = () => {
  return (
    <Container fluid className="mt-4 px-4">
      <Tabs
        defaultActiveKey="overview"
        id="dashboard-tabs"
        className="mb-4"
        fill
      >
        <Tab eventKey="transactions" title="Lịch sử giao dịch">
          <div className="py-3">
            <TransactionHistory />
          </div>
        </Tab>

        <Tab eventKey="overview" title="Tổng quan hệ thống">
          <div className="py-3">
            <Stats />
            <GetAppointmentPercentage />
            <RevenueDashboard />
            <GetRating />
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};
