# KUMSS ERP - Core Module Setup

## Overview

A comprehensive Core module has been implemented for the KUMSS ERP frontend application. The module includes complete CRUD operations for all Core entities with type-safe API integration.

## Project Structure

```
src/
├── types/
│   └── core.types.ts           # All Core module TypeScript types
├── services/
│   └── core.service.ts         # API service functions for Core entities
├── hooks/
│   └── useCore.ts              # Custom React hooks for Core module
├── pages/
│   └── core/
│       ├── CollegesPage.tsx
│       ├── AcademicYearsPage.tsx
│       ├── AcademicSessionsPage.tsx
│       ├── HolidaysPage.tsx
│       ├── WeekendsPage.tsx
│       ├── SystemSettingsPage.tsx
│       ├── NotificationSettingsPage.tsx
│       └── ActivityLogsPage.tsx
└── App.tsx                     # Updated with Core module routes
```

## Features Implemented

### 1. Type Definitions (`src/types/core.types.ts`)

Complete TypeScript types for all Core entities:

#### Base Types
- `UserBasic` - Basic user information
- `AuditFields` - Audit trail fields (created_by, updated_by, timestamps)
- `BaseEntity` - Base entity with id and is_active
- `PaginatedResponse<T>` - Generic pagination wrapper

#### Entity Types
- **College** - Full college entity with all fields
- **AcademicYear** - Academic year/session
- **AcademicSession** - Semester/session within academic year
- **Holiday** - Holiday configuration
- **Weekend** - Weekend day configuration
- **SystemSetting** - System-wide settings
- **NotificationSetting** - Notification gateway configuration
- **ActivityLog** - Audit trail logs (read-only)

#### Input/Filter Types
- Create/Update input types for all entities
- Filter types for list queries with pagination support

### 2. API Service (`src/services/core.service.ts`)

Comprehensive API service layer with:

#### Features
- Type-safe API calls for all endpoints
- Automatic header injection (X-Tenant-ID, Content-Type)
- Session cookie handling (`credentials: 'include'`)
- Error handling with proper error types
- Query string builder for filters and pagination

#### API Modules
- `collegeApi` - Full CRUD + bulk operations
- `academicYearApi` - Full CRUD + get current year
- `academicSessionApi` - Full CRUD operations
- `holidayApi` - Full CRUD operations
- `weekendApi` - Full CRUD operations
- `systemSettingApi` - CRUD without delete
- `notificationSettingApi` - CRUD without delete
- `activityLogApi` - Read-only operations

### 3. Custom Hooks (`src/hooks/useCore.ts`)

React hooks for state management and API integration:

#### Query Hooks (Fetching Data)
- `useColleges(filters)` - List colleges with filters
- `useCollege(id)` - Get single college
- `useAcademicYears(filters)` - List academic years
- `useAcademicYear(id)` - Get single academic year
- `useCurrentAcademicYear()` - Get current academic year
- `useAcademicSessions(filters)` - List sessions
- `useHolidays(filters)` - List holidays
- `useWeekends(filters)` - List weekends
- `useSystemSettings(filters)` - List system settings
- `useNotificationSettings(filters)` - List notification settings
- `useActivityLogs(filters)` - List activity logs

#### Mutation Hooks (Modifying Data)
- `useCreateCollege()` - Create new college
- `useUpdateCollege()` - Update college
- `useDeleteCollege()` - Soft delete college
- `useCreateAcademicYear()` - Create academic year
- `useUpdateAcademicYear()` - Update academic year
- `useDeleteAcademicYear()` - Delete academic year
- `useCreateAcademicSession()` - Create session
- `useCreateHoliday()` - Create holiday

#### Hook Features
- Loading states
- Error handling
- Automatic refetch functionality
- Type-safe parameters and returns

### 4. Pages

All pages display raw API response data for testing and debugging:

#### `CollegesPage.tsx`
- List colleges with pagination
- Filters: page size, active status, search
- Create test college button
- Update/Delete operations for each college
- Raw JSON response display

#### `AcademicYearsPage.tsx`
- List academic years
- Display current academic year
- Filters: page size, current only, search
- Create test academic year
- Set year as current
- Delete operations

#### `AcademicSessionsPage.tsx`
- List academic sessions/semesters
- Filters: page size, semester number, search
- Create test session
- Display session details

#### `HolidaysPage.tsx`
- List holidays
- Create test holiday
- Display holiday type and date
- Raw JSON response

#### `WeekendsPage.tsx`
- List weekend configurations
- Display day names
- Read-only display

#### `SystemSettingsPage.tsx`
- List system settings
- Display JSON settings structure
- Read-only with refresh

#### `NotificationSettingsPage.tsx`
- List notification settings
- Display SMS/Email/WhatsApp status
- Show gateway configurations

#### `ActivityLogsPage.tsx`
- List activity logs (read-only)
- Filters: action type, model name, search
- Display user, timestamp, and description
- Full metadata in JSON

## Routes

All Core module routes are protected and accessible under `/core/`:

```typescript
/core/colleges                  - Colleges management
/core/academic-years            - Academic years management
/core/academic-sessions         - Academic sessions management
/core/holidays                  - Holidays management
/core/weekends                  - Weekends configuration
/core/system-settings           - System settings
/core/notification-settings     - Notification settings
/core/activity-logs             - Activity logs (audit trail)
```

## Usage Examples

### Fetching Colleges List

```typescript
import { useColleges } from '@/hooks/useCore';

function MyComponent() {
  const { data, isLoading, error, refetch } = useColleges({
    page: 1,
    page_size: 20,
    is_active: true,
    search: 'MIT',
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Total: {data?.count}</p>
      {data?.results.map(college => (
        <div key={college.id}>{college.name}</div>
      ))}
    </div>
  );
}
```

