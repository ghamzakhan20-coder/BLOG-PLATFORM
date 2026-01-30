# Frontend API Testing Guide

## Overview

This guide helps you test all frontend pages and their API integrations. Use this alongside the backend API documentation.

---

## 1. Landing Page Testing (`/`)

### Access
- **URL:** `http://localhost:3000/`
- **Method:** GET
- **Auth Required:** No

### Test Cases

#### Test 1.1: Page Loads
- [ ] Page loads without errors
- [ ] Navigation bar visible with logo
- [ ] Hero section displays correctly
- [ ] Two card options visible (User/Admin)
- [ ] All buttons are clickable

#### Test 1.2: Navigation Links
- [ ] "Sign In" button in navbar links to `/login/user`
- [ ] "Sign In" button on User card links to `/login/user`
- [ ] "Create Account" button links to `/login/user?signup=true`
- [ ] "Sign In as Admin" button links to `/login/admin`

#### Test 1.3: Responsive Design
- [ ] Layout adapts on mobile (single column)
- [ ] Layout adapts on tablet (proper spacing)
- [ ] Layout adapts on desktop (two columns)
- [ ] Text is readable on all screen sizes

#### Test 1.4: Hover Effects
- [ ] User card shows gradient border on hover
- [ ] Admin card shows gradient border on hover
- [ ] Cards scale up on hover
- [ ] Buttons change color on hover

---

## 2. User Login/Signup Testing (`/login/user`)

### Access
- **URL:** `http://localhost:3000/login/user`
- **Method:** GET
- **Auth Required:** No

### Prerequisites
- Backend running on `http://localhost:5000`
- Backend `/api/auth/register` endpoint working
- Backend `/api/auth/login` endpoint working

### Test Cases

#### Test 2.1: Page Layout
- [ ] Page loads with login form
- [ ] "BlogPlatform" logo visible
- [ ] Form fields displayed
- [ ] Back button visible and functional
- [ ] Toggle between Sign In and Sign Up works

#### Test 2.2: User Registration Flow
1. Fill form with:
   - Name: `Test User`
   - Email: `testuser@example.com`
   - Password: `Password123`
   - Confirm Password: `Password123`
2. [ ] All fields validate
3. [ ] Submit button works
4. [ ] Loading state shows "Creating Account..."
5. [ ] Redirects to `/blogs` on success
6. [ ] Token stored in localStorage
7. [ ] User data stored in localStorage

```javascript
// Verify in console
localStorage.getItem('token')       // Should return JWT token
JSON.parse(localStorage.getItem('user'))  // Should return user object
```

#### Test 2.3: User Login Flow
1. Fill form with registered credentials:
   - Email: `testuser@example.com`
   - Password: `Password123`
2. [ ] Submit button shows "Sign In"
3. [ ] Loading state shows "Processing..."
4. [ ] Redirects to `/blogs` on success
5. [ ] Token stored in localStorage
6. [ ] User data shows correct name/email

#### Test 2.4: Form Validation
- [ ] Empty email shows error
- [ ] Invalid email format shows error
- [ ] Empty password shows error
- [ ] Password < 6 characters shows error
- [ ] Mismatched confirm passwords show error
- [ ] Error messages are clear and helpful

#### Test 2.5: Remember Me
- [ ] Checkbox visible in sign-in mode
- [ ] Checkbox not visible in sign-up mode

#### Test 2.6: Google OAuth
- [ ] Google login button visible
- [ ] Clicking opens Google OAuth flow
- [ ] Redirects back to app after OAuth success
- [ ] Creates/updates user in database

#### Test 2.7: Mode Toggle
- [ ] "Sign Up" link visible in sign-in mode
- [ ] "Sign In" link visible in sign-up mode
- [ ] Clicking toggle switches form fields
- [ ] Form clears when toggling modes

#### Test 2.8: Back Button
- [ ] Back button links to `/`
- [ ] Back button text and icon visible

---

