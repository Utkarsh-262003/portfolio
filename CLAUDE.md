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

**Name:** Utkarsh Tyagi
**Title:** DevOps Engineer
**Location:** Ghaziabad, India. Open to remote. Works night shifts, so he already overlaps with US business hours.
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
- Security: metrics ports (9100 node_exporter, 9101 app metrics) reachable only from the monitoring server via security-group references; IMDSv2 enforced on all instances.
- Ansible playbooks take a fresh server to a running app: Docker, Nginx, TLS, containers, disk resize and swap. Rebuilding the app instance from scratch and running the playbook brings it back with a new certificate, no hand steps.
- GitHub Actions pipeline on every push to main: build the image, tag it with the commit SHA, push to Docker Hub, deploy with Ansible, then a health-check smoke test against the live `/healthz` endpoint.
- Nginx as a WebSocket reverse proxy with Let's Encrypt TLS; certificate renewal hooks reload Nginx without dropping live game connections.
- Prometheus, Grafana and Alertmanager on the separate monitoring server, scraping host and app metrics; alerts (target down, disk almost full, memory almost full) go to Discord. Dashboards and data source are provisioned from files.
- The app itself: Node.js, Express, Socket.IO, MongoDB, JWT auth, rate limiting, Gemini-generated questions.

Design decisions and trade-offs (good material for the case study):
- GitHub Actions over Jenkins: the code already lives on GitHub; no CI server to run and patch.
- Certbot on the host over switching Nginx for Caddy: kept the more common setup he'll meet at work.
- Two Nginx config files (HTTP first, HTTPS added after the certificate exists): a fresh server can't start Nginx with an HTTPS block that points at a certificate that doesn't exist yet.
- Monitoring on its own t3.micro: the 1 GB app server can't hold Prometheus and Grafana too, and monitoring shouldn't die with the thing it watches.
- Prometheus alert rules + Alertmanager over Grafana's built-in alerting.
- App metrics on a separate internal port (9101) instead of a public `/metrics` route.
- Images tagged by commit SHA; old images pruned on the server because Docker Hub keeps every SHA for rollback.
- Secrets: `.env` delivered by Ansible over SSH from a GitHub secret, instead of AWS Secrets Manager. Fine for one server and one operator; Secrets Manager is the answer at larger scale.

Known limits he's aware of (optional section; showing these reads as maturity):
- SSH is open to the internet with key-only auth, because deploys come from GitHub-hosted runners with changing IPs. Next step would be AWS SSM Session Manager.
- Terraform state is local; remote state (S3 + locking) is the next step.

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

## How to work with Ani

- He's a DevOps learner, not a frontend developer. Explain design and structure choices briefly and plainly, in short sentences.
- Propose the design direction first (structure, type, palette, motion) and wait for his OK before building the whole page.
- Work in small, reviewable commits.
