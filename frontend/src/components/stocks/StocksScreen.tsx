'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FilterList,
  CheckCircle,
  Warning,
  Cancel,
} from '@mui/icons-material';
import { rationAPI } from '@/lib/api';

interface StockItem {
  id: string;
  name: string;
  unit: string;
  price_per_unit: number;
  shop_stock: number;
  monthly_quota?: number;
  used_quota?: number;
  remaining_quota?: number;
}

interface StocksScreenProps {
  user: {
    selectedMember: {
      id: string;
    };
  };
}

type FilterType = 'all' | 'available' | 'out_of_stock' | 'quota_exhausted';

export default function StocksScreen({ user }: StocksScreenProps) {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [userQuotas, setUserQuotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadStocksData();
  }, [user.selectedMember.id]);

  const loadStocksData = async () => {
    try {
      const [stocksResponse, quotasResponse] = await Promise.all([
        rationAPI.getStocks(),
        rationAPI.getUserQuota(user.selectedMember.id),
      ]);

      setStocks(stocksResponse.stocks || []);
      setUserQuotas(quotasResponse.quotas || []);
    } catch (error) {
      console.error('Failed to load stocks data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getItemQuota = (itemId: string) => {
    return userQuotas.find(q => q.item_id === itemId);
  };

  const getStockStatus = (item: StockItem) => {
    const quota = getItemQuota(item.id);
    
    if (item.shop_stock === 0) {
      return { status: 'out_of_stock', label: 'Out of Stock', color: 'error' as const };
    }
    
    if (quota && quota.remaining_quota <= 0) {
      return { status: 'quota_exhausted', label: 'Quota Exhausted', color: 'warning' as const };
    }
    
    if (item.shop_stock < 10) {
      return { status: 'low_stock', label: 'Low Stock', color: 'warning' as const };
    }
    
    return { status: 'available', label: 'Available', color: 'success' as const };
  };

  const getItemIcon = (itemName: string) => {
    const name = itemName.toLowerCase();
    if (name.includes('rice')) return '🍚';
    if (name.includes('wheat')) return '🌾';
    if (name.includes('oil')) return '🫒';
    if (name.includes('salt')) return '🧂';
    if (name.includes('sugar')) return '🍯';
    return '📦';
  };

  const filteredStocks = stocks.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const stockStatus = getStockStatus(item);
    
    let matchesFilter = true;
    switch (filter) {
      case 'available':
        matchesFilter = stockStatus.status === 'available';
        break;
      case 'out_of_stock':
        matchesFilter = stockStatus.status === 'out_of_stock';
        break;
      case 'quota_exhausted':
        matchesFilter = stockStatus.status === 'quota_exhausted';
        break;
      default:
        matchesFilter = true;
    }
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <Typography>Loading stocks...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filter}
              label="Filter by Status"
              onChange={(e) => setFilter(e.target.value as FilterType)}
              startAdornment={<FilterList sx={{ mr: 1 }} />}
            >
              <MenuItem value="all">All Items</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="out_of_stock">Out of Stock</MenuItem>
              <MenuItem value="quota_exhausted">Quota Exhausted</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Stock Items */}
      <Box sx={{ space: 2 }}>
        {filteredStocks.map((item) => {
          const quota = getItemQuota(item.id);
          const stockStatus = getStockStatus(item);
          const usagePercentage = quota ? (quota.used_quota / quota.monthly_quota) * 100 : 0;

          return (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: 32, mr: 2 }}>
                    {getItemIcon(item.name)}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{item.price_per_unit} per {item.unit}
                    </Typography>
                  </Box>
                  <Chip
                    label={stockStatus.label}
                    color={stockStatus.color}
                    size="small"
                    icon={
                      stockStatus.status === 'available' ? <CheckCircle /> :
                      stockStatus.status === 'low_stock' ? <Warning /> :
                      <Cancel />
                    }
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Shop Stock
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {item.shop_stock} {item.unit}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Your Quota
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {quota ? `${quota.monthly_quota} ${item.unit}/month` : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {quota && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Used: {quota.used_quota} {item.unit}
                      </Typography>
                      <Typography variant="body2">
                        Remaining: {quota.remaining_quota} {item.unit}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={usagePercentage}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {filteredStocks.length === 0 && (
        <Card>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No items found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