## 3. Admin Login Testing (`/login/admin`)

### Access
- **URL:** `http://localhost:3000/login/admin`
- **Method:** GET
- **Auth Required:** No

### Prerequisites
- Admin account exists with `role: 'admin'`
- Backend `/api/auth/login` endpoint working

### Test Cases

#### Test 3.1: Page Layout
- [ ] "Admin Portal" badge visible
- [ ] Security notice displayed
- [ ] Form fields visible (email, password only)
- [ ] No Google OAuth button (admin-only)
- [ ] Back button functional
- [ ] "Need Admin Access?" info box visible

#### Test 3.2: Successful Admin Login
1. Enter admin credentials:
   - Email: `admin@example.com`
   - Password: `AdminPassword123`
2. [ ] Form validates
3. [ ] Loading shows "Verifying..."
4. [ ] Redirects on success
5. [ ] Token stored in localStorage
6. [ ] User role is 'admin'

#### Test 3.3: Non-Admin User Login
1. Enter non-admin user credentials
2. [ ] Login submits successfully
3. [ ] Shows error: "Admin access only. Please contact support..."
4. [ ] Does NOT store token
5. [ ] Does NOT redirect

#### Test 3.4: Form Validation
- [ ] Empty email shows error
- [ ] Invalid email shows error
- [ ] Empty password shows error
- [ ] Wrong password shows error message

#### Test 3.5: Security Features
- [ ] "Forgot password?" link visible
- [ ] Security notice is prominent
- [ ] Form has password type input (hidden)
- [ ] Footer security warning visible

---

## 4. Blog Listing Testing (`/blogs`)

### Access
- **URL:** `http://localhost:3000/blogs`
- **Method:** GET
- **Auth Required:** Yes (Valid JWT token)

### Prerequisites
- User authenticated and token in localStorage
- Multiple blogs exist in database
- Backend `/api/blogs?page=X&limit=6` endpoint working

### Test Cases

#### Test 4.1: Authentication Check
1. Clear localStorage
2. [ ] Page redirects to `/login/user`
3. [ ] Cannot access page without token

#### Test 4.2: Page Layout
- [ ] Navigation bar visible with logo
- [ ] Page title: "Discover Amazing Stories"
- [ ] Blog grid visible
- [ ] Pagination controls visible
- [ ] User dropdown visible in navbar
- [ ] Logout button functional

#### Test 4.3: Blog Cards Display
- [ ] Blog title displayed
- [ ] Author name displayed
- [ ] Blog excerpt shown (first 3 lines)
- [ ] Like count shown
- [ ] Comment count shown
- [ ] Creation date shown
- [ ] Cards are clickable

#### Test 4.4: Admin-Only Features
**If logged in as admin:**
- [ ] "Create Blog" button visible in navbar
- [ ] Clicking redirects to `/admin/create`

**If logged in as regular user:**
- [ ] "Create Blog" button NOT visible

#### Test 4.5: Pagination
- [ ] Shows correct page number
- [ ] Previous button disabled on page 1
- [ ] Next button disabled on last page
- [ ] Can navigate between pages
- [ ] Page numbers clickable
- [ ] Blog list updates when changing pages

#### Test 4.6: Loading & Error States
- [ ] Spinner shows while loading
- [ ] Error message displays if API fails
- [ ] Empty state shows if no blogs
- [ ] States resolve properly

#### Test 4.7: Navigation
- [ ] Clicking blog card navigates to `/blogs/[id]`
- [ ] Logo links to `/`
- [ ] Logout button clears localStorage
- [ ] Logout redirects to `/`

#### Test 4.8: Responsive Design
- [ ] Single column on mobile
- [ ] Two columns on tablet
- [ ] Three columns on desktop

---

## 5. Single Blog View Testing (`/blogs/[id]`)

### Access
- **URL:** `http://localhost:3000/blogs/[id]` (where [id] is blog ID)
- **Method:** GET
- **Auth Required:** Yes (Valid JWT token)

