'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  QrCodeScanner,
  TrendingUp,
  ShoppingCart,
  Person,
  Phone,
  CreditCard,
} from '@mui/icons-material';
import { rationAPI } from '@/lib/api';

interface HomeScreenProps {
  user: {
    rationCardId: string;
    familyName: string;
    selectedMember: {
      id: string;
      name: string;
      age: number;
      gender: string;
      relation: string;
    };
  };
  onScanQR: () => void;
}

interface QuickStats {
  monthlyUsage: number;
  remainingQuota: number;
  totalItems: number;
  usedItems: number;
}

export default function HomeScreen({ user, onScanQR }: HomeScreenProps) {
  const [stats, setStats] = useState<QuickStats>({
    monthlyUsage: 3,
    totalItems: 4,
    usedItems: 2,
    remainingQuota: 450,
  });
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, item: 'Rice', quantity: '5kg', date: '2 days ago', status: 'completed' },
    { id: 2, item: 'Wheat', quantity: '8kg', date: '1 week ago', status: 'completed' },
  ]);

  useEffect(() => {
    // Load user stats and recent transactions
    loadUserData();
  }, [user.selectedMember.id]);

  const loadUserData = async () => {
    try {
      const [quotaResponse, transactionsResponse] = await Promise.all([
        rationAPI.getUserQuota(user.selectedMember.id),
        rationAPI.getTransactionHistory(user.selectedMember.id),
      ]);

      // Process quota data for stats
      const quotas = quotaResponse.quotas || [];
      const totalQuota = quotas.reduce((sum: number, q: any) => sum + q.monthly_quota, 0);
      const usedQuota = quotas.reduce((sum: number, q: any) => sum + q.used_quota, 0);
      const remainingQuota = totalQuota - usedQuota;

      setStats({
        monthlyUsage: quotas.length,
        totalItems: quotas.length,
        usedItems: quotas.filter((q: any) => q.used_quota > 0).length,
        remainingQuota: Math.round(remainingQuota * 25), // Approximate value
      });

      // Process recent transactions
      const recent = (transactionsResponse.transactions || []).slice(0, 2).map((t: any) => ({
        id: t.id,
        item: t.item_name,
        quantity: `${t.quantity}${t.unit}`,
        date: new Date(t.created_at).toLocaleDateString(),
        status: t.status,
      }));

      setRecentTransactions(recent);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const getUsagePercentage = () => {
    return (stats.usedItems / stats.totalItems) * 100;
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Welcome Section */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: 'white' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Welcome back, {user.selectedMember.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {user.selectedMember.relation} • {user.selectedMember.age} years
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CreditCard sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2">
              Ration Card: {user.rationCardId}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Primary Action - Scan QR */}
      <Card sx={{ mb: 3, cursor: 'pointer' }} onClick={onScanQR}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <QrCodeScanner sx={{ fontSize: 48, color: '#0ea5e9', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Scan QR Code
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tap to scan dealer QR code for transaction
          </Typography>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1, color: '#0ea5e9' }} />
            This Month's Usage
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Items Used</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {stats.usedItems}/{stats.totalItems}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={getUsagePercentage()} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f0f9ff', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0ea5e9' }}>
                  {stats.usedItems}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Items Used
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#16a34a' }}>
                  ₹{stats.remainingQuota}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Remaining Value
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
            <ShoppingCart sx={{ mr: 1, color: '#0ea5e9' }} />
            Recent Transactions
          </Typography>
          
          {recentTransactions.length > 0 ? (
            <Box sx={{ space: 2 }}>
              {recentTransactions.map((transaction) => (
                <Box 
                  key={transaction.id}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 2,
                    borderBottom: '1px solid #f0f0f0',
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {transaction.item}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.quantity} • {transaction.date}
                    </Typography>
                  </Box>
                  <Chip 
                    label={transaction.status} 
                    size="small" 
                    color={transaction.status === 'completed' ? 'success' : 'default'}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              No recent transactions
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
