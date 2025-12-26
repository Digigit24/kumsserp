/**
 * Marks Register Page - Teacher enters and manages exam marks
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Save, Search } from 'lucide-react';

export default function MarksRegisterPage() {
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Marks Register</h1>
                <p className="text-muted-foreground mt-2">Enter and manage student exam marks</p>
            </div>

            <div className="grid gap-6">
                {/* Selection Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Select Exam & Subject
                        </CardTitle>
                        <CardDescription>Choose exam and subject to enter marks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Exam</label>
                                <select
                                    value={selectedExam}
                                    onChange={(e) => setSelectedExam(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="">Select Exam</option>
                                    <option value="1">Mid-Term Examination</option>
                                    <option value="2">Final Examination</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Class</label>
                                <select className="w-full px-3 py-2 border rounded-md">
                                    <option value="">Select Class</option>
                                    <option value="1">Class 1 - Section A</option>
                                    <option value="2">Class 2 - Section A</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Subject</label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="">Select Subject</option>
                                    <option value="1">Mathematics</option>
                                    <option value="2">Physics</option>
                                    <option value="3">Chemistry</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Action</label>
                                <Button className="w-full">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Load Students
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Marks Entry Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Enter Marks</CardTitle>
                        <CardDescription>
                            Enter marks for each student (Max: 100)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedExam && selectedSubject ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3">Roll No.</th>
                                            <th className="text-left p-3">Student Name</th>
                                            <th className="text-left p-3">Theory (70)</th>
                                            <th className="text-left p-3">Practical (30)</th>
                                            <th className="text-left p-3">Total (100)</th>
                                            <th className="text-left p-3">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { roll: '001', name: 'John Doe' },
                                            { roll: '002', name: 'Jane Smith' },
                                            { roll: '003', name: 'Bob Wilson' },
                                        ].map((student) => (
                                            <tr key={student.roll} className="border-b hover:bg-accent/50">
                                                <td className="p-3">{student.roll}</td>
                                                <td className="p-3 font-medium">{student.name}</td>
                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="70"
                                                        className="w-20 px-2 py-1 border rounded"
                                                        placeholder="0"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="30"
                                                        className="w-20 px-2 py-1 border rounded"
                                                        placeholder="0"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <Badge variant="outline">0</Badge>
                                                </td>
                                                <td className="p-3">
                                                    <Badge>-</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Select exam and subject to load students</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                {selectedExam && selectedSubject && (
                    <div className="flex justify-end gap-3">
                        <Button variant="outline">Cancel</Button>
                        <Button>
                            <Save className="mr-2 h-4 w-4" />
                            Save Marks
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
