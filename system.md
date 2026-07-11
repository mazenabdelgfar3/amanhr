# AMAN Workforce Management System - UX Flows & User Journeys

This document outlines the step-by-step user journeys and UX flows for all core features of the system.

---

## 1. Login Flow
```
Open System
      │
      ▼
    Login
      │
      ▼
  Dashboard
```

---

## 2. Dashboard Flow
```
Dashboard
│
├── Employees
├── Daily Work
├── Attendance
├── Payroll
├── Assets
├── Reports
└── Settings
```

---

## 3. Employee Flow
* **Viewing and Editing:**
  ```
  Employees ──> Employee List ──> View Employee ──> Edit Employee ──> Save
  ```
* **Adding New Employee:**
  ```
  Employees ──> Add Employee ──> Fill Information ──> Save ──> Employee Added Successfully
  ```

---

## 4. Daily Work Flow (أهم رحلة - Core Journey)
```
Dashboard
   │
   ▼
Daily Work
   │
   ▼
Select Date
   │
   ▼
Select Project (Optional)
   │
   ▼
Employee Table
   │
   ▼
Enter Attendance ──> Enter Production ──> Enter Overtime ──> Write Notes
   │
   ▼
 Save ──> Success Message ──> Dashboard Updated
```

---

## 5. Salary Flow
```
Dashboard
   │
   ▼
Payroll
   │
   ▼
Select Month
   │
   ▼
System Calculates Salaries
   │
   ▼
Review ──> Print Payslip ──> Mark As Paid
```

---

## 6. Advances Flow
```
Employee ──> Advances ──> Add Advance ──> Enter Amount ──> Save ──> Employee Balance Updated
```

---

## 7. Deductions Flow
```
Employee ──> Deductions ──> Add Deduction ──> Reason ──> Amount ──> Save ──> Payroll Updated
```

---

## 8. Bonuses Flow
```
Employee ──> Bonuses ──> Add Bonus ──> Save
```

---

## 9. Assets Flow
* **Assignment (التسليم):**
  ```
  Assets ──> Asset List ──> Assign Asset ──> Select Employee ──> Save
  ```
* **Return (الاسترجاع):**
  ```
  Asset ──> Return ──> Check Condition
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
         Normal                            Damaged
            │                                 │
          Close                               ▼
                                       Create Deduction
  ```

---

## 10. Reports Flow
```
Reports ──> Choose Report ──> Select Date Range ──> Filter ──> View Report ──> Export PDF / Excel
```

---

## 11. Settings Flow
```
Settings ──> Company Info ──> Production Settings ──> Salary Settings ──> Users ──> Save
```

---

# User Journey (الرحلة اليومية للمستخدم)
```
Login
  │
  ▼
Dashboard
  │
  ▼
Daily Work
  │
  ├── تسجيل حضور العمال (Log Attendance)
  ├── إدخال الإنتاج (Enter Production)
  └── حفظ اليومية (Save Daily Sheet)
  │
  ▼
إضافة أي سلف أو خصومات - إذا وجدت (Add Advances/Deductions)
  │
  ▼
مراجعة لوحة التحكم (Review Dashboard KPIs)
  │
  ▼
Logout
```
