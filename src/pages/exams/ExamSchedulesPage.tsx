/**
 * Exam Schedules Page - View and manage exam schedules
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';

export default function ExamSchedulesPage() {
    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Exam Schedules</h1>
                    <p className="text-muted-foreground mt-2">View and manage exam timetables</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Schedule
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Filter Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Filter exam schedules by exam and class</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Exam</label>
                                <select className="w-full px-3 py-2 border rounded-md">
                                    <option value="">Select Exam</option>
                                    <option value="1">Mid-Term Examination</option>
                                    <option value="2">Final Examination</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Class</label>
                                <select className="w-full px-3 py-2 border rounded-md">
                                    <option value="">All Classes</option>
                                    <option value="1">Class 1 - Section A</option>
                                    <option value="2">Class 2 - Section A</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <Button className="w-full">Apply Filters</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mid-Term Examination Schedule</CardTitle>
                        <CardDescription>Class 1 - Section A</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                {
                                    date: '2025-12-30',
                                    day: 'Monday',
                                    subject: 'Mathematics',
                                    time: '09:00 AM - 11:00 AM',
                                    room: 'Room 101',
                                },
                                {
                                    date: '2025-12-31',
                                    day: 'Tuesday',
                                    subject: 'Physics',
                                    time: '09:00 AM - 11:00 AM',
                                    room: 'Room 102',
                                },
                                {
                                    date: '2026-01-01',
                                    day: 'Wednesday',
                                    subject: 'Chemistry',
                                    time: '09:00 AM - 11:00 AM',
                                    room: 'Room 103',
                                },
                            ].map((schedule, index) => (
                                <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <Badge className="min-w-[100px]" variant="outline">
                                                    {schedule.day}
                                                </Badge>
                                                <h3 className="font-semibold text-lg">{schedule.subject}</h3>
                                            </div>
                                            <div className="flex gap-6 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    {schedule.date}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {schedule.time}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    {schedule.room}
                                                </span>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
