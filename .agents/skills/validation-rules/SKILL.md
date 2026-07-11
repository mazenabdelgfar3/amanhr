---
name: validation-rules
description: Defines the strict validation rules, data constraints, and business logic conditions for the system. This skill ensures data integrity across database constraints, Zod schemas, and Server Actions.
---

# Validation Rules & Business Logic Standards

This document defines the core data validation schemas, constraints, and business rules that must be enforced at both the database level (PostgreSQL) and the application level (Zod/Server Actions).

---

# Data Schemas & Field Validation

## 1. الموظفون (Employees)
- **الاسم (Name)**: 
  - Required (مطلوب)
  - String length: 3 to 100 characters (من 3 إلى 100 حرف)
- **رقم الهاتف (Phone Number)**: 
  - Required (مطلوب)
  - Must be a valid phone format (رقم صحيح)
  - Unique constraint (غير مكرر)
- **الرقم القومي (National ID)**: 
  - Required (مطلوب)
  - Exact 14 digits (14 رقم)
  - Unique constraint (غير مكرر)
- **الراتب الأساسي (Salary)**: 
  - Required (مطلوب)
  - Decimal, must be >= 0 (أكبر من أو يساوي صفر)
- **تاريخ التعيين (Hiring Date)**: 
  - Required (مطلوب)
  - Cannot be in the future (لا يمكن أن يكون في المستقبل)
- **الحالة (Status)**:
  - Allowed values only: `Active`, `Vacation`, `Suspended`, `Resigned`

## 2. العمل اليومي (Daily Work)
- **التاريخ (Date)**: 
  - Required (مطلوب)
  - Cannot be in the future (لا يمكن إدخال تاريخ مستقبلي)
- **الموظف (Employee)**: 
  - Required (مطلوب)
  - Must exist in the database (يجب أن يكون موجودًا)
  - Employee status must be `Active` (يجب أن تكون حالته نشطة)
- **الحضور (Attendance)**: 
  - Allowed values only: `Present`, `Absent`, `Vacation`, `Permission`
- **الإنتاج (Production)**: 
  - Required (مطلوب)
  - Positive number, min value: 0 (رقم موجب، الحد الأدنى 0، لا يقبل قيمة سالبة)
- **ساعات الإضافي (Overtime Hours)**: 
  - Optional (اختياري)
  - Range: 0 to 24 (من 0 إلى 24)
- **الملاحظات (Notes)**: 
  - Optional (اختياري)
  - Maximum 500 characters (حتى 500 حرف)

## 3. الرواتب (Salary)
- **الشهر (Month)**: 
  - Required (مطلوب)
  - Must not repeat for the same employee in the same month (لا يتكرر لنفس الموظف في نفس الشهر)
- **المرتب الأساسي (Base Salary)**: 
  - Must be > 0 (أكبر من صفر)
- **صافي المرتب (Net Salary)**: 
  - Calculated automatically (يحسب تلقائيًا)
  - Manual editing is strictly prohibited (لا يسمح بالتعديل اليدوي)

## 4. السلف (Advances)
- **الموظف (Employee)**: 
  - Required (مطلوب)
- **المبلغ (Amount)**: 
  - Must be > 0 (أكبر من صفر)
- **السبب (Reason)**: 
  - Required (مطلوب)
- **التاريخ (Date)**: 
  - Required (مطلوب)

## 5. الخصومات (Deductions)
- **الموظف (Employee)**: 
  - Required (مطلوب)
- **القيمة (Value)**: 
  - Must be > 0 (أكبر من صفر)
- **السبب (Reason)**: 
  - Required (مطلوب)

## 6. المكافآت (Bonuses)
- **القيمة (Value)**: 
  - Must be > 0 (أكبر من صفر)
- **السبب (Reason)**: 
  - Required (مطلوب)

## 7. العهد والمعدات (Assets)
- **اسم المعدة (Asset Name)**: 
  - Required (مطلوب)
- **الرقم التسلسلي (Serial Number)**: 
  - Required (مطلوب)
  - Unique constraint (غير مكرر)
- **الحالة (Status)**:
  - Allowed values: `Available`, `Assigned`, `Maintenance`, `Damaged`, `Lost`
- **حكم التسليم (Assignment Rule)**:
  - Cannot assign/hand over an asset if its status is `Assigned` (لا يمكن تسليم المعدة إذا كانت Assigned)

## 8. تسجيل الدخول (Login)
- **البريد الإلكتروني (Email)**: 
  - Required (مطلوب)
  - Must be a valid email format
- **كلمة المرور (Password)**: 
  - Required (مطلوب)
  - Minimum 8 characters (8 أحرف على الأقل)

## 9. التقارير (Reports)
- **النطاق الزمني (Date Range)**:
  - Date From (من تاريخ) is required
  - Date To (إلى تاريخ) is required
  - "Date From" must be less than "Date To" (تاريخ البدء يجب أن يكون أقل من تاريخ النهاية)

---

# Business Rules (قواعد العمل الصارمة)

1. **الرقم القومي الفريد**: يمنع منعاً باتاً إضافة موظف بنفس الرقم القومي لموظف آخر.
2. **رقم الهاتف الفريد**: يمنع منعاً باتاً إضافة رقم هاتف مكرر في النظام.
3. **منع الإنتاج للمستقيلين**: لا يمكن إضافة أي سجل إنتاج أو يومية عمل لموظف حالته `Resigned`.
4. **منع تكرار صرف الراتب**: لا يمكن صرف أو احتساب راتب الموظف أكثر من مرة واحدة في نفس الشهر.
5. **القيم الموجبة للسلف**: يمنع منعاً باتاً إدخال أي سلفة بقيمة سالبة أو صفرية.
6. **الحد الأقصى للخصم**: لا يمكن إضافة خصم يتجاوز الحد الأقصى المسموح به في إعدادات النظام (مثال: ألا يتجاوز الخصم نسبة معينة من الراتب الأساسي).
7. **الحذف الآمن للموظفين (Soft Delete)**: 
   - يمنع حذف أي موظف لديه سجلات أو بيانات مرتبطة في النظام (حضور، رواتب، سلف، إلخ).
   - يتم تغيير حالته في النظام إلى **مؤرشف (Archived)** بدلاً من الحذف الفعلي للحفاظ على سلامة البيانات التاريخية.
8. **تفرد حيازة العهد**: لا يمكن تسليم أو تعيين نفس العهدة (Asset) لأكثر من موظف واحد في نفس الوقت.
9. **التعامل مع العهد التالفة**: عند استلام العهدة وتحديد حالتها كـ `Damaged` (تالفة)، يقوم النظام تلقائياً بإنشاء خصم مقترح على الموظف المسؤول (لا يعتمد الخصم إلا بعد مراجعة واعتماد المسؤول/المشرف).
10. **تحديث الحسابات التلقائي لليومية**: عند حفظ أو تعديل يومية العمل (Daily Work)، يقوم النظام تلقائياً وبشكل فوري بـ:
    - تحديث سجلات الحضور والغياب للموظف.
    - تحديث كميات الإنتاج المسجلة.
    - تحديث إجمالي الشهر ومقارنته بالمرتب المتوقع.
