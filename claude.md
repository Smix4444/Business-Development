# Development Plan for InternMatch (Instructions for Claude)

## 1. Initial Setup & Context
- **GitHub Import:** Pull and import everything from the GitHub repository the user just provided in your context.
- **UI Tooling:** Leverage the "antigravity awesome tools" (Magic UI / 21st.dev / shadcn) you recently installed for the UI/UX overhaul.

## 2. Infrastructure & Backend
- **Authentication:** Implement **Clerk**. It provides free, easy-to-setup, robust authentication including registration, confirmation emails, login, and built-in rate limiting. 
- **Database Backend:** Use a free, non-Supabase alternative (e.g., **Vercel Postgres + Prisma**, **MongoDB Atlas**, or **Firebase**).
- **Cybersecurity:** Ensure secure API routes, endpoint rate limiting, and robust input sanitization. 
- **Deployment:** Structure and configure the app to be 100% Vercel-deploy ready out of the box.

## 3. UI/UX Overhaul & Aesthetic
- **Color Palette & Vibe:** Implement a neat, professional **black and white** theme. Avoid generic "AI slop" designs.
- **Motion & Interaction:** Use clean, reactive, moving components (e.g., Framer Motion). Take inspiration from the user's portfolio (`https://portfolioow-site-7dqekfsir-smix4444s-projects.vercel.app/`) but **do not copy-paste**; use it purely as style inspiration.
- **Responsiveness:** Must be fully optimized for both mobile and desktop screens.
- **Core Feature Retention:** **Crucial:** Keep the existing "drag to swipe" implementation for the vacancy swiping feature.

## 4. New Features & Content
- **Vacancies:** Seed the database with additional, realistic vacancy listings. 
- **Extra Features:** Propose and implement a few new "cool features" that would be genuinely useful for an intern-matching platform.
- **Admin Dashboard:** Create a central admin interface to monitor real-time platform activity, users, and metrics.

## 5. Workflow & Communication
- **Ask Proactively:** Important design, architecture, or feature decisions should NOT be guessed. Stop and ask the user for their opinion/clarity whenever necessary.

*Note: Be token-efficient but extremely detailed in execution. Rely on your installed UI libraries for premium, animated aesthetics.*
