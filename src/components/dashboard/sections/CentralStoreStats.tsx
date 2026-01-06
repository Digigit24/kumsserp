import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRightLeft,
    DollarSign,
    ShoppingCart,
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const CentralStoreStats: React.FC = () => {
    const navigate = useNavigate();

    // Mock data - Replace with actual API calls
    const stats = {
        totalValue: 12500000,
        lowStock: 12,
        pendingIndents: 8,
        pendingTransfers: 5,
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Total Inventory Value - Gradient Purple/Blue */}
            <motion.div variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-none bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    onClick={() => navigate('/store/central-inventory')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-indigo-100">Total Stock Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-indigo-100 opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{(stats.totalValue / 100000).toFixed(2)}L</div>
                        <p className="text-xs text-indigo-100 opacity-80 mt-1">
                            Across all categories
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Pending Indents - Gradient Orange/Red */}
            <motion.div variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-none bg-gradient-to-br from-orange-400 to-pink-500 text-white"
                    onClick={() => navigate('/store/indents-pipeline')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-100">Pending Indents</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-orange-100 opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingIndents}</div>
                        <p className="text-xs text-orange-100 opacity-80 font-medium mt-1">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Low Stock Alerts - Gradient Red/Maroon */}
            <motion.div variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-none bg-gradient-to-br from-red-500 to-rose-600 text-white"
                    onClick={() => navigate('/store/central-inventory?filter=low_stock')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-100">Low Stock Items</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-100 opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.lowStock}</div>
                        <p className="text-xs text-red-100 opacity-80 font-medium mt-1">
                            Reorder urgently
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Pending Transfers - Gradient Blue/Cyan */}
            <motion.div variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-none bg-gradient-to-br from-blue-400 to-cyan-500 text-white"
                    onClick={() => navigate('/store/transfers-workflow')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-100">Pending Transfers</CardTitle>
                        <ArrowRightLeft className="h-4 w-4 text-blue-100 opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingTransfers}</div>
                        <p className="text-xs text-blue-100 opacity-80 font-medium mt-1">
                            Awaiting approval
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};
