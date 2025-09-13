'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import {
  Search,
  FilterList,
  CheckCircle,
  Pending,
  Cancel,
  ShoppingCart,
  CalendarToday,
} from '@mui/icons-material';
import { rationAPI } from '@/lib/api';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  item_name: string;
  quantity: number;
  unit: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

interface TransactionHistoryProps {
  user: {
    selectedMember: {
      id: string;
    };
  };
}

type StatusFilter = 'all' | 'completed' | 'pending' | 'failed';

export default function TransactionHistory({ user }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    loadTransactions();
  }, [user.selectedMember.id, currentPage]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await rationAPI.getTransactionHistory(user.selectedMember.id);
      setTransactions(response.transactions || []);
      setTotalPages(Math.ceil((response.transactions || []).length / itemsPerPage));
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Pending color="warning" />;
      case 'failed':
        return <Cancel color="error" />;
      default:
        return <Pending />;
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'failed':
        return <Chip label="Failed" color="error" size="small" />;
      default:
        return <Chip label="Unknown" size="small" />;
    }
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

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const groupTransactionsByMonth = (transactions: Transaction[]) => {
    const grouped: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const month = format(new Date(transaction.created_at), 'MMMM yyyy');
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(transaction);
    });
    
    return grouped;
  };

  const groupedTransactions = groupTransactionsByMonth(paginatedTransactions);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <Typography>Loading transaction history...</Typography>
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
            placeholder="Search transactions..."
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
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              startAdornment={<FilterList sx={{ mr: 1 }} />}
            >
              <MenuItem value="all">All Transactions</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Transaction List */}
      {Object.keys(groupedTransactions).length > 0 ? (
        <Box>
          {Object.entries(groupedTransactions).map(([month, monthTransactions]) => (
            <Card key={month} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 0 }}>
                {/* Month Header */}
                <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ mr: 1, color: '#0ea5e9' }} />
                    {month}
                  </Typography>
                </Box>

                {/* Transactions for the month */}
                <List sx={{ p: 0 }}>
                  {monthTransactions.map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                      <ListItem sx={{ px: 3, py: 2 }}>
                        <ListItemIcon>
                          <Typography sx={{ fontSize: 24 }}>
                            {getItemIcon(transaction.item_name)}
                          </Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                                {transaction.item_name}
                              </Typography>
                              {getStatusChip(transaction.status)}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {transaction.quantity} {transaction.unit} • ₹{transaction.amount}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {format(new Date(transaction.created_at), 'MMM dd, yyyy • h:mm a')}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < monthTransactions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Card>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <ShoppingCart sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No transactions found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Your transaction history will appear here'
              }
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
