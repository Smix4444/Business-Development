# InternMatch - Features

## Current Features

### 1. Student Swipe Interface
Drag-to-swipe internship cards with a Tinder-style UX. Students browse curated roles one at a time, swiping right to apply or left to pass. Includes location, type, and duration filters to narrow results.

### 2. AI Match Score
An algorithm that scores how well a student's bio and CV match each internship listing. The score is displayed as a percentage badge on each card and in the detail drawer, with color-coded labels (Strong, Good, Moderate, Low).

### 3. Application System
When swiping right, students write a personalised message explaining why they want the role. Applications are tracked with pending/accepted/rejected statuses, viewable in both grid and kanban board layouts.

### 4. School Dashboard
Schools see all linked students (matched by school_name), their application counts, statuses (active/placed/inactive), and full application history. Includes a slide-out panel with per-student detail.

### 5. Company Dashboard
Companies view all applicants to their listings with stats (total, pending, accepted, response rate). Each applicant card shows the student name, applied role, message excerpt, and current status with inline accept/reject controls.

### 6. Admin Dashboard
A password-protected admin panel with platform-wide metrics: user counts, application volumes, status breakdowns (pie chart), activity over time (line chart), top listings (bar chart), and full user/application/internship tables with action buttons.

### 7. User Authentication
Register and login for three roles: student, company, and school. Passwords are hashed with bcrypt. Session is managed client-side with context providers.

### 8. Profile & Settings
Users can update their display name, bio, profile photo (with preview), and upload a CV (PDF). The settings page is accessible from the header dropdown menu.

### 9. Tips Page
A tabbed guide for students with: example outreach messages (with why-it-works annotations), do's and don'ts cards, red flags to watch for, and a pre-send checklist with interactive checkboxes.

### 10. Pricing Page
Displays two plans (School at 2,999 EUR/year, Business at 19.99 EUR/month) with feature lists, FAQ accordion, and call-to-action buttons. Students use the platform for free.

### 11. Responsive Design
Full mobile and desktop optimization across all pages. Layouts adapt with media queries, the swipe interface works with touch, and navigation collapses appropriately on small screens.

### 12. Bookmark System
Students can save internships for later by tapping the bookmark icon on each card. Bookmarks persist in localStorage and are visually indicated with a filled icon.

---

## Features I Would Add

### 1. Direct Messaging Between Students and Companies
After a match (application accepted), both parties should be able to communicate directly within the platform. This keeps the conversation context in one place, avoids students losing track of email threads, and gives companies a structured way to schedule next steps without exchanging personal contact details prematurely.

### 2. CV Builder / Profile Auto-Fill Parser
Many students do not have a polished CV. A guided builder that walks them through sections (education, skills, experience, projects) and exports a clean PDF would lower the barrier to applying. Additionally, uploading an existing CV could auto-extract structured data to populate the profile, improving AI match accuracy immediately.

### 3. Interview Scheduler with Calendar Integration
Once a company accepts an applicant, the next friction point is scheduling an interview. Embedding a calendar picker (integrated with Google Calendar or Outlook) would let companies propose time slots and students confirm in one click, eliminating the back-and-forth email chains that often cause candidates to drop off.

### 4. Notification System (Email + In-App)
Students currently have no way of knowing when their application status changes unless they manually check. Push notifications (browser) and email alerts for key events (application viewed, accepted, rejected, new matching internship posted) would dramatically improve engagement and response times.

### 5. Company Reviews by Previous Interns
A Glassdoor-style review system where past interns can rate and describe their experience at a company. This gives prospective applicants real insight into company culture, mentorship quality, and whether the internship delivers on its promises. It also incentivises companies to provide genuinely good experiences.

### 6. Smart Recommendations Based on Swipe History
Tracking which cards a student lingers on, bookmarks, or applies to builds an implicit preference profile. Using this data (industry, location, company size, tags) to re-rank the remaining deck would surface the most relevant opportunities first, reducing time-to-match and improving overall satisfaction.

### 7. School Progress Reports (Export to PDF)
School coordinators need to report internship placement rates to their administration. A one-click export that generates a branded PDF summarising student statuses, placement rates, top companies, and timeline data would save hours of manual reporting each semester and justify the platform subscription to school leadership.
