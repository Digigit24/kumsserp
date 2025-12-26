import React from 'react';
import { CreditCard, Download, CheckCircle2, AlertCircle, Clock, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const Fees: React.FC = () => {
  // Mock data - Replace with actual API calls
  const feesSummary = {
    totalFees: 50000,
    paidFees: 45000,
    pendingFees: 5000,
    dueDate: '2025-01-15',
  };

  const feeStructure = [
    { category: 'Tuition Fee', amount: 30000, paid: 30000, status: 'paid' },
    { category: 'Library Fee', amount: 2000, paid: 2000, status: 'paid' },
    { category: 'Laboratory Fee', amount: 5000, paid: 5000, status: 'paid' },
    { category: 'Sports Fee', amount: 3000, paid: 3000, status: 'paid' },
    { category: 'Development Fee', amount: 5000, paid: 5000, status: 'paid' },
    { category: 'Semester Fee', amount: 5000, paid: 0, status: 'pending' },
  ];

  const paymentHistory = [
    {
      id: 1,
      receiptNo: 'REC2024001',
      date: '2024-11-15',
      description: 'Tuition Fee - Semester 1',
      amount: 30000,
      paymentMode: 'Online',
      status: 'completed',
    },
    {
      id: 2,
      receiptNo: 'REC2024002',
      date: '2024-11-15',
      description: 'Library Fee',
      amount: 2000,
      paymentMode: 'Cash',
      status: 'completed',
    },
    {
      id: 3,
      receiptNo: 'REC2024003',
      date: '2024-12-01',
      description: 'Laboratory Fee',
      amount: 5000,
      paymentMode: 'Online',
      status: 'completed',
    },
    {
      id: 4,
      receiptNo: 'REC2024004',
      date: '2024-12-10',
      description: 'Sports & Development Fee',
      amount: 8000,
      paymentMode: 'UPI',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
        <p className="text-muted-foreground mt-2">
          View and pay your academic fees
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{feesSummary.totalFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Academic Year 2024-25</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Fees</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{feesSummary.paidFees.toLocaleString()}
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${(feesSummary.paidFees / feesSummary.totalFees) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ₹{feesSummary.pendingFees.toLocaleString()}
            </div>
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Due: {new Date(feesSummary.dueDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments */}
      {feeStructure.filter(fee => fee.status === 'pending').length > 0 && (
        <Card className="border-l-4 border-l-destructive">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Pending Payment
                </CardTitle>
                <CardDescription>Please pay before the due date to avoid late fees</CardDescription>
              </div>
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feeStructure
                .filter(fee => fee.status === 'pending')
                .map((fee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-destructive/10">
                    <div>
                      <p className="font-medium">{fee.category}</p>
                      <p className="text-sm text-muted-foreground">Due: {new Date(feesSummary.dueDate).toLocaleDateString()}</p>
                    </div>
                    <p className="text-xl font-bold">₹{fee.amount.toLocaleString()}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fee Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Structure</CardTitle>
          <CardDescription>Breakdown of all fees for current academic year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {feeStructure.map((fee, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{fee.category}</p>
                    <div className="flex items-center gap-3">
                      <Badge variant={fee.status === 'paid' ? 'success' : 'destructive'}>
                        {fee.status === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                      <p className="text-lg font-bold">₹{fee.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  {fee.status === 'paid' && (
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '100%' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>Your previous fee payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Receipt No: {payment.receiptNo}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₹{payment.amount.toLocaleString()}</p>
                      <Badge variant="outline" className="mt-1">{payment.paymentMode}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(payment.date).toLocaleDateString()}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download Receipt
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
