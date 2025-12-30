# Hierarchical Context Selectors & Permissions - Implementation Guide

This guide shows how to integrate the permission-driven context selector system into any page in the ERP.

## 📋 Quick Reference

### 1. Add Context Selectors to a Page

Replace manual class/section dropdowns with the shared `ContextSelectorToolbar`:

```tsx
// OLD WAY - Manual dropdowns on every page
const [selectedClass, setSelectedClass] = useState<number | null>(null);
const [selectedSection, setSelectedSection] = useState<number | null>(null);

const { data: classesData } = useClasses({ page_size: 100 });
const { data: sectionsData } = useSections({ class_id: selectedClass });

<Select value={selectedClass} onValueChange={setSelectedClass}>
  {classes.map(cls => <SelectItem value={cls.id}>{cls.name}</SelectItem>)}
</Select>

// NEW WAY - Shared context selectors
import { ContextSelectorToolbar } from '@/components/context';
import { useHierarchicalContext } from '@/contexts/HierarchicalContext';

const { selectedClass, selectedSection, selectedCollege } = useHierarchicalContext();

// In your JSX:
<ContextSelectorToolbar />
```

### 2. Add Permission Guards to Buttons

```tsx
import { usePermissions } from '@/contexts/PermissionsContext';

const { permissions } = usePermissions();

// Conditional rendering
{permissions?.canCreateStudents && <Button onClick={handleAdd}>Add Student</Button>}

// Conditional handler
<DataTable
  onAdd={permissions?.canCreateStudents ? handleAdd : undefined}
  onDelete={permissions?.canDeleteStudents ? handleDelete : undefined}
/>

// Button disabled state
<Button
  onClick={handleSave}
  disabled={!permissions?.canEditStudents || isLoading}
>
  Save Changes
</Button>
```

### 3. Hide Sensitive Fields

```tsx
// Email/Phone/Aadhaar - hide from students/restricted roles
{
  key: 'email',
  label: 'Email',
  render: (student) => permissions?.canViewStudentSensitiveFields ? (
    <span>{student.email}</span>
  ) : (
    <span className="text-muted-foreground">Hidden</span>
  )
}
```

### 4. Apply Context Filters to API Calls

```tsx
const { selectedClass, selectedSection } = useHierarchicalContext();

// Automatically filter data based on context
const { data } = useStudents({
  ...filters,
  class_obj: selectedClass || undefined,
  section: selectedSection || undefined,
});

// Reset pagination when context changes
useEffect(() => {
  setFilters(prev => ({ ...prev, page: 1 }));
}, [selectedClass, selectedSection]);
```

## 📂 Page Patterns by Module

### Attendance Pages

**Pattern**: All attendance pages need class/section context

✅ **Updated**:
- `StudentAttendancePage.tsx` - Uses `ContextSelectorToolbar`
- `TeacherAttendanceMarkingPage.tsx` - Uses `ContextSelectorToolbar`

**To Update**:
- `AttendanceMarkingPage.tsx` - Add `ContextSelectorToolbar`
- `SubjectAttendancePage.tsx` - Add `ContextSelectorToolbar`
- `StaffAttendancePage.tsx` - May not need selectors (staff is different hierarchy)

**Code Pattern**:
```tsx
import { ContextSelectorToolbar } from '@/components/context';
import { useHierarchicalContext } from '@/contexts/HierarchicalContext';
import { usePermissions } from '@/contexts/PermissionsContext';

const MyAttendancePage = () => {
  const { selectedClass, selectedSection } = useHierarchicalContext();
  const { permissions } = usePermissions();

  return (
    <div className="space-y-6">
      <ContextSelectorToolbar />

      {/* Your content here */}
      {selectedClass && selectedSection && (
        <Card>
          {/* Attendance marking UI */}
        </Card>
      )}
    </div>
  );
};
```

### Student Pages

**Pattern**: Student pages need class/section context + sensitive field protection

✅ **Updated**:
- `StudentsPage.tsx` - Uses context selectors + field hiding

**To Update**:
- `StudentDetailPage.tsx` - Add field-level permissions
- `StudentDocumentsPage.tsx` - Add upload/delete permissions
- `StudentPromotionsPage.tsx` - Add promotion permissions
- `StudentCategoriesPage.tsx` - Add category management permissions

