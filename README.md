# Job Tracker

Job Tracker is a personal job-search manager. Instead of tracking applications in a
spreadsheet, it gives you one place to record every application, see where each one
stands, follow up on time, and keep the people, documents, and history tied to each
opportunity in one spot.

It's a full-stack app: an ASP.NET Core 8 Web API (`Job-Tracker.Server`) backed by
SQL Server, and a React + Vite + Tailwind CSS client (`job-tracker.client`).

## Features

- **Authentication** — register/log in; your data is private and scoped to your account (JWT-based).
- **Applications** — track company, job title, posting URL, location, salary range, notes, and the
  current stage of each application.
- **Stages** — every application moves through: `Saved → Applied → PhoneScreen → Interviewing →
  OfferReceived`, or ends at `Rejected`, `Withdrawn`, `Accepted`.
- **Stage board** — a drag-free, column-per-stage view of all your applications so you can see your
  whole pipeline at a glance and move applications between stages.
- **Timeline** — a dated log per application (`Note`, `StageChange`, `Interview`, `Email`,
  `PhoneCall`, `Other`) so you can look back at exactly what happened and when.
- **Tasks** — to-dos tied to an application (e.g. "follow up Friday", "prep for interview"), with
  a due date and a dedicated "upcoming" view across every application (next 7/14/30 days).
- **Contacts** — recruiters and hiring managers per application, with role, email, phone, and
  LinkedIn link.
- **Documents** — attach files (resumes, cover letters, offer letters) to an application.
- **Dashboard** — an overview of total/active applications, offers, rejections, a breakdown by
  stage, and how many tasks are coming up.
- **CSV export** — download all your applications as a CSV file.

## Tech stack

| Layer    | Technology |
|----------|------------|
| Backend  | ASP.NET Core 8 Web API, Entity Framework Core, SQL Server, JWT auth |
| Frontend | React 19, Vite, TypeScript/JSX, Tailwind CSS 4, React Router, Axios |

## Getting started

### Prerequisites
- .NET 8 SDK
- Node.js (18+) and npm
- SQL Server (or SQL Server Express/LocalDB)

### 1. Configure the database
Update the connection string in `Job-Tracker.Server/appsettings.json` (and
`appsettings.Development.json`) to point at your SQL Server instance, then apply
migrations from the `Job-Tracker.Server` folder:

```bash
dotnet ef database update
```

### 2. Configure the JWT secret
In `appsettings.json`, replace `Jwt:Key` with your own long random secret (32+ characters).

### 3. Run the app

**Option A — Visual Studio:** open `Job-Tracker.sln` and press F5. The server starts and
launches the Vite dev server for you (via the SPA proxy).

**Option B — command line**, in two terminals:

```bash
# Terminal 1 — API
cd Job-Tracker.Server
dotnet run

# Terminal 2 — client
cd job-tracker.client
npm install
npm run dev
```

The API serves Swagger docs at `/swagger` in development. The client runs on its Vite dev
server URL and talks to the API over HTTPS.

## How to use it

1. **Register / log in** on the login page.
2. **Add an application** from the Applications page — company, title, posting link, location,
   salary range, and notes.
3. **Track it as it moves** — update its stage as you progress (Applied → PhoneScreen →
   Interviewing → …), either from the application detail page or by changing its stage on the
   Stage board.
4. **Log what happens** — add a Timeline entry after every call, email, or interview so you have
   a record to refer back to later.
5. **Add tasks** for anything you need to do next (follow up, prep, send a document), and check
   the Tasks page regularly for what's due soon.
6. **Add contacts** you're speaking with at each company so you don't lose track of names and
   emails.
7. **Attach documents** — keep the resume/cover letter version you sent for each application.
8. **Check the Dashboard** periodically to see your overall pipeline health — how many
   applications are active, how many offers/rejections you have, and what's upcoming.
9. **Export to CSV** any time you want your data outside the app (backup, spreadsheet analysis,
   sharing).

## Project structure

```
Job-Tracker.Server/     ASP.NET Core Web API
  Controllers/           REST endpoints (Auth, Applications, Timeline, Tasks, Contacts, Documents, Dashboard, Export)
  Models/                EF Core entities
  DTOs/                   Request/response shapes
  DAL/                    Repositories and DbContext
  Services/               Business logic (auth/JWT, dashboard stats, application rules)

job-tracker.client/      React frontend
  src/pages/              Route-level pages (Dashboard, Stage board, Applications, Tasks, Contacts)
  src/components/         Reusable UI pieces (Stage board/column, Timeline, forms, cards)
  src/store/              React context stores (auth, applications, tasks)
  src/api/                Axios calls to the backend
```
