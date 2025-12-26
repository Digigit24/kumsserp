/**
 * Exams Page - Teacher manages exams
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Plus } from 'lucide-react';

export default function ExamsPage() {
    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Exams Management</h1>
                    <p className="text-muted-foreground mt-2">Create and manage examinations</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Exam
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Upcoming Exams */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Exams</CardTitle>
                        <CardDescription>Exams scheduled for the current term</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                {
                                    name: 'Mid-Term Examination',
                                    class: 'Class 1 - Section A',
                                    date: '2025-12-30',
                                    subjects: 5,
                                    status: 'scheduled',
                                },
                                {
                                    name: 'Final Examination',
                                    class: 'Class 2 - Section A',
                                    date: '2026-01-15',
                                    subjects: 6,
                                    status: 'scheduled',
                                },
                            ].map((exam, index) => (
                                <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FileText className="h-5 w-5 text-primary" />
                                                <h3 className="font-semibold text-lg">{exam.name}</h3>
                                                <Badge variant="outline">{exam.status}</Badge>
                                            </div>
                                            <div className="ml-8 space-y-1 text-sm text-muted-foreground">
                                                <p>Class: {exam.class}</p>
                                                <p className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    {exam.date}
                                                </p>
                                                <p>{exam.subjects} Subjects</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">View</Button>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Past Exams */}
                <Card>
                    <CardHeader>
                        <CardTitle>Past Exams</CardTitle>
                        <CardDescription>Previously conducted examinations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-muted-foreground py-8">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No past exams found</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
