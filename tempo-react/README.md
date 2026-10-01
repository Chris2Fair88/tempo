# Tempo (React) — MCP demo

A mock scheduling app for an in-home music-teaching business. This branch's
purpose is to demo **MCP (Model Context Protocol)** concepts using Tempo's UI
as a visual wrapper for a client pitch (in person, Zoom, or a recording) —
it is not intended to be a production app.

## MCP integration — investigation and approach

**Server:** `Tempo MCP Showcase`, deployed at
`https://tempo-mcp-showcase.chris2fair88.workers.dev/mcp`, exposing 5 tools:
`list_teachers`, `list_students`, `search_students`, `get_teacher_availability`,
`get_calendar_events`.

**Can the browser call it directly?** CORS is wide open (the server echoes
`Access-Control-Allow-Origin` for any origin). The blocker is auth: every
tool call requires a full OAuth2 Authorization Code + PKCE login (the server
exposes `/authorize`, `/token`, `/register` — a real auth server, not an API
key gate). Confirmed by hand:

```
curl -X POST https://tempo-mcp-showcase.chris2fair88.workers.dev/mcp ...
→ 401, WWW-Authenticate: Bearer ... oauth-protected-resource/mcp
```

Technically a public SPA client could complete that OAuth flow (the server
allows `token_endpoint_auth_methods_supported: "none"`, i.e. public
clients). But doing so would mean every visitor — a demo "teacher," "student,"
or "parent" — has to complete a real personal login just to see mock roster
data, which breaks this app's whole "pick a demo role and go" login model.

**Chosen approach: a refreshed data snapshot, not a live bridge.** Since this
is a pitch tool (shown in person/Zoom/recording), reliability during the demo
matters more than millisecond freshness, and a live bridge would mean
standing up and securing a separate server just to hold one OAuth token. So
instead: real data is pulled from the MCP server via an authenticated MCP
client, checked into the repo as a snapshot
(`src/data/mcpSnapshot.js`), and the mock store builds its demo dataset from
that snapshot. No network calls happen at runtime — the app stays a plain
static Vite build with no backend, deployable to GitHub Pages as before.

**To refresh the snapshot:** ask Claude (it has a live connector to this MCP
server) to re-run `list_teachers`, `search_students(status: 'Active')`,
`get_calendar_events` (per `teacher_id`), and `get_teacher_availability`,
then regenerate `src/data/mcpSnapshot.js` from the results.

## What's actually live-sourced vs. still mock

The MCP server is **read-only** — it has no write tools and no billing or
notes concepts. That limits what "live" can mean here:

| Data | Status |
|---|---|
| Teacher roster (names, subjects, zone) | ✅ From MCP snapshot (`list_teachers`) |
| Student roster (names, contact, level, instrument) | ✅ From MCP snapshot (`search_students`) |
| Weekly lesson schedule | ✅ From MCP snapshot (`get_calendar_events`), filtered to `Lesson`-category events and bucketed onto the Mon–Fri grid by day-of-week |
| Admin "Teacher Availability" card | ✅ From MCP snapshot (`get_teacher_availability`) |
| Teacher email/phone | ⚠️ Not provided by `list_teachers` — intentionally left blank ("no email/phone on file") rather than faked |
| Student → teacher assignment | ⚠️ Inferred: matched to the first teacher whose subjects include the student's instrument. The MCP data has no explicit assignment field — each student actually appears in multiple teachers' calendars in the source data |
| Payments / revenue | ❌ Mock — no billing concept exists on the MCP server. Synthetic amounts generated against real student IDs so the numbers aren't $0 |
| Practice logs, teacher notes, attendance-marking | ❌ Mock — no equivalent MCP tool. "Mark absent" / "time off" actions still work but only mutate local mock state |
| Demo login (mockAuth.js) | ❌ Unrelated — the MCP server's OAuth authenticates to *itself*, not to app end-users. Role-based demo login is separate and unchanged, though the built-in teacher accounts' names were renamed to match the real roster so logging in as a demo teacher shows a matching real profile |

## Development

```
npm install
npm run dev      # Vite dev server
npm run build     # production build
npm run deploy    # publish to GitHub Pages
```
