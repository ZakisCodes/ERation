'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Menu,
  Notifications,
  Person,
} from '@mui/icons-material';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  notificationCount?: number;
  userAvatar?: string;
}

export default function AppHeader({
  title,
  onMenuClick,
  onNotificationClick,
  onProfileClick,
  notificationCount = 0,
  userAvatar,
}: HeaderProps) {
  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Toolbar sx={{ minHeight: 56 }}>
        {onMenuClick && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
        )}
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            color: '#0ea5e9'
          }}
        >
          {title}
        </Typography>

        <IconButton
          color="inherit"
          onClick={onNotificationClick}
          sx={{ mr: 1 }}
        >
          <Badge badgeContent={notificationCount} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        <IconButton
          color="inherit"
          onClick={onProfileClick}
        >
          {userAvatar ? (
            <Avatar src={userAvatar} sx={{ width: 32, height: 32 }} />
          ) : (
            <Person />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