**Code Pattern**:
```tsx
const columns: Column<StudentListItem>[] = [
  {
    key: 'email',
    label: 'Email',
    render: (student) => permissions?.canViewStudentSensitiveFields
      ? student.email
      : 'Hidden'
  },
  {
    key: 'phone',
    label: 'Phone',
    render: (student) => permissions?.canViewStudentSensitiveFields
      ? student.phone
      : 'Hidden'
  },
];

// Add button with permission
<DataTable
  onAdd={permissions?.canCreateStudents ? handleAdd : undefined}
/>
```

### Examination Pages

**Pattern**: Exams need class/section context for results, marking

**To Update**:
- `ExamsPage.tsx` - Add context selectors
- `ExamSchedulesPage.tsx` - Add context selectors
- `MarksEntryPage.tsx` - Add context selectors + edit permissions
- `MarkingRegisterPage.tsx` - Add context selectors
- `GradeSheetsPage.tsx` - Add view permissions

**Code Pattern**:
```tsx
const ExamsPage = () => {
  const { selectedClass, selectedSection } = useHierarchicalContext();
  const { permissions } = usePermissions();

  const { data } = useExams({
    class_obj: selectedClass || undefined,
    section: selectedSection || undefined,
  });

  return (
    <div className="space-y-6">
      <ContextSelectorToolbar />

      {permissions?.canCreateExaminations && (
        <Button onClick={handleAdd}>Create Exam</Button>
      )}
    </div>
  );
};
```

### Fee Pages

**Pattern**: Fees need class/section context for collections

**To Update**:
- `FeeCollectionsPage.tsx` - Add context selectors
- `FeeStructuresPage.tsx` - Add context selectors
- `FeeDiscountsPage.tsx` - Add context selectors + create permissions
- `FeeFinesPage.tsx` - Add context selectors

**Code Pattern**:
```tsx
const FeeCollectionsPage = () => {
  const { selectedClass, selectedSection } = useHierarchicalContext();
  const { permissions } = usePermissions();

  return (
    <div className="space-y-6">
      <ContextSelectorToolbar />

      <DataTable
        onAdd={permissions?.canCreateFees ? handleCollect : undefined}
      />
    </div>
  );
};
```

### Academic Pages

**Pattern**: Classes/Sections pages DON'T need context selectors (they ARE the context)

**To Update**:
- `ClassesPage.tsx` - Add create/edit/delete permissions only
- `SectionsPage.tsx` - Add create/edit/delete permissions only
- `ProgramsPage.tsx` - Add permissions
- `FacultyPage.tsx` - Add permissions

**Code Pattern**:
```tsx
const ClassesPage = () => {
  const { permissions } = usePermissions();

  return (
    <DataTable
      onAdd={permissions?.canCreateClasses ? handleAdd : undefined}
      onEdit={permissions?.canEditClasses ? handleEdit : undefined}
      onDelete={permissions?.canDeleteClasses ? handleDelete : undefined}
    />
  );
};
```

### Staff/HR Pages

**Pattern**: Staff pages use different hierarchy (departments, not classes)

**To Update**:
- `StaffPage.tsx` - Add CRUD permissions
- `DepartmentsPage.tsx` - Add CRUD permissions
- `SalaryStructuresPage.tsx` - Add view/edit permissions
- `LeaveApplicationsPage.tsx` - Add approval permissions

### Library Pages

**Pattern**: Library pages need student/class context for book issues

**To Update**:
- `BooksPage.tsx` - Add CRUD permissions
- `BookIssuesPage.tsx` - Add context selectors + issue/return permissions

### Reports Pages

**Pattern**: Reports need context selectors + export permissions

**To Update**:
- `ReportsPage.tsx` - Add context selectors
- `AttendanceReportPage.tsx` - Add context selectors + export permissions
- `FeeReportPage.tsx` - Add context selectors + export permissions

## 🎯 Permission Flags Reference

Available permission booleans from `usePermissions()`:

