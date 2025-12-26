/**
 * My Attendance Page - Student views their attendance
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, User } from 'lucide-react';

export default function MyAttendancePage() {
    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
                <p className="text-muted-foreground mt-2">View your attendance records and statistics</p>
            </div>

            <div className="grid gap-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">85.5%</div>
                            <p className="text-xs text-muted-foreground">171 of 200 days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Month</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">92.0%</div>
                            <p className="text-xs text-muted-foreground">23 of 25 days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Status</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Badge className="text-lg" variant="default">Good Standing</Badge>
                            <p className="text-xs text-muted-foreground mt-2">Above 75% threshold</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Subject-wise Attendance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Subject-wise Attendance</CardTitle>
                        <CardDescription>Your attendance breakdown by subject</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: 'Mathematics', present: 45, total: 50, percentage: 90 },
                                { name: 'Physics', present: 42, total: 50, percentage: 84 },
                                { name: 'Chemistry', present: 40, total: 50, percentage: 80 },
                                { name: 'Biology', present: 44, total: 50, percentage: 88 },
                            ].map((subject) => (
                                <div key={subject.name} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium">{subject.name}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {subject.present}/{subject.total} ({subject.percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full"
                                                style={{ width: `${subject.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Attendance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Attendance</CardTitle>
                        <CardDescription>Last 10 days attendance record</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {[
                                { date: '2025-12-26', status: 'Present' },
                                { date: '2025-12-25', status: 'Present' },
                                { date: '2025-12-24', status: 'Absent' },
                                { date: '2025-12-23', status: 'Present' },
                                { date: '2025-12-22', status: 'Present' },
                            ].map((record) => (
                                <div key={record.date} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <span className="text-sm">{record.date}</span>
                                    <Badge variant={record.status === 'Present' ? 'default' : 'destructive'}>
                                        {record.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
