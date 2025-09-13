'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Divider,
} from '@mui/material';
import {
  Share,
  Download,
  Email,
  WhatsApp,
  Telegram,
  FileCopy,
  CheckCircle,
  DateRange,
  FilterList,
} from '@mui/icons-material';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface Transaction {
  id: string;
  item_name: string;
  quantity: number;
  unit: string;
  amount: number;
  status: string;
  created_at: string;
}

interface TransactionExportProps {
  transactions: Transaction[];
  onClose: () => void;
  open: boolean;
}

type ExportFormat = 'pdf' | 'csv' | 'json' | 'text';
type DateRange = 'last7days' | 'last30days' | 'thismonth' | 'lastmonth' | 'custom';

export default function TransactionExport({ transactions, onClose, open }: TransactionExportProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [dateRange, setDateRange] = useState<DateRange>('last30days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [sharingMethod, setSharingMethod] = useState<'download' | 'email' | 'whatsapp' | 'telegram' | 'copy'>('download');

  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    // Filter by date range
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (dateRange) {
      case 'last7days':
        startDate = subDays(now, 7);
        break;
      case 'last30days':
        startDate = subDays(now, 30);
        break;
      case 'thismonth':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'lastmonth':
        startDate = startOfMonth(subMonths(now, 1));
        endDate = endOfMonth(subMonths(now, 1));
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
        } else {
          return filtered;
        }
        break;
      default:
        return filtered;
    }

    filtered = filtered.filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Filter by selected transactions if any
    if (selectedTransactions.length > 0) {
      filtered = filtered.filter(transaction => selectedTransactions.includes(transaction.id));
    }

    return filtered;
  };

  const generateExportData = () => {
    const filteredTransactions = getFilteredTransactions();
    
    switch (exportFormat) {
      case 'csv':
        return generateCSV(filteredTransactions);
      case 'json':
        return generateJSON(filteredTransactions);
      case 'text':
        return generateText(filteredTransactions);
      case 'pdf':
        return generatePDF(filteredTransactions);
      default:
        return '';
    }
  };

  const generateCSV = (transactions: Transaction[]) => {
    const headers = ['Date', 'Item', 'Quantity', 'Unit', 'Amount', 'Status'];
    const rows = transactions.map(t => [
      format(new Date(t.created_at), 'yyyy-MM-dd'),
      t.item_name,
      t.quantity.toString(),
      t.unit,
      t.amount.toString(),
      t.status
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateJSON = (transactions: Transaction[]) => {
    return JSON.stringify(transactions, null, 2);
  };

  const generateText = (transactions: Transaction[]) => {
    let text = 'DigiRation - Transaction History\n';
    text += '================================\n\n';
    
    transactions.forEach(transaction => {
      text += `Date: ${format(new Date(transaction.created_at), 'MMM dd, yyyy')}\n`;
      text += `Item: ${transaction.item_name}\n`;
      text += `Quantity: ${transaction.quantity} ${transaction.unit}\n`;
      text += `Amount: ₹${transaction.amount}\n`;
      text += `Status: ${transaction.status}\n`;
      text += '---\n';
    });
    
    return text;
  };

  const generatePDF = (transactions: Transaction[]) => {
    // For demo purposes, return text format
    // In a real app, you would use a PDF generation library like jsPDF
    return generateText(transactions);
  };

  const handleDownload = () => {
    const data = generateExportData();
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digiration-transactions-${format(new Date(), 'yyyy-MM-dd')}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmail = () => {
    const data = generateExportData();
    const subject = 'DigiRation Transaction History';
    const body = `Please find attached your transaction history from DigiRation.\n\n${data}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleWhatsApp = () => {
    const data = generateExportData();
    const message = `DigiRation Transaction History:\n\n${data}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  const handleTelegram = () => {
    const data = generateExportData();
    const message = `DigiRation Transaction History:\n\n${data}`;
    const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(message)}`;
    window.open(telegramLink, '_blank');
  };

  const handleCopy = async () => {
    const data = generateExportData();
    try {
      await navigator.clipboard.writeText(data);
      alert('Transaction data copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const handleShare = () => {
    switch (sharingMethod) {
      case 'download':
        handleDownload();
        break;
      case 'email':
        handleEmail();
        break;
      case 'whatsapp':
        handleWhatsApp();
        break;
      case 'telegram':
        handleTelegram();
        break;
      case 'copy':
        handleCopy();
        break;
    }
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Share sx={{ mr: 1 }} />
          Export & Share Transactions
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {/* Export Format */}
          <FormControl fullWidth>
            <InputLabel>Export Format</InputLabel>
            <Select
              value={exportFormat}
              label="Export Format"
              onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
            >
              <MenuItem value="pdf">PDF Document</MenuItem>
              <MenuItem value="csv">CSV Spreadsheet</MenuItem>
              <MenuItem value="json">JSON Data</MenuItem>
              <MenuItem value="text">Plain Text</MenuItem>
            </Select>
          </FormControl>

          {/* Date Range */}
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              label="Date Range"
              onChange={(e) => setDateRange(e.target.value as DateRange)}
            >
              <MenuItem value="last7days">Last 7 Days</MenuItem>
              <MenuItem value="last30days">Last 30 Days</MenuItem>
              <MenuItem value="thismonth">This Month</MenuItem>
              <MenuItem value="lastmonth">Last Month</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="End Date"
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          )}

          {/* Transaction Selection */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Transactions ({filteredTransactions.length} found)
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                <List dense>
                  {filteredTransactions.map((transaction) => (
                    <ListItem key={transaction.id}>
                      <Checkbox
                        checked={selectedTransactions.includes(transaction.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTransactions([...selectedTransactions, transaction.id]);
                          } else {
                            setSelectedTransactions(selectedTransactions.filter(id => id !== transaction.id));
                          }
                        }}
                      />
                      <ListItemText
                        primary={transaction.item_name}
                        secondary={`${format(new Date(transaction.created_at), 'MMM dd, yyyy')} • ₹${transaction.amount}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>

          {/* Sharing Method */}
          <FormControl fullWidth>
            <InputLabel>Sharing Method</InputLabel>
            <Select
              value={sharingMethod}
              label="Sharing Method"
              onChange={(e) => setSharingMethod(e.target.value as any)}
            >
              <MenuItem value="download">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Download sx={{ mr: 1 }} />
                  Download File
                </Box>
              </MenuItem>
              <MenuItem value="email">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 1 }} />
                  Email
                </Box>
              </MenuItem>
              <MenuItem value="whatsapp">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WhatsApp sx={{ mr: 1 }} />
                  WhatsApp
                </Box>
              </MenuItem>
              <MenuItem value="telegram">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Telegram sx={{ mr: 1 }} />
                  Telegram
                </Box>
              </MenuItem>
              <MenuItem value="copy">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FileCopy sx={{ mr: 1 }} />
                  Copy to Clipboard
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Preview */}
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Preview:</strong> {filteredTransactions.length} transactions will be exported in {exportFormat.toUpperCase()} format.
              {selectedTransactions.length > 0 && ` Only ${selectedTransactions.length} selected transactions will be included.`}
            </Typography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleShare}
          variant="contained"
          startIcon={<Share />}
          disabled={filteredTransactions.length === 0}
        >
          {sharingMethod === 'download' ? 'Download' : 'Share'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