```typescript
interface NormalizedPermissions {
  // Context
  canChooseCollege: boolean;
  canChooseClass: boolean;
  canChooseSection: boolean;

  // Attendance
  canViewAttendance: boolean;
  canMarkAttendance: boolean;
  canEditAttendance: boolean;
  canDeleteAttendance: boolean;
  canExportAttendance: boolean;

  // Students
  canViewStudents: boolean;
  canCreateStudents: boolean;
  canEditStudents: boolean;
  canDeleteStudents: boolean;
  canViewStudentSensitiveFields: boolean;
  canExportStudents: boolean;

  // Classes & Sections
  canViewClasses: boolean;
  canCreateClasses: boolean;
  canEditClasses: boolean;
  canDeleteClasses: boolean;
  canViewSections: boolean;
  canCreateSections: boolean;
  canEditSections: boolean;
  canDeleteSections: boolean;

  // Examinations
  canViewExaminations: boolean;
  canCreateExaminations: boolean;
  canEditExaminations: boolean;
  canDeleteExaminations: boolean;
  canViewAllResults: boolean;

  // Fees
  canViewFees: boolean;
  canCreateFees: boolean;
  canEditFees: boolean;
  canDeleteFees: boolean;

  // Staff
  canViewStaff: boolean;
  canCreateStaff: boolean;
  canEditStaff: boolean;
  canDeleteStaff: boolean;

  // Roles
  isSuperAdmin: boolean;
  isCollegeAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}
```

## 🔧 Common Patterns

### 1. Permission Guard Component

For complex conditional rendering:

```tsx
import { PermissionGuard } from '@/components/permissions';

<PermissionGuard permission="canDeleteStudents">
  <Button variant="destructive" onClick={handleDelete}>
    Delete Student
  </Button>
</PermissionGuard>
```

### 2. Multiple Permissions (ANY)

```tsx
import { MultiPermissionGuard } from '@/components/permissions';

<MultiPermissionGuard
  permissions={['canEditStudents', 'canDeleteStudents']}
  requireAll={false} // ANY permission is enough
>
  <ActionsDropdown />
</MultiPermissionGuard>
```

### 3. Multiple Permissions (ALL)

```tsx
<MultiPermissionGuard
  permissions={['canViewStudents', 'canExportStudents']}
  requireAll={true} // ALL permissions required
>
  <Button onClick={handleExport}>Export to CSV</Button>
</MultiPermissionGuard>
```

### 4. Role-Based Rendering

```tsx
import { RoleGuard } from '@/components/permissions';

<RoleGuard roles={['isSuperAdmin', 'isCollegeAdmin']}>
  <SettingsButton />
</RoleGuard>
```

## ✅ Checklist for Each Page

- [ ] Import `ContextSelectorToolbar` if page needs class/section filtering
- [ ] Import `useHierarchicalContext` to read selected values
- [ ] Import `usePermissions` for permission checks
- [ ] Replace manual class/section dropdowns with `<ContextSelectorToolbar />`
- [ ] Add `selectedClass`/`selectedSection` to API queries
- [ ] Add permission checks to Add/Edit/Delete buttons
- [ ] Add permission-based field hiding for sensitive data
- [ ] Add `useEffect` to reset pagination when context changes
- [ ] Test with different user roles (super admin, teacher, student)

## 🚀 Example: Full Page Implementation

See `src/pages/students/StudentsPage.tsx` or `src/pages/attendance/StudentAttendancePage.tsx` for complete examples.

## 📝 Notes

- **Don't** add context selectors to pages that manage the context items themselves (Classes, Sections pages)
- **Do** add permission checks even if backend doesn't enforce yet (frontend UX improvement)
- **Do** hide sensitive fields from students/restricted roles
- **Don't** rely solely on frontend checks for security (backend must enforce)
- **Do** test with multiple roles to ensure correct behavior

## 🎨 UI Best Practices

1. **Always show context selectors first** (before main content)
2. **Disable buttons** instead of hiding them when possible (better UX)
3. **Show "No permission" message** when appropriate
4. **Use permission guards** for complex components
5. **Keep permission checks readable** (extract to constants if complex)

---

For questions or issues, refer to:
- Type definitions: `src/types/permissions.types.ts`
- Permission service: `src/services/permissions.service.ts`
- Context providers: `src/contexts/HierarchicalContext.tsx` & `PermissionsContext.tsx`
- Example pages: `src/pages/students/StudentsPage.tsx`, `src/pages/attendance/StudentAttendancePage.tsx`
