/**
 * Fees Tab for Student Detail Page
 * Shows fee structure, payment history, and pending fees
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Download,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeesTabProps {
  studentId: number;
}

interface FeeItem {
  id: number;
  feeType: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paidAmount?: number;
  description?: string;
}

interface Payment {
  id: number;
  receiptNumber: string;
  date: string;
  amount: number;
  paymentMode: string;
  transactionId?: string;
  feeType: string;
}

// Mock data generator for student fees
const generateMockFeeData = (studentId: number) => {
  const feeItems: FeeItem[] = [
    {
      id: 1,
      feeType: 'Tuition Fee (Semester 1)',
      amount: 45000,
      dueDate: '2025-08-15',
      status: 'paid',
      paidAmount: 45000,
      description: 'First semester tuition fee'
    },
    {
      id: 2,
      feeType: 'Tuition Fee (Semester 2)',
      amount: 45000,
      dueDate: '2026-01-15',
      status: 'pending',
      description: 'Second semester tuition fee'
    },
    {
      id: 3,
      feeType: 'Library Fee',
      amount: 2000,
      dueDate: '2025-08-15',
      status: 'paid',
      paidAmount: 2000,
      description: 'Annual library membership fee'
    },
    {
      id: 4,
      feeType: 'Laboratory Fee',
      amount: 5000,
      dueDate: '2025-08-15',
      status: 'paid',
      paidAmount: 5000,
      description: 'Laboratory equipment and materials fee'
    },
    {
      id: 5,
      feeType: 'Sports Fee',
      amount: 1500,
      dueDate: '2025-09-01',
      status: 'paid',
      paidAmount: 1500,
      description: 'Annual sports and activities fee'
    },
    {
      id: 6,
      feeType: 'Examination Fee (Mid-term)',
      amount: 3000,
      dueDate: '2025-10-01',
      status: 'paid',
      paidAmount: 3000,
      description: 'Mid-term examination fee'
    },
    {
      id: 7,
      feeType: 'Development Fee',
      amount: 8000,
      dueDate: '2025-08-15',
      status: 'partial',
      paidAmount: 5000,
      description: 'Infrastructure development fee'
    },
    {
      id: 8,
      feeType: 'Examination Fee (Final)',
      amount: 3000,
      dueDate: '2026-04-01',
      status: 'pending',
      description: 'Final examination fee'
    },
  ];

  const payments: Payment[] = [
    {
      id: 1,
      receiptNumber: 'REC/2025/001234',
      date: '2025-08-10',
      amount: 45000,
      paymentMode: 'Net Banking',
      transactionId: 'TXN123456789',
      feeType: 'Tuition Fee (Semester 1)'
    },
    {
      id: 2,
      receiptNumber: 'REC/2025/001235',
      date: '2025-08-10',
      amount: 2000,
      paymentMode: 'Net Banking',
      transactionId: 'TXN123456790',
      feeType: 'Library Fee'
    },
    {
      id: 3,
      receiptNumber: 'REC/2025/001236',
      date: '2025-08-12',
      amount: 5000,
      paymentMode: 'UPI',
      transactionId: 'UPI987654321',
      feeType: 'Laboratory Fee'
    },
    {
      id: 4,
      receiptNumber: 'REC/2025/001280',
      date: '2025-08-28',
      amount: 1500,
      paymentMode: 'Card',
      transactionId: 'CARD456789123',
      feeType: 'Sports Fee'
    },
    {
      id: 5,
      receiptNumber: 'REC/2025/001320',
      date: '2025-09-25',
      amount: 3000,
      paymentMode: 'Cash',
      feeType: 'Examination Fee (Mid-term)'
    },
    {
      id: 6,
      receiptNumber: 'REC/2025/001350',
      date: '2025-08-15',
      amount: 5000,
      paymentMode: 'Cheque',
      transactionId: 'CHQ789456',
      feeType: 'Development Fee (Partial)'
    },
  ];

  // Calculate summary
  const totalFees = feeItems.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = feeItems.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
  const pendingFees = totalFees - paidFees;
  const overdueFees = feeItems
    .filter(fee => fee.status === 'overdue')
    .reduce((sum, fee) => sum + (fee.amount - (fee.paidAmount || 0)), 0);

  return {
    feeItems,
    payments,
    summary: {
      totalFees,
      paidFees,
      pendingFees,
      overdueFees
    }
  };
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get status badge variant
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return { variant: 'success' as const, icon: CheckCircle, text: 'Paid' };
    case 'partial':
      return { variant: 'warning' as const, icon: Clock, text: 'Partial' };
    case 'overdue':
      return { variant: 'destructive' as const, icon: AlertCircle, text: 'Overdue' };
    case 'pending':
    default:
      return { variant: 'default' as const, icon: Clock, text: 'Pending' };
  }
};

export const FeesTab: React.FC<FeesTabProps> = ({ studentId }) => {
  const { feeItems, payments, summary } = generateMockFeeData(studentId);

  return (
    <div className="space-y-6">
      {/* Fee Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Fees</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(summary.totalFees)}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <IndianRupee className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {formatCurrency(summary.paidFees)}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                  {formatCurrency(summary.pendingFees)}
                </p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {formatCurrency(summary.overdueFees)}
                </p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Fee Structure (Academic Year 2025-26)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm">Fee Type</th>
                  <th className="text-left py-3 px-4 font-medium text-sm hidden sm:table-cell">Description</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-sm hidden md:table-cell">Paid</th>
                  <th className="text-center py-3 px-4 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {feeItems.map((fee) => {
                  const statusConfig = getStatusBadge(fee.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={fee.id} className="border-b hover:bg-accent/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-sm">{fee.feeType}</p>
                        <p className="text-xs text-muted-foreground">Due: {fee.dueDate}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">
                        {fee.description}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-sm">
                        {formatCurrency(fee.amount)}
                      </td>
                      <td className="py-3 px-4 text-right text-sm hidden md:table-cell">
                        {fee.paidAmount ? (
                          <span className="text-green-600 dark:text-green-400">
                            {formatCurrency(fee.paidAmount)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={statusConfig.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.text}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-bold bg-accent/30">
                  <td className="py-3 px-4" colSpan={2}>Total</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(summary.totalFees)}</td>
                  <td className="py-3 px-4 text-right hidden md:table-cell text-green-600 dark:text-green-400">
                    {formatCurrency(summary.paidFees)}
                  </td>
                  <td className="py-3 px-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No payments recorded yet</p>
              </div>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{payment.feeType}</p>
                      <Badge variant="outline" className="text-xs">
                        {payment.paymentMode}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Receipt: {payment.receiptNumber} • Date: {payment.date}
                    </p>
                    {payment.transactionId && (
                      <p className="text-xs text-muted-foreground">
                        Transaction ID: {payment.transactionId}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(payment.amount)}
                    </p>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Payments Alert */}
      {summary.pendingFees > 0 && (
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Pending Payment</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  You have a pending amount of <span className="font-bold">{formatCurrency(summary.pendingFees)}</span>.
                  Please make the payment before the due date to avoid late fees.
                </p>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
