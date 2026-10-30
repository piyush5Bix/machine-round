# Machine Round

A small monorepo: **Express + SQLite** API and a **Vite + React** SPA for managing posts.
You have **50 minutes** to debug it, extend it, stress it, speed it up, and explain what you learned.
You will not finish everything. Prioritise, and say out loud what you are choosing to skip and why.

## Stack

| Workspace | Tech | Port |
|---|---|---|
| `server/` | Node 20+, Express 4, better-sqlite3 | 3001 |
| `client/` | Vite 5, React 18 | 5173 (proxies `/api` → 3001) |

## Setup

```bash
npm install
npm run seed        # 25 posts
npm run seed:big    # 100,000 posts (Subjects 3 and 4)
npm run dev         # starts API + SPA together
```

Open http://localhost:5173.

## API

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Liveness check |
| GET | `/api/posts?page=1&limit=20&q=term` | List posts (paginated, optional search) |
| GET | `/api/posts/:id` | Get one post |
| POST | `/api/posts` | Create a post (`title` required; `body`, `author` optional) |
| PUT | `/api/posts/:id` | Update a post |
| PATCH | `/api/posts/:id/like` | Increment the like counter |
| DELETE | `/api/posts/:id` | Delete a post |

List response shape: `{ data: Post[], page, limit, total }`.

## Format

| # | Subject | Backend | Frontend | Minutes |
|---|---|---|---|---|
| 1 | Debugging | 7 | 7 | 14 |
| 2 | Adding a New Feature | 6 | 6 | 12 |
| 3 | Load and Stress Testing | 4 | 4 | 8 |
| 4 | Optimisation (based on #3) | 4 | 4 | 8 |
| 5 | What you learned (spoken) | | | 5 |
| | Buffer / setup | | | 3 |

The clock is a guide, not a gate. Move on when your time is up.

## Rules

- **Your screen is shared and recorded for the whole round.** Narrate your thinking out loud as you work. The interviewer will ask you to explain or modify anything you have written, on the spot.
- Allowed: official docs (MDN, Express, React, SQLite, Vite), man pages, your own notes, browser devtools.
- **Using AI is forbidden** (see the disclaimer at the bottom).
- Make focused changes. Do not rewrite the project.
- Keep a running log in `NOTES.md`: what you saw, what you changed, one line of why.

---

## Challenges

### Subject 1: Debugging (14 min)

The app runs, but it does not behave correctly. Find root causes, not symptoms.

- **Backend (7 min).** Exercise the routes with `curl` and compare them to the API table. Fix as many defects as you can. For each one note the request that exposed it, expected vs actual, and the root cause.
- **Frontend (7 min).** Use the SPA as a user would: create, edit, like, delete, and filter, in different orders. Fix as many defects as you can. For each one note the repro steps and the root cause.

### Subject 2: Adding a New Feature (12 min)

Add **Comments**.

- **Backend (6 min).** Add a `comments` table (`id`, `post_id`, `author`, `body`, `created_at`) with a foreign key to `posts`. Add `GET /api/posts/:id/comments` and `POST /api/posts/:id/comments`. Validate input, return correct status codes (404 for a missing post), and include `comment_count` on posts returned by the list route.
- **Frontend (6 min).** Show the comment count on each post, and let the user expand a post to see its comments and add one. The count must update without a reload.

### Subject 3: Load and Stress Testing (8 min)

Measure before you optimise. Run `npm run seed:big` first, then use `npm run loadtest -- "/api/posts?limit=50" 50 10` or any tool you like.

- **Backend (4 min).** Load test the list route (with and without `q`) and get-by-id. Record req/s, p99 latency, and errors. Say which route is worst and show **why** (for example `EXPLAIN QUERY PLAN`, response size, or a profile).
- **Frontend (4 min).** With the large dataset, measure the SPA using the browser Performance panel or React Profiler: initial payload, list render time, and typing lag in the filter box. Name the top two bottlenecks.

### Subject 4: Optimisation (8 min)

Fix what you measured in Subject 3. Every change needs a before and after number from the same test.

- **Backend (4 min).** Optimise the worst route without changing the API contract.
- **Frontend (4 min).** Optimise the worst bottleneck without changing behaviour.

### Subject 5: What You Learned (5 min, spoken)

No document. In your own words, with the interviewer, explain:

- Which bug taught you the most, what mistake it represents, and how you found it.
- Why your numbers in Subject 3 looked the way they did, and which optimisation mattered most.
- What you skipped, what you would do next, and what you would change if the table had 10 million rows.

The interviewer will pick lines from your diff and ask you to justify them.

---

## Disclaimer

> **Using AI is strictly forbidden during this round.**
> This includes chatbots, AI code assistants, AI autocomplete, AI-powered search summaries, and any tool that generates code or answers on your behalf. You may use official documentation, man pages, and your own notes. The session is screen-recorded and reviewed. Violations will result in disqualification.
