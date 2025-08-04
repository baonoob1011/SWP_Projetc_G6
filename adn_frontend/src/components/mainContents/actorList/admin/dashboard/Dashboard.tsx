import React from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import GetAppointmentPercentage from './GetAppoinmentPercentage';
import GetRating from './GetRating';
import Stats from './GetStats';
import RevenueDashboard from './GetTotalRevenue';
import TransactionHistory from './TransactionHistory';

export const DashBoard = () => {
  return (
    <Container className="mt-4">
      <Tabs defaultActiveKey="overview" id="dashboard-tabs" className="mb-3">
        <Tab eventKey="transactions" title="Lịch sử giao dịch">
          <TransactionHistory />
        </Tab>
        <Tab eventKey="overview" title="Tổng quan hệ thống">
          <Stats />
          <GetAppointmentPercentage />
          <RevenueDashboard />
          <GetRating />
        </Tab>
      </Tabs>
    </Container>
  );
};
