/**
 * Inventory Page - Fast, searchable inventory with quick actions
 * No CRUD focus - just search, view, and quick actions
 */

import { useState } from 'react';
import { Search, Package, TrendingDown, AlertCircle, Edit, Eye, History } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { useCentralInventory } from '../../hooks/useCentralInventory';

export const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 50 });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showLedger, setShowLedger] = useState(false);

  const { data, isLoading } = useCentralInventory(filters);

  const inventoryItems = data?.results || [];

  // Filter items based on search and tab
  const filteredItems = inventoryItems.filter((item: any) => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesCode = item.store_item_code?.toLowerCase().includes(search);
      const matchesName = item.store_item_name?.toLowerCase().includes(search);
      const matchesBarcode = item.store_item_barcode?.toLowerCase().includes(search);
      if (!matchesCode && !matchesName && !matchesBarcode) return false;
    }

    // Tab filter
    if (activeTab === 'low_stock') {
      return item.quantity_in_stock <= item.min_stock_level;
    } else if (activeTab === 'out_of_stock') {
      return item.quantity_in_stock === 0;
    }

    return true;
  });

  const getStockStatus = (item: any) => {
    if (item.quantity_in_stock === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const, color: 'text-red-500' };
    } else if (item.quantity_in_stock <= item.min_stock_level) {
      return { label: 'Low Stock', variant: 'outline' as const, color: 'text-yellow-500' };
    }
    return { label: 'In Stock', variant: 'secondary' as const, color: 'text-green-500' };
  };

  const lowStockCount = inventoryItems.filter(
    (item: any) => item.quantity_in_stock <= item.min_stock_level && item.quantity_in_stock > 0
  ).length;
  const outOfStockCount = inventoryItems.filter((item: any) => item.quantity_in_stock === 0).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">
          Search and manage central store inventory
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by item code, name, or barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 text-lg h-12"
          autoFocus
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inventoryItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-yellow-500" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{lowStockCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{outOfStockCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="low_stock">
            Low Stock
            {lowStockCount > 0 && (
              <Badge variant="outline" className="ml-2">
                {lowStockCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="out_of_stock">
            Out of Stock
            {outOfStockCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {outOfStockCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : filteredItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {searchTerm ? 'No items found matching your search' : 'No items to display'}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item: any) => {
                const status = getStockStatus(item);
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Item Info */}
                        <div className="col-span-5">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-muted rounded">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold">{item.store_item_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.store_item_code}
                                {item.store_item_barcode && ` • ${item.store_item_barcode}`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Central Store */}
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground">Central Store</p>
                          <p className="text-sm font-medium">
                            {item.central_store_name || `Store #${item.central_store}`}
                          </p>
                        </div>

                        {/* Stock Level */}
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground">Stock Level</p>
                          <div className="flex items-center gap-2">
                            <p className={`text-lg font-bold ${status.color}`}>
                              {item.quantity_in_stock}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              / {item.min_stock_level} min
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="col-span-1">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>

                        {/* Quick Actions */}
                        <div className="col-span-2 flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowLedger(false);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowLedger(true);
                            }}
                          >
                            <History className="h-3 w-3 mr-1" />
                            Ledger
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Item Detail Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {showLedger ? 'Stock Ledger' : 'Item Details'}: {selectedItem.store_item_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {!showLedger ? (
                // Item Details View
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Item Code</Label>
                      <p className="font-semibold">{selectedItem.store_item_code}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Barcode</Label>
                      <p className="font-semibold">{selectedItem.store_item_barcode || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Central Store</Label>
                      <p>
                        {selectedItem.central_store_name || `Store #${selectedItem.central_store}`}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Current Stock</Label>
                      <p className="text-2xl font-bold">{selectedItem.quantity_in_stock}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Min Stock Level</Label>
                      <p>{selectedItem.min_stock_level}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Reorder Point</Label>
                      <p>{selectedItem.reorder_point || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Stock Status</Label>
                    <div className="mt-2">
                      <Badge variant={getStockStatus(selectedItem).variant}>
                        {getStockStatus(selectedItem).label}
                      </Badge>
                    </div>
                  </div>
                </>
              ) : (
                // Ledger View
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Transaction history for this item
                  </p>
                  <Card className="bg-muted/30">
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Stock ledger/transactions view to be implemented</p>
                      <p className="text-xs mt-2">
                        Will show: Date, Type (IN/OUT), Quantity, Reference, Balance
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
