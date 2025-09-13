'use client';

import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import Header from './layout/Header';
import BottomNavigation from './layout/BottomNavigation';
import HomeScreen from './dashboard/HomeScreen';
import StocksScreen from './stocks/StocksScreen';
import TransactionHistory from './transactions/TransactionHistory';
import ProfileScreen from './profile/ProfileScreen';
import QRScanner from './scanner/QRScanner';

interface AppProps {
  user: {
    rationCardId: string;
    familyName: string;
    selectedMember: {
      id: string;
      name: string;
      age: number;
      gender: string;
      relation: string;
      verificationStatus: string;
    };
  };
  onLogout: () => void;
}

type TabValue = 0 | 1 | 2 | 3;

export default function App({ user, onLogout }: AppProps) {
  const [currentTab, setCurrentTab] = useState<TabValue>(0);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue);
  };

  const handleScanQR = () => {
    setQrScannerOpen(true);
  };

  const handleTransactionInitiated = (transactionId: string) => {
    console.log('Transaction initiated:', transactionId);
    setNotificationCount(prev => prev + 1);
    // In a real app, you might want to show a success message or redirect
  };

  const getPageTitle = () => {
    switch (currentTab) {
      case 0:
        return 'DigiRation';
      case 1:
        return 'Available Stocks';
      case 2:
        return 'Transaction History';
      case 3:
        return 'Profile & Settings';
      default:
        return 'DigiRation';
    }
  };

  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 0:
        return <HomeScreen user={user} onScanQR={handleScanQR} />;
      case 1:
        return <StocksScreen user={user} />;
      case 2:
        return <TransactionHistory user={user} />;
      case 3:
        return <ProfileScreen user={user} onLogout={onLogout} />;
      default:
        return <HomeScreen user={user} onScanQR={handleScanQR} />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Header
        title={getPageTitle()}
        notificationCount={notificationCount}
        onNotificationClick={() => {
          // Handle notification click
          setNotificationCount(0);
        }}
        onProfileClick={() => setCurrentTab(3)}
      />

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ px: 0 }}>
        <Box sx={{ pt: 2, pb: 8 }}>
          {renderCurrentScreen()}
        </Box>
      </Container>

      {/* Bottom Navigation */}
      <BottomNavigation
        currentTab={currentTab}
        onTabChange={handleTabChange}
      />

      {/* QR Scanner Modal */}
      <QRScanner
        open={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)}
        onTransactionInitiated={handleTransactionInitiated}
        user={user}
      />
    </Box>
  );
}