### Creating a College

```typescript
import { useCreateCollege } from '@/hooks/useCore';

function CreateCollegeForm() {
  const createCollege = useCreateCollege();

  const handleSubmit = async () => {
    try {
      const result = await createCollege.mutate({
        code: 'TEST',
        name: 'Test College',
        short_name: 'TC',
        email: 'test@college.edu',
        phone: '+1234567890',
        address_line1: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        pincode: '12345',
        country: 'USA',
      });
      console.log('Created:', result);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={createCollege.isLoading}>
      {createCollege.isLoading ? 'Creating...' : 'Create College'}
    </button>
  );
}
```

### Using Filters

```typescript
import { useState } from 'react';
import { useAcademicYears } from '@/hooks/useCore';

function AcademicYearsList() {
  const [page, setPage] = useState(1);
  const [showCurrent, setShowCurrent] = useState(false);

  const { data, isLoading } = useAcademicYears({
    page,
    page_size: 10,
    is_current: showCurrent || undefined,
    ordering: '-start_date',
  });

  return (
    <div>
      <button onClick={() => setShowCurrent(!showCurrent)}>
        {showCurrent ? 'Show All' : 'Show Current Only'}
      </button>
      {/* Display data */}
    </div>
  );
}
```

## API Integration

### Backend Requirements

Ensure your Django backend has:

1. **CORS Configuration**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3030",
]
CORS_ALLOW_CREDENTIALS = True
```

2. **Session Authentication Enabled**
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
}
```

3. **X-College-ID Middleware**
The frontend sends `X-Tenant-ID` header (configurable in `api.config.ts`)

### API Configuration

Update in `src/config/api.config.ts`:

```typescript
export const API_BASE_URL = 'http://127.0.0.1:8000'; // Your backend URL
export const TENANT_ID = 'tenant_001'; // Your tenant/college ID
```

## Page Display Format

All pages follow this format:

1. **Page Header** - Title and description
2. **Action Buttons** - Create test data, refresh
3. **Filters** - Page size, search, specific filters
4. **Summary** - Total count, page info
5. **Data Cards** - Each entity in a card with:
   - Entity name and key info
   - Action buttons (Update/Delete where applicable)
   - Raw JSON response in `<pre>` tags

## Features & Capabilities

### Pagination
- Next/Previous buttons
- Configurable page size (10, 20, 50, 100)
- Total count display

### Filtering
- Entity-specific filters
- Search functionality
- Active/inactive filtering
- Type filtering (holidays, actions, etc.)

### CRUD Operations
- **Create**: Test data creation buttons
- **Read**: List and detail views
- **Update**: Inline update operations
- **Delete**: Soft delete with confirmation

### Error Handling
- Loading states with spinners
- Error messages in red alert boxes
- Network error handling
- Validation error display

### Real-time Features
- Manual refetch functionality
- Automatic state updates after mutations
- Optimistic UI updates possible

## Backend Entity Mapping

| Frontend Type | Backend Model | Endpoints |
|--------------|---------------|-----------|
| College | College | `/api/v1/core/colleges/` |
| AcademicYear | AcademicYear | `/api/v1/core/academic-years/` |
| AcademicSession | AcademicSession | `/api/v1/core/academic-sessions/` |
| Holiday | Holiday | `/api/v1/core/holidays/` |
| Weekend | Weekend | `/api/v1/core/weekends/` |
| SystemSetting | SystemSetting | `/api/v1/core/system-settings/` |
| NotificationSetting | NotificationSetting | `/api/v1/core/notification-settings/` |
| ActivityLog | ActivityLog | `/api/v1/core/activity-logs/` |

## Testing

### Build Status
✅ Build successful with no errors

### Test Checklist
1. ✅ TypeScript compilation
2. ✅ All imports resolved
3. ✅ Type safety verified
4. ✅ Hooks properly structured
5. ✅ Pages render without errors

### Testing with Backend

1. **Start Backend**
   ```bash
   python manage.py runserver
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```

3. **Test Routes**
   - Navigate to `http://localhost:3030/core/colleges`
   - Test filtering and pagination
   - Try creating test data
   - Verify API responses in JSON display

## Next Steps

1. **Connect to Backend** - Ensure Django backend is running
2. **Test Authentication** - Login and access Core pages
3. **Verify Permissions** - Test with different user roles
4. **Add UI Enhancements** - Replace raw JSON with proper UI components
5. **Implement Forms** - Add proper create/edit forms
6. **Add Validation** - Client-side form validation
7. **Error Boundaries** - Add React error boundaries
8. **Loading Skeletons** - Replace loading text with skeleton screens

## Troubleshooting

### Build Errors
- Run `npm install` to ensure all dependencies
- Check TypeScript errors with `npm run build`

### API Connection Issues
- Verify backend is running on port 8000
- Check CORS configuration
- Verify `X-Tenant-ID` header is correct
- Check browser console for network errors

### Authentication Issues
- Ensure session cookies are enabled
- Verify login endpoint is working
- Check protected route logic

### Type Errors
- Ensure all types are imported from `@/types/core.types`
- Check for null/undefined handling
- Verify optional chaining where needed

## Support

For issues or questions:
- Check the Django API documentation at `/api/docs/`
- Review the backend serializers and viewsets
- Inspect network requests in browser DevTools

---

**Status**: ✅ Complete and Ready for Testing
**Build**: ✅ Successful
**Type Safety**: ✅ Full TypeScript Coverage
**Features**: ✅ All Core Module Entities Implemented