### Prerequisites
- Blog with comments exists
- User authenticated

### Test Cases

#### Test 5.1: Authentication
- [ ] Page requires valid token
- [ ] Redirects to login if unauthenticated

#### Test 5.2: Blog Content Display
- [ ] Blog title displayed
- [ ] Full blog content shown
- [ ] Author name and avatar shown
- [ ] Publication date shown in proper format
- [ ] View count displayed

#### Test 5.3: Like Functionality
1. [ ] Like button visible
2. [ ] Click like button
   - [ ] Button color changes
   - [ ] Heart icon filled
   - [ ] Like count increments
3. [ ] Click unlike button
   - [ ] Button color reverts
   - [ ] Heart icon unfilled
   - [ ] Like count decrements
4. [ ] Like count updates immediately

#### Test 5.4: Comment Section
- [ ] Comment form visible
- [ ] Existing comments displayed
- [ ] Comment count shows

#### Test 5.5: Submit Comment
1. Fill comment form with text
2. [ ] Character limit validation
3. [ ] Submit button shows "Post Comment"
4. [ ] Loading shows "Posting..."
5. [ ] Comment appears immediately
6. [ ] Author info displayed with comment
7. [ ] Timestamp shown correctly

#### Test 5.6: Edit Button (Admin/Author Only)
**If user is blog author:**
- [ ] "Edit" button visible
- [ ] Clicking redirects to `/admin/edit/[id]`

**If user is not author:**
- [ ] "Edit" button NOT visible

#### Test 5.7: Navigation
- [ ] Back button links to `/blogs`
- [ ] Logo links to home
- [ ] Blog title clickable (optional)

#### Test 5.8: Stats Display
- [ ] Like count accurate
- [ ] Comment count accurate
- [ ] View count displayed
- [ ] All stats update correctly

---

## 6. Create Blog Testing (`/admin/create`)

### Access
- **URL:** `http://localhost:3000/admin/create`
- **Method:** GET
- **Auth Required:** Yes (Admin role required)

### Prerequisites
- Logged in as admin user
- Backend `/api/blogs` POST endpoint working

### Test Cases

#### Test 6.1: Access Control
- [ ] Page accessible if user is admin
- [ ] Redirects to `/blogs` if user is not admin
- [ ] Redirects to login if not authenticated

#### Test 6.2: Form Layout
- [ ] Title input field visible
- [ ] Content textarea visible
- [ ] Character count shown
- [ ] Guidelines section visible
- [ ] Best practices listed
- [ ] Publish button visible
- [ ] Cancel button links to `/blogs`

#### Test 6.3: Form Validation
- [ ] Title is required
- [ ] Content is required
- [ ] Empty form shows error on submit
- [ ] Character counts update in real-time

#### Test 6.4: Create Blog Flow
1. Fill form:
   - Title: "Test Blog Post"
   - Content: "This is test content..."
2. [ ] Submit form
3. [ ] Loading shows "Publishing..."
4. [ ] Request sent to POST `/api/blogs`
5. [ ] Token included in Authorization header
6. [ ] Redirects to blog view page on success
7. [ ] Blog displays in blog list

#### Test 6.5: Error Handling
- [ ] Shows error message if API fails
- [ ] Can retry after error
- [ ] Form data persists on error

#### Test 6.6: Cancel Button
- [ ] Clicking Cancel redirects to `/blogs`
- [ ] Form data not saved

---

## 7. Edit Blog Testing (`/admin/edit/[id]`)

### Access
- **URL:** `http://localhost:3000/admin/edit/[id]`
- **Method:** GET
- **Auth Required:** Yes (Admin role required)

### Prerequisites
- Blog exists with ID
- User is admin or blog author
- Backend PUT and DELETE endpoints working

### Test Cases

#### Test 7.1: Access Control
- [ ] Page accessible if user is admin
- [ ] Redirects if user is not admin
- [ ] Redirects if not authenticated

