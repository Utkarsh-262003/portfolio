# Portfolio: utkarshtyagi.in

Personal portfolio for Utkarsh Tyagi (goes by Ani), a junior DevOps engineer looking for DevOps / cloud roles, in India and remote. It lives on the apex domain `utkarshtyagi.in`.

## Who looks at this site

- Recruiters and hiring managers who clicked the link on a resume or LinkedIn. They spend under a minute.
- Engineers doing a technical screen, who will open the case study and the GitHub repo.

The site has one job: in the first screen, show that he builds and runs real infrastructure, and get the visitor to the BattleRoom case study, the live app, and GitHub.

## Design

- **Use the grain skill in `.claude/skills/grain/` for all design work.** This is a page-shaped brief, so follow its Page flow.
- Motion and video are wanted, but they serve the content. Short, muted, looping screen recordings of the real system are the centerpiece, not decoration.
- It must feel fast. A DevOps engineer's site that loads slowly undercuts the whole pitch.

## Technical constraints

- **Static output only.** The site is deployed as static files to Azure Static Web Apps (Free plan). No server-side rendering, no API routes, no server functions, no runtime environment variables.
- Framework: Astro (static-first, ships little JS by default). Use a small animation library only if CSS alone can't do the effect.
- Build command must produce a plain folder of files (`dist/`).
- Video: H.264 MP4 (plus WebM if it saves size), `muted`, `loop`, `playsinline`, a poster image, lazy-loaded below the fold. Keep each clip under ~3 MB. Respect `prefers-reduced-motion`: show the poster instead of autoplaying.
- Images: modern formats, explicit width/height, lazy-loaded below the fold.
- Targets: Lighthouse 90+ on performance and accessibility on mobile; no horizontal scroll from 320px up; keyboard navigable with visible focus states.
- Do not create or edit anything in an `infra/` folder or `.github/workflows/`. Ani builds hosting and CI/CD himself.

## Honest content rules

- Use only the facts in this file and in the assets he provides. **Never invent numbers, testimonials, logos, client names, certifications or years of experience.**
- If a section needs something that isn't here, leave a clearly marked placeholder and tell him.
- No phone number on the public site.

## Facts

**Name:** Utkarsh Tyagi. On the site use exactly "Utkarsh Tyagi", no nickname, so it matches his resume and LinkedIn.
**Title:** DevOps Engineer
**Location:** Ghaziabad, India. Open to remote. Works night shifts, so he already overlaps with US business hours. On the site the line is just "Ghaziabad, India · open to remote · overlaps US hours" (no night-shift mention).
**Email:** utkarshtyagi9050@gmail.com
**GitHub:** https://github.com/Utkarsh-262003
**LinkedIn:** https://linkedin.com/in/utkarsh-tyagi26
**Resume PDF:** `public/resume.pdf` (he will add it)

### Skills

