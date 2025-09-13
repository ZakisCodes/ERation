'use client';

import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Home,
  Inventory,
  History,
  Person,
} from '@mui/icons-material';

interface BottomNavigationProps {
  currentTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function AppBottomNavigation({ currentTab, onTabChange }: BottomNavigationProps) {
  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderTop: '1px solid #e0e0e0'
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={currentTab}
        onChange={onTabChange}
        sx={{
          height: 60,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 0',
            '&.Mui-selected': {
              color: '#0ea5e9',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<Home />}
          sx={{ fontSize: '0.75rem' }}
        />
        <BottomNavigationAction
          label="Stocks"
          icon={<Inventory />}
          sx={{ fontSize: '0.75rem' }}
        />
        <BottomNavigationAction
          label="History"
          icon={<History />}
          sx={{ fontSize: '0.75rem' }}
        />
        <BottomNavigationAction
          label="Profile"
          icon={<Person />}
          sx={{ fontSize: '0.75rem' }}
        />
      </BottomNavigation>
    </Paper>
  );
}
