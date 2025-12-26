/**
 * My Books Page - View borrowed books and library transactions
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Book, BookOpen, Calendar, Clock } from 'lucide-react';

export default function MyBooksPage() {
    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">My Books</h1>
                <p className="text-muted-foreground mt-2">View your borrowed books and library history</p>
            </div>

            <div className="grid gap-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Currently Borrowed</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">Out of 5 allowed</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">1</div>
                            <p className="text-xs text-muted-foreground">Please return soon</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
                            <Book className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">This academic year</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Currently Borrowed Books */}
                <Card>
                    <CardHeader>
                        <CardTitle>Currently Borrowed Books</CardTitle>
                        <CardDescription>Books you have checked out from the library</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                {
                                    title: 'Human Anatomy and Physiology',
                                    author: 'Elaine N. Marieb',
                                    isbn: '978-0134580999',
                                    borrowed: '2025-12-10',
                                    due: '2026-01-10',
                                    status: 'Active',
                                    overdue: false,
                                },
                                {
                                    title: 'Medical Biochemistry',
                                    author: 'John W. Baynes',
                                    isbn: '978-0323073660',
                                    borrowed: '2025-12-05',
                                    due: '2026-01-05',
                                    status: 'Active',
                                    overdue: false,
                                },
                                {
                                    title: 'Clinical Pathology',
                                    author: 'Kumar & Clark',
                                    isbn: '978-0702066016',
                                    borrowed: '2025-11-15',
                                    due: '2025-12-15',
                                    status: 'Overdue',
                                    overdue: true,
                                },
                            ].map((book, index) => (
                                <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4 flex-1">
                                            <div className="h-20 w-16 bg-primary/10 rounded flex items-center justify-center">
                                                <Book className="h-8 w-8 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{book.title}</h3>
                                                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                                                    </div>
                                                    <Badge
                                                        variant={book.overdue ? 'destructive' : 'default'}
                                                    >
                                                        {book.status}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    <p>ISBN: {book.isbn}</p>
                                                    <div className="flex gap-4">
                                                        <span className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            Borrowed: {book.borrowed}
                                                        </span>
                                                        <span className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            Due: <span className={book.overdue ? 'text-orange-600 font-medium' : ''}>
                                                                {book.due}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <Button variant="outline" size="sm">
                                                        Renew Book
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Borrowing History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Borrowing History</CardTitle>
                        <CardDescription>Recently returned books</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                {
                                    title: 'Pharmacology Essentials',
                                    author: 'Richard D. Howland',
                                    borrowed: '2025-10-01',
                                    returned: '2025-11-15',
                                },
                                {
                                    title: 'Medical Microbiology',
                                    author: 'Patrick R. Murray',
                                    borrowed: '2025-09-15',
                                    returned: '2025-10-20',
                                },
                            ].map((book, index) => (
                                <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{book.title}</h3>
                                            <p className="text-sm text-muted-foreground">by {book.author}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Borrowed: {book.borrowed} | Returned: {book.returned}
                                            </p>
                                        </div>
                                        <Badge variant="outline">Returned</Badge>
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