- Cloud & IaC: AWS (EC2, VPC, IAM, Security Groups, Elastic IP), Terraform, Ansible
- Containers & CI/CD: Docker, Docker Compose, GitHub Actions, Jenkins
- Monitoring: Prometheus, Grafana, Alertmanager, node_exporter
- Web & networking: Linux, Nginx, DNS, HTTP/HTTPS, TLS (Let's Encrypt, certbot), WebSockets
- Languages & data: Bash, JavaScript (Node.js, Express), SQL, C++, MongoDB, MySQL
- Currently learning: Kubernetes, ELK Stack

### Main project: BattleRoom

A real-time multiplayer quiz-battle app, live at https://battleroom.utkarshtyagi.in
Repo: https://github.com/Utkarsh-262003/battleroom

What he built:
- AWS environment in Terraform (23 resources): custom VPC, public subnet, internet gateway, routing, two EC2 instances with Elastic IPs, one for the app and one for monitoring.
- Security (network): metrics ports (9100 node_exporter, 9101 app metrics) reachable only from the monitoring server via security-group references; IMDSv2 enforced on all instances.
- Ansible, two roles: `base` (Docker, Compose, certbot, node_exporter, disk growth, 1 GB swap) and `certbot` (first certificate + renewal hook). Handlers restart services only when their config actually changed. Rebuilding the app instance from scratch and running the playbook brings it back with a new certificate, no hand steps.
- Nginx as a WebSocket reverse proxy with Let's Encrypt TLS; certificate renewal hooks reload Nginx without dropping live game connections.
- The app itself: Node.js, Express, Socket.IO, MongoDB, JWT auth, rate limiting, Gemini-generated questions.

**Pipeline** (GitHub Actions, 5 jobs, runs on every push to main):
1. test: ESLint, then 26 automated tests against the real app (~20 seconds).
2. infra-lint: ansible-lint (production profile), terraform fmt, terraform validate.
3. docker: build the image, stamp the commit SHA inside it, push `:SHA` and `:latest`, layer cache.
4. deploy: check the image exists, pinned Ansible version, playbook deploys the exact SHA (never `:latest`).
5. smoke tests: live `/healthz` must return ok AND report the new SHA; Grafana, Prometheus and Alertmanager must answer.

Pipeline safety: one deploy at a time; rollback by entering an old SHA in "Run workflow" (skips tests/build, deploys the old image); tests and lint also run on pull requests, but nothing deploys from them; all versions pinned.

Separate uptime check: a second workflow runs every 15 minutes from GitHub, outside AWS, checks the game, Grafana, Prometheus and Alertmanager, and posts to Discord only when something breaks or recovers. It catches the case where the monitoring server itself dies.

**Tests:**
- The real `app.js` runs as its own process; only the database (throwaway in-memory MongoDB) and Gemini (a fake that can be made slow or broken) are swapped.
- Covers: malformed socket messages can't crash the server, floods get cut off, forged/unsigned tokens refused, outsiders can't join rooms, a full two-player game with scoring, reconnect mid-game, Gemini busy (retried) and down (players told), auth rules and rate limits.
- Proof the tests work: the crash fix was removed on purpose and all 8 safety tests failed; with the fix back, all pass.

**Monitoring:**
- The monitoring box runs Prometheus, Grafana, Alertmanager, blackbox exporter and nginx. Prometheus and Grafana listen only on 127.0.0.1; nginx is the one public door. Dashboards and data source are provisioned from files.
- Measured: node_exporter on both servers; app metrics on port 9101 (requests by route and status, response time, live players, active rooms, event loop lag, Gemini successes/failures): the four golden signals.
- Blackbox exporter checks each public URL from outside over HTTPS, plus certificate expiry. It catches what the app can't see about itself (e.g. MongoDB down makes `/healthz` return 503).
- 8 alert rules: TargetDown, EndpointDown, HighErrorRate, SlowResponses, QuestionGenerationFailing, CertificateExpiringSoon, DiskAlmostFull, MemoryAlmostFull. Sent to Discord via Alertmanager.

**Security (app level):**
- Every socket message is validated; a wrapper catches errors so one bad message can't crash the server.
- Rate limits: 50 socket messages per 10 seconds per connection, 16 KB max message; 100 web requests per 15 minutes per IP; 10 failed logins per 15 minutes per IP (successful logins don't count).
- Same bcrypt work for unknown email and wrong password, so timing doesn't reveal which emails exist.
- JWT HS256 only, unsigned tokens refused; NoSQL injection blocked by checking inputs are plain strings; XSS blocked by textContent plus Helmet CSP.
- Anti-cheat: the right answer is never sent before you answer; only the first answer counts; scores computed on the server.
- Six secrets in GitHub Actions; on the servers, `.env` files are root-only.

Design decisions and trade-offs (the case study picks the 8 to 10 strongest):
- GitHub Actions over Jenkins: the code already lives on GitHub; no CI server to run and patch.
- Deploy by commit SHA, never `:latest`: every deploy is traceable and rollback is just an old SHA.
- Tests on the real app over fully mocked unit tests: only the database and Gemini are swapped, so the tests exercise the real server.
- Uptime check in GitHub Actions over a service like UptimeRobot: runs outside AWS, so it still works if the monitoring server dies.
- Pull-based monitoring (Prometheus scrapes) over apps pushing metrics.
- Monitoring on its own t3.micro: the 1 GB app server can't hold Prometheus and Grafana too, and monitoring shouldn't die with the thing it watches.
- Prometheus alert rules + Alertmanager over Grafana's built-in alerting.
- App metrics on a separate internal port (9101) instead of a public `/metrics` route.
- Two Nginx config files (HTTP first, HTTPS added after the certificate exists): a fresh server can't start Nginx with an HTTPS block that points at a certificate that doesn't exist yet.
- Certbot on the host over switching Nginx for Caddy: kept the more common setup he'll meet at work.
- Images tagged by commit SHA; old images pruned on the server because Docker Hub keeps every SHA for rollback.
- Secrets: `.env` delivered by Ansible over SSH from a GitHub secret, instead of AWS Secrets Manager. Fine for one server and one operator; Secrets Manager is the answer at larger scale.
- App: Socket.IO over plain WebSockets; JWT over server sessions; game state in memory over Redis; MongoDB Atlas over self-hosted Postgres.

Known limits (kept here for interview prep; **not shown on the site**, Ani's call: the portfolio shows strengths):
- Running games end on restart (state in memory); next step: Redis.
- One app server; next step: Redis adapter plus a load balancer.
- Terraform state is local; next step: S3 with locking.
- SSH open to the internet with key-only auth; host keys not pinned yet.
- Disks not encrypted; to be done at the next planned rebuild.
- JWT lasts 7 days and can't be revoked; next step: shorter tokens with refresh tokens.

Grafana: live at https://grafana.utkarshtyagi.in but behind a login on purpose. Show it through screenshots and a recorded clip, with a note like "live dashboard available on request / walkthrough in interview". Do not link it as if it were public.

### Experience

**Telgoo5** (telecom BSS/MVNE SaaS), Noida. Technical Project Coordinator (Trainee), March 2026 to present.
- Automated a repetitive bulk portal task across ~460 accounts by scripting the portal's own API requests with data from read-only SQL.
- Wrote SQL against production databases to trace billing and payment discrepancies to root cause.
- Debugged REST API provisioning failures with Postman across subscriber, billing and SIM inventory modules.
- Standardized agent permission and role configs across operators against a baseline, reducing configuration drift.
- Ran bulk operations across 3,500+ agents on a live platform, working with Dev, QA, DevOps and client teams.

### Education

B.Tech in Computer Science & Engineering, ABES Engineering College (AKTU), Ghaziabad, 2022 to 2026. CGPA 7.62/10.

### Other projects (minor, one line each at most)

- Realtime Chat App (MERN, Socket.IO, JWT): https://github.com/Utkarsh-262003/think-box-project-master
- Product Management System (MERN, REST APIs, JWT): https://github.com/Utkarsh-262003/product-management-system-main

## Media he will provide in `public/media/`

- `battleroom-game` : two browsers playing a live game
- `pipeline-run` : a push to main going green through build, deploy and smoke test
- `grafana-dashboard` : the golden-signals dashboard
- `discord-alert` : an alert firing and resolving in Discord
- `architecture` : diagram of the AWS setup (if missing, build the diagram in SVG from the facts above)
- screenshots of each of the above

If a file isn't there yet, use a clearly labelled placeholder block of the right size.

Current state (cut from his raw screen recordings; each is `<name>.mp4` H.264 + `<name>.webp` poster, no audio; WebM was larger than the MP4 for every clip so it isn't shipped):

| File | Size (px) | What's in it | Edits |
|---|---|---|---|
| `battleroom-game` | 1440×716 | Two browsers: questions land in both at once, answers, live scores | Starts just before Q1, 1.5× speed, stops before the lobby |
| `pipeline-run` | 1280×800 | Jobs going green, docker logs, Ansible deploy, smoke tests passing | 215 s cut to ~22 s (up to 12× on logs); cropped to the left 1360 px to remove a personal Teams notification; ends on the passing smoke tests, not the run list (it showed an older failed run) |
| `grafana-dashboard` | 1280×720 | Golden signals, UP health checks + certificate days left, node_exporter host view | Cropped out the Windows taskbar and clipped nav; cut before a Codespaces tab preview (showed the Codespace URL) |
| `discord-alert` | 540×1020 | TargetDown firing, then resolved, in #alerts | Phone status bar and message bar cropped; 0.6× speed; holds on the resolved message |

Still missing: `architecture` (the site draws it in SVG instead) and `public/resume.pdf`.

## How to work with Ani

- He's a DevOps learner, not a frontend developer. Explain design and structure choices briefly and plainly, in short sentences.
- Propose the design direction first (structure, type, palette, motion) and wait for his OK before building the whole page.
- Work in small, reviewable commits.
