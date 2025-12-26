/**
 * Print Requests Page
 * Manage print requests for question papers, certificates, and documents
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Printer,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Zap,
  Calendar,
  User,
  Package,
  TrendingUp,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  mockPrintRequests,
  getPrintRequestStatusColor,
  getPrintPriorityColor,
  formatCurrency,
  type PrintRequest,
  type PrintRequestStatus,
  type PrintPriority,
} from '@/data/storeMockData';

export const PrintRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<PrintRequest[]>(mockPrintRequests);
  const [selectedRequest, setSelectedRequest] = useState<PrintRequest | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    title: '',
    documentType: 'question_paper',
    copies: 100,
    paperType: 'A4',
    colorType: 'black_white',
    bindingType: 'staple',
    totalPages: 1,
    priority: 'normal' as PrintPriority,
    requiredDate: '',
    notes: '',
  });

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || req.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Statistics
  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    urgent: requests.filter(r => r.priority === 'urgent' && r.status !== 'completed' && r.status !== 'rejected').length,
  };

  const handleCreateRequest = () => {
    const totalSheets = composeForm.copies * composeForm.totalPages;
    const estimatedCost = totalSheets * (composeForm.colorType === 'color' ? 10 : 3);

    const newRequest: PrintRequest = {
      id: requests.length + 1,
      requestNumber: `PR-2025-${String(requests.length + 1).padStart(3, '0')}`,
      title: composeForm.title,
      requestedBy: 'Current User',
      requestedByRole: 'teacher',
      requestDate: new Date().toISOString(),
      requiredDate: composeForm.requiredDate,
      priority: composeForm.priority,
      status: 'pending',
      documentType: composeForm.documentType as any,
      copies: composeForm.copies,
      paperType: composeForm.paperType as any,
      colorType: composeForm.colorType as any,
      bindingType: composeForm.bindingType as any,
      totalPages: composeForm.totalPages,
      totalSheets,
      estimatedCost,
      notes: composeForm.notes,
    };

    setRequests([newRequest, ...requests]);
    setIsCreateOpen(false);
    setComposeForm({
      title: '',
      documentType: 'question_paper',
      copies: 100,
      paperType: 'A4',
      colorType: 'black_white',
      bindingType: 'staple',
      totalPages: 1,
      priority: 'normal',
      requiredDate: '',
      notes: '',
    });
  };

  const handleApproveRequest = (id: number) => {
    setRequests(requests.map(r =>
      r.id === id ? { ...r, status: 'approved' as PrintRequestStatus, approvedBy: 'Store Manager', approvedDate: new Date().toISOString() } : r
    ));
  };

  const handleRejectRequest = (id: number) => {
    setRequests(requests.map(r =>
      r.id === id ? { ...r, status: 'rejected' as PrintRequestStatus } : r
    ));
  };

  const handleStartPrinting = (id: number) => {
    setRequests(requests.map(r =>
      r.id === id ? { ...r, status: 'in_progress' as PrintRequestStatus, assignedTo: 'Print Operator' } : r
    ));
  };

  const handleCompletePrinting = (id: number) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setRequests(requests.map(r =>
        r.id === id ? { ...r, status: 'completed' as PrintRequestStatus, completedDate: new Date().toISOString(), actualCost: request.estimatedCost } : r
      ));
    }
  };

  const getStatusIcon = (status: PrintRequestStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Printer className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Printer className="h-8 w-8 text-primary" />
            Print Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage printing requests for question papers and documents
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              New Print Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Print Request</DialogTitle>
              <DialogDescription>
                Submit a new printing request for approval
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Document Title *</label>
                <Input
                  placeholder="e.g., Final Exam - Mathematics"
                  value={composeForm.title}
                  onChange={(e) => setComposeForm({ ...composeForm, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Document Type</label>
                  <Select
                    value={composeForm.documentType}
                    onValueChange={(value) => setComposeForm({ ...composeForm, documentType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question_paper">Question Paper</SelectItem>
                      <SelectItem value="answer_sheet">Answer Sheet</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="form">Form</SelectItem>
                      <SelectItem value="notice">Notice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select
                    value={composeForm.priority}
                    onValueChange={(value) => setComposeForm({ ...composeForm, priority: value as PrintPriority })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Number of Copies *</label>
                  <Input
                    type="number"
                    min="1"
                    value={composeForm.copies}
                    onChange={(e) => setComposeForm({ ...composeForm, copies: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Pages per Copy *</label>
                  <Input
                    type="number"
                    min="1"
                    value={composeForm.totalPages}
                    onChange={(e) => setComposeForm({ ...composeForm, totalPages: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Paper Type</label>
                  <Select
                    value={composeForm.paperType}
                    onValueChange={(value) => setComposeForm({ ...composeForm, paperType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="A3">A3</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Color</label>
                  <Select
                    value={composeForm.colorType}
                    onValueChange={(value) => setComposeForm({ ...composeForm, colorType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="black_white">Black & White</SelectItem>
                      <SelectItem value="color">Color</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Binding</label>
                  <Select
                    value={composeForm.bindingType}
                    onValueChange={(value) => setComposeForm({ ...composeForm, bindingType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="staple">Staple</SelectItem>
                      <SelectItem value="spiral">Spiral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Required By Date *</label>
                <Input
                  type="date"
                  value={composeForm.requiredDate}
                  onChange={(e) => setComposeForm({ ...composeForm, requiredDate: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Additional Notes</label>
                <Textarea
                  placeholder="Any special instructions or requirements..."
                  rows={3}
                  value={composeForm.notes}
                  onChange={(e) => setComposeForm({ ...composeForm, notes: e.target.value })}
                />
              </div>

              {/* Cost Estimation */}
              <div className="p-4 bg-accent/30 rounded-lg">
                <h4 className="font-semibold mb-2">Cost Estimation</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Total Sheets:</span>
                  <span className="font-medium">{composeForm.copies * composeForm.totalPages}</span>
                  <span className="text-muted-foreground">Estimated Cost:</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(composeForm.copies * composeForm.totalPages * (composeForm.colorType === 'color' ? 10 : 3))}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateRequest}
                  disabled={!composeForm.title || !composeForm.requiredDate}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold mt-1">{stats.approved}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Printer className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.urgent}</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <Zap className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Print Requests</CardTitle>
            <Badge variant="outline">{filteredRequests.length} requests</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, request number, or requester..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Requests Grid */}
          <div className="space-y-3">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Printer className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No print requests found</p>
                <p className="text-sm">Create a new request to get started</p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className={cn(
                    "border rounded-lg p-4 hover:bg-accent/50 transition-all",
                    request.priority === 'urgent' && request.status !== 'completed' && request.status !== 'rejected' && "border-orange-500 bg-orange-500/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      {/* Title and Badges */}
                      <div className="flex items-start gap-2 flex-wrap">
                        <h4 className="font-semibold">{request.title}</h4>
                        <Badge variant={getPrintRequestStatusColor(request.status) as any} className="gap-1">
                          {getStatusIcon(request.status)}
                          {request.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant={getPrintPriorityColor(request.priority) as any}>
                          {request.priority}
                        </Badge>
                        {request.priority === 'urgent' && request.status !== 'completed' && request.status !== 'rejected' && (
                          <Badge variant="destructive" className="gap-1 animate-pulse">
                            <Bell className="h-3 w-3" />
                            Action Required
                          </Badge>
                        )}
                      </div>

                      {/* Meta Information */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {request.requestNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {request.requestedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {request.copies} copies × {request.totalPages} pages
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {formatDate(request.requiredDate)}
                        </span>
                      </div>

                      {/* Document Details */}
                      <div className="flex items-center gap-4 text-xs">
                        <span className="capitalize">{request.documentType.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{request.paperType}</span>
                        <span>•</span>
                        <span className="capitalize">{request.colorType.replace('_', ' ')}</span>
                        {request.bindingType && request.bindingType !== 'none' && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{request.bindingType}</span>
                          </>
                        )}
                      </div>

                      {request.notes && (
                        <p className="text-sm text-muted-foreground italic">"{request.notes}"</p>
                      )}
                    </div>

                    {/* Cost and Actions */}
                    <div className="text-right space-y-2 min-w-[150px]">
                      <div>
                        <p className="text-xs text-muted-foreground">Estimated Cost</p>
                        <p className="text-lg font-bold text-primary">{formatCurrency(request.estimatedCost)}</p>
                      </div>

                      <div className="flex flex-col gap-1">
                        {request.status === 'pending' && (
                          <>
                            <Button size="sm" variant="default" onClick={() => handleApproveRequest(request.id)}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRejectRequest(request.id)}>
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <Button size="sm" onClick={() => handleStartPrinting(request.id)}>
                            <Printer className="h-3 w-3 mr-1" />
                            Start Printing
                          </Button>
                        )}
                        {request.status === 'in_progress' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleCompletePrinting(request.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setSelectedRequest(request)}>
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedRequest.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getPrintRequestStatusColor(selectedRequest.status) as any}>
                  {selectedRequest.status.replace('_', ' ')}
                </Badge>
                <Badge variant={getPrintPriorityColor(selectedRequest.priority) as any}>
                  {selectedRequest.priority}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Request Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Request Number</p>
                  <p className="font-medium">{selectedRequest.requestNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Document Type</p>
                  <p className="font-medium capitalize">{selectedRequest.documentType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Requested By</p>
                  <p className="font-medium">{selectedRequest.requestedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Request Date</p>
                  <p className="font-medium">{formatDateTime(selectedRequest.requestDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Required By</p>
                  <p className="font-medium">{formatDate(selectedRequest.requiredDate)}</p>
                </div>
                {selectedRequest.assignedTo && (
                  <div>
                    <p className="text-muted-foreground">Assigned To</p>
                    <p className="font-medium">{selectedRequest.assignedTo}</p>
                  </div>
                )}
              </div>

              {/* Printing Specifications */}
              <div className="p-4 bg-accent/30 rounded-lg">
                <h4 className="font-semibold mb-3">Printing Specifications</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Copies:</span>
                    <span className="ml-2 font-medium">{selectedRequest.copies}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pages/Copy:</span>
                    <span className="ml-2 font-medium">{selectedRequest.totalPages}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Sheets:</span>
                    <span className="ml-2 font-medium">{selectedRequest.totalSheets}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Paper Type:</span>
                    <span className="ml-2 font-medium">{selectedRequest.paperType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Color:</span>
                    <span className="ml-2 font-medium capitalize">{selectedRequest.colorType.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Binding:</span>
                    <span className="ml-2 font-medium capitalize">{selectedRequest.bindingType || 'None'}</span>
                  </div>
                </div>
              </div>

              {/* Cost Information */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-primary/5 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Cost</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(selectedRequest.estimatedCost)}</p>
                </div>
                {selectedRequest.actualCost && (
                  <div>
                    <p className="text-sm text-muted-foreground">Actual Cost</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(selectedRequest.actualCost)}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedRequest.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground p-3 bg-accent/20 rounded-lg">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}

              {/* Timeline */}
              {(selectedRequest.approvedDate || selectedRequest.completedDate) && (
                <div>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    {selectedRequest.approvedDate && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Approved by {selectedRequest.approvedBy} on {formatDateTime(selectedRequest.approvedDate)}</span>
                      </div>
                    )}
                    {selectedRequest.completedDate && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Completed on {formatDateTime(selectedRequest.completedDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PrintRequestsPage;
