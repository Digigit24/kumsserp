/**
 * Student Attendance Page - Teacher marks student attendance
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Save, Users } from 'lucide-react';

export default function StudentAttendancePage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Student Attendance</h1>
                <p className="text-muted-foreground mt-2">Mark daily attendance for students</p>
            </div>

            <div className="grid gap-6">
                {/* Date Selection Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Select Date & Class
                        </CardTitle>
                        <CardDescription>Choose the date and class to mark attendance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Class</label>
                                <select className="w-full px-3 py-2 border rounded-md">
                                    <option value="">Select Class</option>
                                    <option value="1">Class 1 - Section A</option>
                                    <option value="2">Class 1 - Section B</option>
                                    <option value="3">Class 2 - Section A</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Action</label>
                                <Button className="w-full">
                                    <Users className="mr-2 h-4 w-4" />
                                    Load Students
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance Marking Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mark Attendance</CardTitle>
                        <CardDescription>Check present students and mark absent ones</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-muted-foreground py-8">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Select a date and class to load students</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Attendance
                    </Button>
                </div>
            </div>
        </div>
    );
}
