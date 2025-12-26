/**
 * My Fees Page - Student views their fee details
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, Receipt, Wallet } from 'lucide-react';

export default function MyFeesPage() {
    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">My Fees</h1>
                <p className="text-muted-foreground mt-2">View and manage your fee payments</p>
            </div>

            <div className="grid gap-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹150,000</div>
                            <p className="text-xs text-muted-foreground">For Academic Year 2025-26</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Paid</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">₹90,000</div>
                            <p className="text-xs text-muted-foreground">60% completed</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">₹60,000</div>
                            <p className="text-xs text-muted-foreground">Due: 31 Jan 2026</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Fee Structure */}
                <Card>
                    <CardHeader>
                        <CardTitle>Fee Structure</CardTitle>
                        <CardDescription>Breakdown of fees for current academic year</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3">Fee Type</th>
                                        <th className="text-right p-3">Amount</th>
                                        <th className="text-right p-3">Paid</th>
                                        <th className="text-right p-3">Pending</th>
                                        <th className="text-center p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { type: 'Tuition Fee', amount: 100000, paid: 60000, pending: 40000, status: 'Partial' },
                                        { type: 'Laboratory Fee', amount: 20000, paid: 20000, pending: 0, status: 'Paid' },
                                        { type: 'Library Fee', amount: 5000, paid: 5000, pending: 0, status: 'Paid' },
                                        { type: 'Sports Fee', amount: 10000, paid: 5000, pending: 5000, status: 'Partial' },
                                        { type: 'Development Fee', amount: 15000, paid: 0, pending: 15000, status: 'Pending' },
                                    ].map((fee, index) => (
                                        <tr key={index} className="border-b hover:bg-accent/50">
                                            <td className="p-3 font-medium">{fee.type}</td>
                                            <td className="text-right p-3">₹{fee.amount.toLocaleString()}</td>
                                            <td className="text-right p-3 text-green-600">₹{fee.paid.toLocaleString()}</td>
                                            <td className="text-right p-3 text-orange-600">₹{fee.pending.toLocaleString()}</td>
                                            <td className="text-center p-3">
                                                <Badge
                                                    variant={
                                                        fee.status === 'Paid'
                                                            ? 'default'
                                                            : fee.status === 'Partial'
                                                            ? 'secondary'
                                                            : 'destructive'
                                                    }
                                                >
                                                    {fee.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold border-t-2">
                                        <td className="p-3">Total</td>
                                        <td className="text-right p-3">₹150,000</td>
                                        <td className="text-right p-3 text-green-600">₹90,000</td>
                                        <td className="text-right p-3 text-orange-600">₹60,000</td>
                                        <td className="text-center p-3"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                        <CardDescription>Recent fee payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                {
                                    date: '2025-12-15',
                                    amount: 30000,
                                    type: 'Tuition Fee - Installment 2',
                                    receipt: 'RCP-2025-1234',
                                },
                                {
                                    date: '2025-09-01',
                                    amount: 60000,
                                    type: 'Tuition Fee - Installment 1 + Other Fees',
                                    receipt: 'RCP-2025-0567',
                                },
                            ].map((payment, index) => (
                                <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Receipt className="h-4 w-4 text-primary" />
                                                <h3 className="font-semibold">{payment.type}</h3>
                                            </div>
                                            <div className="ml-7 space-y-1 text-sm text-muted-foreground">
                                                <p>Date: {payment.date}</p>
                                                <p>Receipt: {payment.receipt}</p>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <div className="text-xl font-bold text-green-600">
                                                ₹{payment.amount.toLocaleString()}
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <Download className="mr-2 h-4 w-4" />
                                                Receipt
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Button */}
                <div className="flex justify-end">
                    <Button size="lg">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Make Payment
                    </Button>
                </div>
            </div>
        </div>
    );
}
