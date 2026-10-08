# IoT Lab Centre of Excellence (CoE) & Expothon 2026 Platform
**Saveetha School of Engineering, SIMATS (Department of ECE)**

A production-ready website with a full administrative CMS and participant registration engine built for the **IoT Lab Centre of Excellence (CoE)** and its national-level project exhibition, **Expothon 2026**.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components & Actions)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Custom CSS Variable Design Token Layer (Light/Dark Themes, Circuit/Blueprint visuals)
- **Database**: MongoDB Atlas with Mongoose (Cached connection pool for Vercel Serverless)
- **Validation**: Zod (Client and Server)
- **Authentication**: Stateless cryptographic JWT in `httpOnly`, `SameSite=Strict`, `Secure` cookies with RBAC (`SUPER_ADMIN`, `EDITOR`, `REGISTRATION_MANAGER`)
- **Asset Storage**: In-memory / Cloud Object Storage Adapter (Cloudinary / Vercel Blob compatible)
- **Rate Limiting**: Sliding window rate limiter + Honeypot anti-bot shield
- **SEO & Performance**: Dynamic `sitemap.xml`, `robots.txt`, OpenGraph metadata, and JSON-LD structured Event schema

---

## 📂 Project Structure

```
├── scripts/
│   └── seed.ts                 # Database seeding script (Honest institutional defaults)
├── src/
│   ├── app/
│   │   ├── (public pages)
│   │   │   ├── page.tsx        # Dynamic Home Page
│   │   │   ├── about/          # About CoE, Mission & Facilities
│   │   │   ├── expothon/       # Expothon Rules, Guidelines, Tracks, Rubrics
│   │   │   ├── register/       # 7-Step Registration Wizard with autosave
│   │   │   ├── registration-status/ # Public Status & Remarks Lookup
│   │   │   ├── updates/        # Bulletins & Announcements
│   │   │   ├── gallery/        # Photo Archive
│   │   │   ├── showcase/       # Post-Event Project Showcase
│   │   │   └── contact/        # Inquiry & Venue Map
│   │   ├── admin/
│   │   │   ├── login/          # Secure Admin Login with Honeypot
│   │   │   ├── dashboard/      # Live registration counts & metrics
│   │   │   ├── registrations/  # Search, filter, export XLSX/CSV, evaluation
│   │   │   ├── pages/          # Block-based CMS Editor & Revisions
│   │   │   ├── media/          # Media Library & Document Manager
│   │   │   ├── messages/       # Inquiries Inbox
│   │   │   ├── settings/       # Global institutional parameters
│   │   │   ├── users/          # Staff RBAC account management
│   │   │   └── audit/          # Activity & security trail
│   │   ├── api/                # Secure serverless API endpoints
│   │   ├── globals.css         # Institutional theme tokens & circuit grid
│   │   └── layout.tsx          # Master shell with ThemeProvider, Navbar, Banner, Footer
│   ├── components/
│   │   ├── cms/                # Typed section renderers (Hero, Tracks, Timeline, etc.)
│   │   ├── layout/             # Navbar, Footer, AnnouncementBanner
│   │   └── ui/                 # Badge, Button, CircuitBackground, ThemeToggle
│   ├── lib/
│   │   ├── auth/               # JWT sign/verify & bcrypt password hashing
│   │   ├── cms/                # Block registry & default page configs
│   │   ├── db/                 # MongoDB cached connection handler
│   │   ├── services/           # Settings, Page, Audit, Auth services
│   │   └── validations/        # Strict Zod schemas
│   ├── models/                 # Mongoose Data Models
│   └── middleware.ts           # Route protection, RBAC & Security headers
```

---

## 🛠️ Getting Started (Local Development)

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory (refer to `.env.example`):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/simats_iot_coe?retryWrites=true&w=majority
JWT_SECRET=super-secure-random-jwt-secret-key-at-least-32-chars-long
ADMIN_INITIAL_EMAIL=admin@saveetha.simats.edu
ADMIN_INITIAL_PASSWORD=SaveethaIoTCoE2026!
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Seed the Database
Populate initial institutional metadata, Super Admin credentials, and CMS page structures:
```bash
npm run seed
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public site.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin CMS Portal.

---

## 📋 Administrator & Staff Roles (RBAC)

1. **SUPER_ADMIN**: Full system control. Can edit global institutional settings (deadlines, capacity, event dates), manage staff accounts (`/admin/users`), view audit logs, modify CMS blocks, and evaluate registrations.
2. **EDITOR**: Content management. Can edit, reorder, create, and publish CMS blocks and upload assets to the Media Library.
3. **REGISTRATION_MANAGER**: Applicant management. Can filter registrations, evaluate abstracts, update application statuses (Submitted, Under Review, Shortlisted, Confirmed, Waitlisted, Rejected), add internal notes, and export rosters to Excel/CSV.

---

## ☁️ Deployment to Vercel

1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. In **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A strong 32+ character random string.
   - `ADMIN_INITIAL_EMAIL`: e.g. `admin@saveetha.simats.edu`.
   - `ADMIN_INITIAL_PASSWORD`: A secure initial password.
   - `NEXT_PUBLIC_APP_URL`: Your Vercel production domain (e.g. `https://iotcoe-expothon.saveetha.com`).
4. **MongoDB Atlas Network Access**:
   - In MongoDB Atlas, go to **Network Access** > **IP Access List**.
   - Add `0.0.0.0/0` (Allow access from anywhere) so Vercel's dynamic serverless IP range can connect to your database.
5. Click **Deploy**. Vercel will build and launch your application globally.

---

## 📑 Content Supply & Configuration Checklist

Everything on this website is editable from the Admin CMS (`/admin`). Prior to launching to participants, verify and supply the following items in the admin portal:

- [ ] **Official Logo & Favicon**: Upload official SSE SIMATS and IoT CoE logos in `/admin/media`.
- [ ] **Dates & Deadlines**: Set exact abstract submission deadline and event exhibition dates in `/admin/settings`.
- [ ] **Venue & Capacity**: Confirm the exact lab room number and set maximum team capacity in `/admin/settings`.
- [ ] **Faculty Coordinators**: Update faculty names, designations, and contact emails in `/admin/pages/about`.
- [ ] **Brochure & Rulebook**: Upload official PDF circulars and rulebooks in `/admin/media` and link them in `/admin/pages/expothon`.
- [ ] **Announcement Banner**: Customize or enable the header announcement message in `/admin/settings`.
