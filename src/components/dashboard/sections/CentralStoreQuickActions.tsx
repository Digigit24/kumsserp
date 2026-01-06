import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    ArrowRightLeft,
    FileCheck,
    PackagePlus,
    PlusCircle,
    Truck,
    Users,
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const CentralStoreQuickActions: React.FC = () => {
    const navigate = useNavigate();

    const actions = [
        {
            label: 'New Indent',
            icon: PlusCircle,
            href: '/store/indents-pipeline',
            color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200',
        },
        {
            label: 'Stock Receipt',
            icon: PackagePlus,
            href: '/store/stock-receipts',
            color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
        },
        {
            label: 'Material Issue',
            icon: Truck,
            href: '/store/material-issues',
            color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200',
        },
        {
            label: 'Transfer Stock',
            icon: ArrowRightLeft,
            href: '/store/transfers-workflow',
            color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
        },
        {
            label: 'Manage Vendors',
            icon: Users,
            href: '/store/vendors',
            color: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200',
        },
        {
            label: 'Approvals',
            icon: FileCheck,
            href: '/store/approvals',
            color: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200',
        },
    ];

    return (
        <Card className="h-full border-none shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <motion.div
                        animate={{ rotate: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        ⚡
                    </motion.div>
                    Quick Actions
                </CardTitle>
                <CardDescription>Shortcut access to frequent tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {actions.map((action, index) => (
                    <motion.div
                        key={action.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="outline"
                            className={`h-24 w-full flex flex-col gap-3 items-center justify-center p-2 text-center whitespace-normal border shadow-sm ${action.color}`}
                            onClick={() => navigate(action.href)}
                        >
                            <action.icon className="h-6 w-6" />
                            <span className="text-xs font-semibold">{action.label}</span>
                        </Button>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
};
