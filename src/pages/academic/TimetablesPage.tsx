/**
 * Timetables Page
 * Enhanced with Grid View and Interactive Selection
 */

import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Calendar, Clock, User, MapPin, LayoutGrid } from 'lucide-react';
// import { toast } from 'sonner';
import { useTimetable } from '../../hooks/useAcademic';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { TimetableForm } from './components/TimetableForm';
import { CollegeField } from '../../components/common/CollegeField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { isSuperAdmin, getCurrentUserCollege } from '../../utils/auth.utils';
import { classApi, sectionApi, classTimeApi } from '../../services/academic.service';
import type { TimetableListItem, ClassListItem, Section, ClassTime, TimetableFilters, TimetableCreateInput } from '../../types/academic.types';
import { cn } from '../../lib/utils';

const DAYS_OF_WEEK = [
    { value: 0, label: 'Monday' },
    { value: 1, label: 'Tuesday' },
    { value: 2, label: 'Wednesday' },
    { value: 3, label: 'Thursday' },
    { value: 4, label: 'Friday' },
    { value: 5, label: 'Saturday' },
    { value: 6, label: 'Sunday' },
];

export default function TimetablesPage() {
    const { user } = useAuth();
    const isSuper = isSuperAdmin(user);
    const userCollegeId = getCurrentUserCollege(user as any);

    // -- Selection State --
    const [selectedCollege, setSelectedCollege] = useState<number | null>(userCollegeId || null);
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [selectedSection, setSelectedSection] = useState<number | null>(null);

    // -- Data Lists --
    const [classes, setClasses] = useState<ClassListItem[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [classTimes, setClassTimes] = useState<ClassTime[]>([]);

    // -- UI State --
    const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedTimetableId, setSelectedTimetableId] = useState<number | undefined>(undefined);
    const [prefilledData, setPrefilledData] = useState<Partial<TimetableCreateInput> | undefined>(undefined);
    
    // -- Fetch Timetable Data --
    const filters: TimetableFilters = useMemo(() => ({
        page: 1, 
        page_size: 100,
        class_obj: selectedClass || undefined,
        section: selectedSection || undefined,
        is_active: true
    }), [selectedClass, selectedSection]);

    const { data: timetableData, refetch } = useTimetable(filters);
    
    const timetables = timetableData?.results || [];

    // -- Effects --

    // 1. Fetch Classes when College changes
    useEffect(() => {
        if (selectedCollege) {
            classApi.list({ college: selectedCollege, page_size: 100, is_active: true })
                .then(res => setClasses(res.results))
                .catch(err => console.error("Failed to fetch classes", err));
            
            classTimeApi.list({ college: selectedCollege, page_size: 100, is_active: true, ordering: 'period_number' })
                .then(res => setClassTimes(res.results))
                .catch(err => console.error("Failed to fetch class times", err));

        } else {
            setClasses([]);
            setClassTimes([]);
        }
    }, [selectedCollege]);

    // 2. Fetch Sections when Class changes
    useEffect(() => {
        if (selectedClass) {
            sectionApi.list({ class_obj: selectedClass, page_size: 100, is_active: true })
                .then(res => setSections(res.results))
                .catch(err => console.error("Failed to fetch sections", err));
        } else {
            setSections([]);
        }
        setSelectedSection(null);
    }, [selectedClass]);

    // -- Handlers --

    const handleCellClick = (day: number, timePeriod: ClassTime) => {
        if (!selectedCollege || !selectedClass || !selectedSection) return;

        const existingEntry = timetables.find(t => t.day_of_week === day && t.class_time === timePeriod.id);

        if (existingEntry) {
            // Edit Mode
            setSelectedTimetableId(existingEntry.id);
            setSidebarMode('edit');
            setPrefilledData({
                college: selectedCollege,
                class_obj: selectedClass,
                section: selectedSection,
            });
            setIsSidebarOpen(true);
        } else {
            // Create Mode
            setSelectedTimetableId(undefined);
            setSidebarMode('create');
            setPrefilledData({
                college: selectedCollege,
                class_obj: selectedClass,
                section: selectedSection,
                day_of_week: day,
                class_time: timePeriod.id,
                effective_from: new Date().toISOString().split('T')[0]
            });
            setIsSidebarOpen(true);
        }
    };

    const handleCollegeChange = (val: number | string) => {
        const id = Number(val);
        setSelectedCollege(id);
        setSelectedClass(null);
        setSelectedSection(null);
    };

    const sortedPeriods = [...classTimes].sort((a, b) => a.period_number - b.period_number);

    return (
        <div className="p-4 md:p-6 space-y-6 animate-fade-in bg-slate-50 dark:bg-slate-900 min-h-screen">
            
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Timetables</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage weekly schedules efficiently.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* College Selector (Super Admin) */}
                    {isSuper && (
                        <div className="w-full sm:w-[200px]">
                            <CollegeField 
                                value={selectedCollege} 
                                onChange={handleCollegeChange} 
                                label="College"
                                className="mb-0"
                            />
                        </div>
                    )}

                    {/* Class Selector */}
                    <div className="w-full sm:w-[200px]">
                        <label className="text-sm font-medium mb-2 block">Class</label>
                        <Select 
                            value={selectedClass?.toString()} 
                            onValueChange={(v) => setSelectedClass(Number(v))}
                            disabled={!selectedCollege}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => (
                                    <SelectItem key={c.id} value={c.id.toString()}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Section Selector */}
                    <div className="w-full sm:w-[200px]">
                        <label className="text-sm font-medium mb-2 block">Section</label>
                        <Select 
                            value={selectedSection?.toString()} 
                            onValueChange={(v) => setSelectedSection(Number(v))}
                            disabled={!selectedClass}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                                {sections.map(s => (
                                    <SelectItem key={s.id} value={s.id.toString()}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            {!selectedSection ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed text-center animate-in fade-in-50">
                    <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                        <LayoutGrid className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Timetable Selected</h3>
                    <p className="text-muted-foreground max-w-sm">
                        Please select a College, Class, and Section from the dropdowns above to view or manage the schedule.
                    </p>
                </div>
            ) : (
                <Card className="border-0 shadow-lg ring-1 ring-slate-900/5 dark:ring-slate-50/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b bg-white dark:bg-slate-900 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-500" />
                                    Weekly Schedule
                                </CardTitle>
                                <CardDescription>
                                    Create and manage classes by clicking on the time slots.
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border-blue-200">
                                {classes.find(c => c.id === selectedClass)?.name} - {sections.find(s => s.id === selectedSection)?.name}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <div className="min-w-[1200px]">
                            {/* Grid Header: Days */}
                            <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b divide-x bg-slate-50 dark:bg-slate-900/50">
                                <div className="sticky left-0 z-20 p-4 font-semibold text-sm text-center text-muted-foreground flex items-center justify-center bg-slate-50 dark:bg-slate-900 border-r shadow-sm">
                                    <Clock className="w-4 h-4 mr-2" /> Time
                                </div>
                                {DAYS_OF_WEEK.map(day => (
                                    <div key={day.value} className="p-4 font-semibold text-sm text-center text-slate-700 dark:text-slate-200">
                                        {day.label}
                                    </div>
                                ))}
                            </div>

                            {/* Grid Body: Periods Rows */}
                            {sortedPeriods.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground">
                                    No class time slots defined for this college. Please configure class times first.
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {sortedPeriods.map((period) => (
                                        <div key={period.id} className="grid grid-cols-[100px_repeat(7,1fr)] divide-x hover:bg-slate-50/50 transition-colors">
                                            {/* Time Column */}
                                            <div className="sticky left-0 z-10 p-3 text-xs font-medium text-center flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 border-r shadow-sm group">
                                                <Badge variant="secondary" className="mb-1 text-[10px] px-1 h-5">P-{period.period_number}</Badge>
                                                <span className="text-slate-500 whitespace-nowrap">{period.start_time.slice(0, 5)}</span>
                                                <span className="text-slate-400 text-[10px]">to</span>
                                                <span className="text-slate-500 whitespace-nowrap">{period.end_time.slice(0, 5)}</span>
                                            </div>

                                            {/* Days Columns */}
                                            {DAYS_OF_WEEK.map((day) => {
                                                const entry = timetables.find(t => t.day_of_week === day.value && t.class_time === period.id);
                                                
                                                if (period.is_break) {
                                                    return (
                                                        <div key={`${day.value}-${period.id}`} className="p-2 bg-slate-100/50 dark:bg-slate-800/50 flex items-center justify-center">
                                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest rotate-0">
                                                                {period.break_name || "BREAK"}
                                                            </span>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div 
                                                        key={`${day.value}-${period.id}`}
                                                        onClick={() => handleCellClick(day.value, period)}
                                                        className={cn(
                                                            "p-2 min-h-[100px] cursor-pointer transition-all border-transparent border-2 hover:border-blue-300 dark:hover:border-blue-700 relative group",
                                                            entry ? "bg-white dark:bg-slate-800" : "hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                                                        )}
                                                    >
                                                        {entry ? (
                                                            <div className="h-full flex flex-col justify-between p-1 rounded bg-blue-50/50 dark:bg-indigo-950/30 border border-blue-100 dark:border-indigo-900/50 hover:shadow-md transition-shadow">
                                                                <div>
                                                                    <div className="font-bold text-sm text-blue-900 dark:text-blue-100 leading-tight mb-1">
                                                                        {entry.subject_name}
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-1">
                                                                        <User className="w-3 h-3" />
                                                                        <span className="truncate max-w-[120px]" title={entry.teacher_name || undefined}>{entry.teacher_name}</span>
                                                                    </div>
                                                                    {entry.classroom_name && (
                                                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
                                                                            <MapPin className="w-3 h-3" />
                                                                            <span>{entry.classroom_name}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="opacity-0 group-hover:opacity-100 absolute top-1 right-1 transition-opacity">
                                                                     <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full bg-white shadow-sm">
                                                                         <Edit2 className="w-3 h-3 text-slate-500" />
                                                                     </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Plus className="w-5 h-5 text-blue-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={sidebarMode === 'create' ? 'Add Schedule Entry' : 'Edit Schedule Entry'}
                mode={sidebarMode}
            >
                <TimetableForm 
                    mode={sidebarMode} 
                    timetableId={selectedTimetableId}
                    prefilledData={prefilledData}
                    onSuccess={() => { setIsSidebarOpen(false); refetch(); }}
                    onCancel={() => setIsSidebarOpen(false)} 
                    lockContextFields={true}
                />
            </DetailSidebar>
        </div>
    );
}
