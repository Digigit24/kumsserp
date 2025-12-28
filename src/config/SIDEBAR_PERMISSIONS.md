# Sidebar Configuration - Permission-Based Architecture

## Overview

The sidebar now supports **both role-based and permission-based filtering**. This gives you maximum flexibility to control which menu items appear for different users.

## How It Works

### 1. Role-Based Filtering (Simple)
Use the `roles` array to specify which roles can see an item:

```typescript
{
  name: "Students",
  href: "/students/list",
  icon: Users,
  roles: ["super_admin", "college_admin", "teacher"], // Only these roles can see this
}
```

### 2. Permission-Based Filtering (Flexible)
Use the `permissions` array for fine-grained control:

```typescript
{
  name: "Department Management",
  href: "/departments/manage",
  icon: Building2,
  permissions: ["manage_department", "view_department"], // User needs ANY of these
}
```

### 3. Require ALL Permissions
Use `requireAllPermissions: true` to require all permissions:

```typescript
{
  name: "System Configuration",
  href: "/system/config",
  icon: Settings,
  permissions: ["system_admin", "config_access"],
  requireAllPermissions: true, // User needs BOTH permissions
}
```

### 4. Combine Roles AND Permissions
You can use both! If user has the role OR the permission, they see the item:

```typescript
{
  name: "Reports",
  href: "/reports",
  icon: BarChart,
  roles: ["super_admin"], // Admins always see this
  permissions: ["view_reports"], // OR anyone with view_reports permission
}
```

## Real-World Examples

### Example 1: HOD (Head of Department)

HOD needs to see both teacher features AND department management features.

**Option A: Add HOD role to existing items**
```typescript
{
  name: "Attendance",
  href: "/teacher/attendance",
  icon: ClipboardList,
  roles: ["teacher", "hod"], // Added 'hod' here
}
```

**Option B: Use permissions**
```typescript
{
  group: "Department Management",
  icon: Building2,
  permissions: ["manage_department"], // Anyone with this permission
  items: [
    {
      name: "Department Overview",
      href: "/department/overview",
      icon: BarChart,
      permissions: ["manage_department"],
    },
    {
      name: "Faculty Management",
      href: "/department/faculty",
      icon: Users,
      permissions: ["manage_department", "view_faculty"],
      // User needs ANY of these permissions
    },
  ],
}
```

Then in your backend, assign the HOD user:
```json
{
  "user_type": "hod",
  "permissions": ["manage_department", "view_faculty", "take_attendance"]
}
```

### Example 2: Librarian

Librarian should only see library-related features.

```typescript
{
  group: "Library",
  icon: Library,
  permissions: ["library_access"],
  items: [
    {
      name: "Books",
      href: "/library/books",
      icon: BookOpen,
      permissions: ["library_access"],
    },
    {
      name: "Issue Books",
      href: "/library/issues",
      icon: Library,
      permissions: ["library_issue"], // Only if they can issue books
    },
  ],
}
```

Backend sends:
```json
{
  "user_type": "librarian",
  "permissions": ["library_access", "library_issue"]
}
```

### Example 3: Different Permissions for Same Role

Two teachers might have different permissions:

```typescript
{
  name: "Grade Management",
  href: "/grades/manage",
  icon: Award,
  permissions: ["manage_grades"], // Not all teachers have this
}
```

- **Regular Teacher**: `{ "user_type": "teacher", "permissions": [] }`
  - Can't see "Grade Management"

- **Senior Teacher**: `{ "user_type": "teacher", "permissions": ["manage_grades"] }`
  - Can see "Grade Management"

## Backend Integration

### What the Backend Should Send

When a user logs in, the backend should return:

```json
{
  "user_type": "hod",
  "permissions": [
    "manage_department",
    "view_faculty",
    "take_attendance",
    "view_reports"
  ]
}
```

The frontend will:
1. Store this in `localStorage` as `kumss_user`
2. Use `user_type` for role-based filtering
3. Use `permissions` array for permission-based filtering

### No Permissions? No Problem!

If the backend doesn't send permissions, the sidebar automatically falls back to role-based filtering using the `roles` arrays.

## Migration Strategy

### Phase 1: Current (Role-Based)
Everything works with existing `roles` arrays. No changes needed.

### Phase 2: Add Permissions (Optional)
1. Backend starts sending `permissions` array
2. You can gradually add `permissions` to sidebar items
3. Items with `permissions` will use those, others will use `roles`

### Phase 3: Full Permission-Based (Future)
1. Remove `roles` arrays from items that have `permissions`
2. Everything controlled by permissions from backend
3. Easy to create custom roles without touching frontend code

## Sidebar Config Structure

```typescript
export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    group: "Group Name",
    icon: IconComponent,
    roles: ["role1", "role2"], // Optional: role-based access
    permissions: ["perm1", "perm2"], // Optional: permission-based access
    requireAllPermissions: false, // Optional: require ALL vs ANY
    items: [
      {
        name: "Item Name",
        href: "/path",
        icon: IconComponent,
        roles: ["role1"], // Optional
        permissions: ["perm1"], // Optional
        requireAllPermissions: false, // Optional
      },
    ],
  },
];
```

## Benefits

✅ **Backward Compatible** - Existing role-based config still works
✅ **Flexible** - Mix roles and permissions as needed
✅ **Custom Roles** - Easy to add HOD, librarian, etc.
✅ **Fine-Grained Control** - Different permissions for same role
✅ **Backend-Driven** - Permissions come from backend, not hardcoded
✅ **Gradual Migration** - Can add permissions incrementally

## Common Patterns

### Pattern 1: Admins See Everything
```typescript
roles: ["super_admin", "college_admin"]
// Admins bypass permission checks via roles
```

### Pattern 2: Feature Flags
```typescript
permissions: ["beta_features"]
// Only users with beta access see this
```

### Pattern 3: Hierarchical Permissions
```typescript
{
  name: "View Reports",
  permissions: ["view_reports"],
},
{
  name: "Edit Reports",
  permissions: ["edit_reports"], // Implies view_reports
},
```

### Pattern 4: Temporary Access
Backend can give temporary permissions:
```json
{
  "permissions": ["exam_coordinator_2024"],
  "permissions_expire": "2024-12-31"
}
```

Frontend shows the item if permission exists in array.

## Summary

- **Use `roles`** for simple, hardcoded role-based access
- **Use `permissions`** for flexible, backend-driven access control
- **Use both** for maximum compatibility during migration
- **Sidebar automatically handles** both types of filtering

The sidebar will show an item if:
- User's role is in the `roles` array, OR
- User has ANY permission in the `permissions` array (or ALL if `requireAllPermissions: true`)
