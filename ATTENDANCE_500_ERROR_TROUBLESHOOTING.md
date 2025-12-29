# Bulk Attendance Marking - 500 Error Troubleshooting Guide

## Issue
When marking bulk attendance, the API returns a **500 Internal Server Error** at:
```
POST /api/v1/attendance/student-attendance/bulk_mark/
```

## Frontend Improvements (Already Applied)
✅ Enhanced error display in BulkAttendanceForm
✅ Shows detailed backend error messages
✅ Adds troubleshooting hints for common issues
✅ Logs request data to browser console
✅ Toast notifications for better UX

## Common Causes & Solutions

### 1. **Class or Section IDs Don't Exist**
**Symptom**: The error occurs when you select a class and section

**Check**:
- Open Django admin or database
- Verify that the class ID (e.g., `5`) exists in the `academic_class` table
- Verify that the section ID (e.g., `3`) exists in the `academic_section` table
- Ensure the section belongs to the selected class

**Fix**: Create the missing class or section in the admin panel

### 2. **Student IDs Don't Exist or Don't Match Class/Section**
**Symptom**: Selected students appear in the form but marking fails

**Check**:
- Verify student IDs (e.g., `[3]`) exist in the `students_student` table
- Check if students' `current_class` and `current_section` fields match the selected class/section
- Run this SQL query to verify:
  ```sql
  SELECT id, full_name, current_class, current_section
  FROM students_student
  WHERE id IN (3)
  AND current_class = 5
  AND current_section = 3;
  ```

**Fix**:
- Update student records with correct class/section assignments
- Or select students that actually belong to the chosen class/section

### 3. **Backend Validation Errors**
**Symptom**: Error message mentions specific field validation

**Check Django backend code**:
```python
# attendance/views.py or attendance/serializers.py
# Look for the bulk_mark endpoint implementation
```

**Common validation issues**:
- Missing required fields (date, status, class_obj, section, student_ids)
- Invalid date format (should be "YYYY-MM-DD")
- Invalid status value (must be: present, absent, late, excused, half_day)
- Empty student_ids array

### 4. **Database Constraints**
**Symptom**: Error related to unique constraints or foreign keys

**Check**:
- Look for duplicate attendance records (if there's a unique constraint on student+date+class+section)
- Verify foreign key relationships exist:
  - `class_obj` → `academic_class.id`
  - `section` → `academic_section.id`
  - `student_ids` → `students_student.id`

**Backend logs to check**:
```bash
# View Django server logs for detailed error
tail -f /path/to/django/logs/error.log

# Or check Django console output
```

### 5. **Permissions or Authentication**
**Symptom**: 500 error with permission-related message

**Check**:
- User has permission to mark attendance
- User is authenticated (check Authorization header in browser DevTools)
- User's role allows bulk attendance marking

## Debugging Steps

### Step 1: Check Browser Console
Open browser DevTools (F12) → Console tab:
```javascript
// You should see:
"Submitting bulk attendance: {
  class_obj: 5,
  section: 3,
  date: "2025-12-29",
  student_ids: [3],
  status: "present"
}"
```

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Find the `bulk_mark` request
3. Check the **Response** tab for detailed error
4. Look for Django error traceback

### Step 3: Check Backend Logs
```bash
# Django development server logs
python manage.py runserver

# Production logs (if using gunicorn/uwsgi)
journalctl -u gunicorn -f
```

### Step 4: Test with Django Admin or API Client
Try creating attendance directly:
```bash
curl -X POST http://127.0.0.1:8000/api/v1/attendance/student-attendance/bulk_mark/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN" \
  -d '{
    "class_obj": 5,
    "section": 3,
    "date": "2025-12-29",
    "student_ids": [3],
    "status": "present"
  }'
```

## Backend Fix Template

If the issue is in the Django backend, here's a typical fix pattern:

```python
# attendance/views.py
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

@action(detail=False, methods=['post'])
def bulk_mark(self, request):
    try:
        # Validate input
        class_obj = request.data.get('class_obj')
        section = request.data.get('section')
        student_ids = request.data.get('student_ids', [])
        date = request.data.get('date')
        attendance_status = request.data.get('status')
        remarks = request.data.get('remarks')

        # Validate required fields
        if not all([class_obj, section, student_ids, date, attendance_status]):
            return Response(
                {'detail': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify class and section exist
        try:
            class_instance = Class.objects.get(id=class_obj)
            section_instance = Section.objects.get(id=section, class_obj=class_obj)
        except (Class.DoesNotExist, Section.DoesNotExist) as e:
            return Response(
                {'detail': f'Invalid class or section: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify students belong to the class/section
        valid_students = Student.objects.filter(
            id__in=student_ids,
            current_class=class_obj,
            current_section=section
        )

        if valid_students.count() != len(student_ids):
            invalid_ids = set(student_ids) - set(valid_students.values_list('id', flat=True))
            return Response(
                {'detail': f'Invalid student IDs or students not in class/section: {invalid_ids}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create attendance records
        created_count = 0
        for student in valid_students:
            StudentAttendance.objects.update_or_create(
                student=student,
                class_obj=class_instance,
                section=section_instance,
                date=date,
                defaults={
                    'status': attendance_status,
                    'remarks': remarks,
                    'marked_by': request.user,
                }
            )
            created_count += 1

        return Response({
            'message': f'Successfully marked attendance for {created_count} students',
            'created_count': created_count
        })

    except Exception as e:
        # Log the full error
        import traceback
        print(traceback.format_exc())
        return Response(
            {'detail': f'Server error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

## Quick Fixes Checklist

- [ ] Verify class ID `5` exists in database
- [ ] Verify section ID `3` exists and belongs to class `5`
- [ ] Verify student ID `3` exists and is assigned to class `5`, section `3`
- [ ] Check if attendance record already exists for this student on this date
- [ ] Check Django server logs for detailed error
- [ ] Try with a different student/class combination
- [ ] Check database foreign key constraints
- [ ] Verify user has permission to mark attendance

## Need More Help?

1. **Share Django server logs**: Copy the full error traceback
2. **Share database query results**: Run the SQL queries mentioned above
3. **Check Django admin**: Can you manually create attendance records there?
4. **API response**: Share the full error response from Network tab

## Frontend Error Display

The improved error handling now shows:
- Specific field validation errors
- Database constraint violations
- Helpful troubleshooting hints
- Original error message from backend

Example error display:
```
Server error occurred. Please check:
- Class and section IDs are valid
- Selected students belong to the class
- Date is valid

Original error: Invalid pk "5" - object does not exist.
```

This tells you exactly what to check in the database!
