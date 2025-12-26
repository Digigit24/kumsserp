/**
 * My Results Page - Student views their exam results
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, FileText, TrendingUp } from 'lucide-react';

export default function MyResultsPage() {
    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">My Results</h1>
                <p className="text-muted-foreground mt-2">View your examination results and grades</p>
            </div>

            <div className="grid gap-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3.75</div>
                            <p className="text-xs text-muted-foreground">Out of 4.0</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5th</div>
                            <p className="text-xs text-muted-foreground">Out of 60 students</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Exams Taken</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4</div>
                            <p className="text-xs text-muted-foreground">This academic year</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Mid-Term Results */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Mid-Term Examination Results</CardTitle>
                                <CardDescription>December 2025</CardDescription>
                            </div>
                            <Badge variant="default" className="text-lg">
                                GPA: 3.8
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3">Subject</th>
                                        <th className="text-right p-3">Theory</th>
                                        <th className="text-right p-3">Practical</th>
                                        <th className="text-right p-3">Total</th>
                                        <th className="text-center p-3">Grade</th>
                                        <th className="text-right p-3">Grade Point</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { subject: 'Mathematics', theory: 65, practical: 28, total: 93, grade: 'A+', gp: 4.0 },
                                        { subject: 'Physics', theory: 60, practical: 25, total: 85, grade: 'A', gp: 3.75 },
                                        { subject: 'Chemistry', theory: 58, practical: 24, total: 82, grade: 'A', gp: 3.75 },
                                        { subject: 'Biology', theory: 62, practical: 26, total: 88, grade: 'A', gp: 3.75 },
                                        { subject: 'English', theory: 55, practical: 22, total: 77, grade: 'A-', gp: 3.5 },
                                    ].map((result) => (
                                        <tr key={result.subject} className="border-b hover:bg-accent/50">
                                            <td className="p-3 font-medium">{result.subject}</td>
                                            <td className="text-right p-3">{result.theory}/70</td>
                                            <td className="text-right p-3">{result.practical}/30</td>
                                            <td className="text-right p-3 font-semibold">{result.total}/100</td>
                                            <td className="text-center p-3">
                                                <Badge variant="default">{result.grade}</Badge>
                                            </td>
                                            <td className="text-right p-3">{result.gp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Previous Results */}
                <Card>
                    <CardHeader>
                        <CardTitle>Previous Examination Results</CardTitle>
                        <CardDescription>Historical performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { name: 'First Term Examination', date: 'September 2025', gpa: 3.7 },
                                { name: 'Entrance Examination', date: 'June 2025', gpa: 3.6 },
                            ].map((exam, index) => (
                                <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">{exam.name}</h3>
                                            <p className="text-sm text-muted-foreground">{exam.date}</p>
                                        </div>
                                        <Badge variant="outline" className="text-lg">
                                            GPA: {exam.gpa}
                                        </Badge>
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