#### Test 7.2: Form Pre-Population
- [ ] Page loads with current blog data
- [ ] Title field populated with blog title
- [ ] Content field populated with blog content
- [ ] Character counts show current values

#### Test 7.3: Update Blog Flow
1. Modify title and/or content
2. [ ] Click "Save Changes"
3. [ ] Loading shows "Saving..."
4. [ ] PUT request sent to `/api/blogs/:id`
5. [ ] Token included in Authorization header
6. [ ] Redirects to blog view on success
7. [ ] Changes visible in blog view

#### Test 7.4: Error Handling
- [ ] Shows error if update fails
- [ ] Can retry after error
- [ ] Form data persists

#### Test 7.5: Delete Functionality
1. [ ] Danger Zone section visible
2. [ ] Click "Delete Blog Post"
3. [ ] Confirmation dialog appears
4. [ ] Cancel cancels deletion
5. [ ] Confirm sends DELETE request
6. [ ] Loading shows "Deleting..."
7. [ ] Redirects to `/blogs` on success
8. [ ] Blog no longer in list

#### Test 7.6: Delete Confirmation
- [ ] Warning text displayed
- [ ] "Yes, Delete" button visible
- [ ] "Cancel" button visible
- [ ] Proper styling for danger action

#### Test 7.7: Navigation
- [ ] Back button links to blog view
- [ ] Logo links to home

---

## API Request/Response Testing

### Test with curl (Command Line)

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

#### Fetch Blogs
```bash
curl -X GET "http://localhost:5000/api/blogs?page=1&limit=6" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Test Data

### Sample User Account
```javascript
{
  name: "Test User",
  email: "testuser@example.com",
  password: "TestPassword123",
  role: "user"
}
```

### Sample Admin Account
```javascript
{
  name: "Admin User",
  email: "admin@example.com",
  password: "AdminPassword123",
  role: "admin"
}
```

---

## Common Test Scenarios

### Scenario 1: Complete User Flow
1. [x] Visit landing page
2. [x] Sign up as new user
3. [x] View blogs list
4. [x] Click on blog
5. [x] Like blog
6. [x] Add comment
7. [x] Logout

### Scenario 2: Admin Flow
1. [x] Visit landing page
2. [x] Admin login
3. [x] Create new blog
4. [x] View created blog
5. [x] Edit blog
6. [x] View in list
7. [x] Delete blog
8. [x] Verify deletion

### Scenario 3: Error Handling
1. [x] Try to access protected page without login
2. [x] Submit form with invalid data
3. [x] Network error simulation
4. [x] Verify error messages shown
5. [x] Verify recovery options available

---

## Browser DevTools Testing

### LocalStorage
```javascript
// Check token
localStorage.getItem('token')

// Check user data
JSON.parse(localStorage.getItem('user'))

// Clear data
localStorage.clear()
```

### Network Tab
- [ ] Check all API requests complete
- [ ] Verify Authorization header present
- [ ] Check response status codes (200, 201, 400, 401, etc.)
- [ ] Verify response payloads

### Console
- [ ] No JavaScript errors
- [ ] No unhandled promise rejections
- [ ] Check console logs for debugging

---

## Performance Testing

- [ ] Page load time < 2 seconds
- [ ] Form submission responds within 1 second
- [ ] Images load properly (when implemented)
- [ ] No memory leaks
- [ ] Smooth animations and transitions

---

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Tab order logical
- [ ] Form labels present
- [ ] Error messages associated with fields
- [ ] Color contrast adequate
- [ ] Touch targets > 44x44px on mobile

---

## Checklist Before Deployment

- [ ] All pages tested
- [ ] All forms validated
- [ ] All API calls working
- [ ] Authentication flows complete
- [ ] Error handling proper
- [ ] Responsive design verified
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Documentation complete

---

**Test Date:** ___________
**Tester:** ___________
**Environment:** Development/Staging/Production

