/**
 * Store Items Page
 * Main inventory management interface
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
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Download,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  mockStoreItems,
  getStockStatusColor,
  formatCurrency,
  getStoreStatistics,
  type StoreItem,
  type ItemCategory,
  type StockStatus,
} from '@/data/storeMockData';

export const StoreItemsPage: React.FC = () => {
  const [items, setItems] = useState<StoreItem[]>(mockStoreItems);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form state
  const [itemForm, setItemForm] = useState({
    itemCode: '',
    name: '',
    category: 'stationery' as ItemCategory,
    description: '',
    unit: 'Piece',
    currentStock: 0,
    minStockLevel: 10,
    maxStockLevel: 100,
    reorderPoint: 20,
    unitPrice: 0,
    location: '',
    supplier: '',
  });

  const stats = getStoreStatistics();

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateItem = () => {
    const totalValue = itemForm.currentStock * itemForm.unitPrice;
    let status: StockStatus = 'in_stock';

    if (itemForm.currentStock === 0) status = 'out_of_stock';
    else if (itemForm.currentStock < itemForm.minStockLevel) status = 'low_stock';
    else if (itemForm.currentStock > itemForm.maxStockLevel) status = 'overstocked';

    const newItem: StoreItem = {
      id: items.length + 1,
      ...itemForm,
      totalValue,
      status,
      lastRestocked: new Date().toISOString().split('T')[0],
    };

    setItems([newItem, ...items]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleUpdateItem = () => {
    if (!selectedItem) return;

    const totalValue = itemForm.currentStock * itemForm.unitPrice;
    let status: StockStatus = 'in_stock';

    if (itemForm.currentStock === 0) status = 'out_of_stock';
    else if (itemForm.currentStock < itemForm.minStockLevel) status = 'low_stock';
    else if (itemForm.currentStock > itemForm.maxStockLevel) status = 'overstocked';

    setItems(items.map(item =>
      item.id === selectedItem.id
        ? { ...item, ...itemForm, totalValue, status, lastRestocked: new Date().toISOString().split('T')[0] }
        : item
    ));

    setSelectedItem(null);
    resetForm();
  };

  const handleDeleteItem = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleEditItem = (item: StoreItem) => {
    setSelectedItem(item);
    setItemForm({
      itemCode: item.itemCode,
      name: item.name,
      category: item.category,
      description: item.description,
      unit: item.unit,
      currentStock: item.currentStock,
      minStockLevel: item.minStockLevel,
      maxStockLevel: item.maxStockLevel,
      reorderPoint: item.reorderPoint,
      unitPrice: item.unitPrice,
      location: item.location,
      supplier: item.supplier || '',
    });
  };

  const resetForm = () => {
    setItemForm({
      itemCode: '',
      name: '',
      category: 'stationery',
      description: '',
      unit: 'Piece',
      currentStock: 0,
      minStockLevel: 10,
      maxStockLevel: 100,
      reorderPoint: 20,
      unitPrice: 0,
      location: '',
      supplier: '',
    });
  };

  const getStatusIcon = (status: StockStatus) => {
    switch (status) {
      case 'in_stock': return null;
      case 'low_stock': return <AlertTriangle className="h-4 w-4" />;
      case 'out_of_stock': return <AlertTriangle className="h-4 w-4" />;
      case 'overstocked': return <TrendingUp className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            Store Inventory
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage store items and track inventory levels
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Add a new item to the store inventory
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Item Code *</label>
                  <Input
                    placeholder="e.g., ST-001"
                    value={itemForm.itemCode}
                    onChange={(e) => setItemForm({ ...itemForm, itemCode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={itemForm.category}
                    onValueChange={(value) => setItemForm({ ...itemForm, category: value as ItemCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stationery">Stationery</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="consumables">Consumables</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="printing">Printing Supplies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Item Name *</label>
                <Input
                  placeholder="e.g., A4 Printing Paper (Ream)"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Item description..."
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Unit</label>
                  <Select
                    value={itemForm.unit}
                    onValueChange={(value) => setItemForm({ ...itemForm, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Piece">Piece</SelectItem>
                      <SelectItem value="Box">Box</SelectItem>
                      <SelectItem value="Ream">Ream</SelectItem>
                      <SelectItem value="Set">Set</SelectItem>
                      <SelectItem value="Bottle">Bottle</SelectItem>
                      <SelectItem value="Packet">Packet</SelectItem>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="Liter">Liter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Unit Price (₹) *</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={itemForm.unitPrice}
                    onChange={(e) => setItemForm({ ...itemForm, unitPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Current Stock</label>
                  <Input
                    type="number"
                    min="0"
                    value={itemForm.currentStock}
                    onChange={(e) => setItemForm({ ...itemForm, currentStock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Min Stock Level</label>
                  <Input
                    type="number"
                    min="0"
                    value={itemForm.minStockLevel}
                    onChange={(e) => setItemForm({ ...itemForm, minStockLevel: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Max Stock Level</label>
                  <Input
                    type="number"
                    min="0"
                    value={itemForm.maxStockLevel}
                    onChange={(e) => setItemForm({ ...itemForm, maxStockLevel: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Reorder Point</label>
                  <Input
                    type="number"
                    min="0"
                    value={itemForm.reorderPoint}
                    onChange={(e) => setItemForm({ ...itemForm, reorderPoint: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="e.g., Store Room A, Shelf 1"
                    value={itemForm.location}
                    onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Supplier (Optional)</label>
                <Input
                  placeholder="Supplier name"
                  value={itemForm.supplier}
                  onChange={(e) => setItemForm({ ...itemForm, supplier: e.target.value })}
                />
              </div>

              {/* Value Calculation */}
              <div className="p-4 bg-accent/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Stock Value:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(itemForm.currentStock * itemForm.unitPrice)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateItem}
                  disabled={!itemForm.itemCode || !itemForm.name || itemForm.unitPrice === 0}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stock Alerts Banner */}
      {(stats.lowStockItems > 0 || stats.outOfStockItems > 0) && (
        <Card className="border-orange-500 bg-orange-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <div className="flex-1">
                <h4 className="font-semibold">Inventory Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  {stats.outOfStockItems > 0 && `${stats.outOfStockItems} items out of stock`}
                  {stats.outOfStockItems > 0 && stats.lowStockItems > 0 && ' • '}
                  {stats.lowStockItems > 0 && `${stats.lowStockItems} items low on stock`}
                </p>
              </div>
              <Button
                variant="default"
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => setStatusFilter('low_stock')}
              >
                View Items
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold mt-1">{stats.totalItems}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(stats.totalValue)}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{stats.lowStockItems}</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <TrendingDown className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.outOfStockItems}</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Inventory Items</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{filteredItems.length} items</Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items by name, code, or description..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="stationery">Stationery</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="consumables">Consumables</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="printing">Printing Supplies</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="overstocked">Overstocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm">Item Code</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-sm hidden md:table-cell">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Stock</th>
                  <th className="text-right py-3 px-4 font-medium text-sm hidden lg:table-cell">Unit Price</th>
                  <th className="text-right py-3 px-4 font-medium text-sm hidden lg:table-cell">Total Value</th>
                  <th className="text-center py-3 px-4 font-medium text-sm">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-muted-foreground">
                      <Package className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p className="text-lg font-medium">No items found</p>
                      <p className="text-sm">Add items to your inventory to get started</p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-accent/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-sm">{item.itemCode}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <Badge variant="outline" className="capitalize">
                          {item.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="font-medium">{item.currentStock}</p>
                        <p className="text-xs text-muted-foreground">{item.unit}</p>
                      </td>
                      <td className="py-3 px-4 text-right hidden lg:table-cell">
                        <p className="text-sm">{formatCurrency(item.unitPrice)}</p>
                      </td>
                      <td className="py-3 px-4 text-right hidden lg:table-cell">
                        <p className="font-medium">{formatCurrency(item.totalValue)}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={getStockStatusColor(item.status) as any} className="gap-1">
                          {getStatusIcon(item.status)}
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => { setSelectedItem(null); resetForm(); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>
                Update item details and inventory levels
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Same form fields as create */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Item Code *</label>
                  <Input
                    value={itemForm.itemCode}
                    onChange={(e) => setItemForm({ ...itemForm, itemCode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={itemForm.category}
                    onValueChange={(value) => setItemForm({ ...itemForm, category: value as ItemCategory })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stationery">Stationery</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="consumables">Consumables</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="printing">Printing Supplies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Item Name *</label>
                <Input
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Unit</label>
                  <Select
                    value={itemForm.unit}
                    onValueChange={(value) => setItemForm({ ...itemForm, unit: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Piece">Piece</SelectItem>
                      <SelectItem value="Box">Box</SelectItem>
                      <SelectItem value="Ream">Ream</SelectItem>
                      <SelectItem value="Set">Set</SelectItem>
                      <SelectItem value="Bottle">Bottle</SelectItem>
                      <SelectItem value="Packet">Packet</SelectItem>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="Liter">Liter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Unit Price (₹) *</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={itemForm.unitPrice}
                    onChange={(e) => setItemForm({ ...itemForm, unitPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Current Stock</label>
                  <Input
                    type="number"
                    min="0"
                    value={itemForm.currentStock}
                    onChange={(e) => setItemForm({ ...itemForm, currentStock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Min Stock Level</label>
                  <Input
                    type="number"
                    min="0"
                    value={itemForm.minStockLevel}
                    onChange={(e) => setItemForm({ ...itemForm, minStockLevel: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Max Stock Level</label>
                  <Input
                    type="number"
                    min="0"
                    value={itemForm.maxStockLevel}
                    onChange={(e) => setItemForm({ ...itemForm, maxStockLevel: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Reorder Point</label>
                  <Input
                    type="number"
                    min="0"
                    value={itemForm.reorderPoint}
                    onChange={(e) => setItemForm({ ...itemForm, reorderPoint: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    value={itemForm.location}
                    onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Supplier (Optional)</label>
                <Input
                  value={itemForm.supplier}
                  onChange={(e) => setItemForm({ ...itemForm, supplier: e.target.value })}
                />
              </div>

              <div className="p-4 bg-accent/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Stock Value:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(itemForm.currentStock * itemForm.unitPrice)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => { setSelectedItem(null); resetForm(); }}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateItem}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StoreItemsPage;
