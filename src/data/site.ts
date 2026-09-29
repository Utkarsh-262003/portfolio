// Facts used across the site. Source of truth: CLAUDE.md (and his resume). Don't add numbers that aren't there.
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

export const person = {
  name: "Utkarsh Tyagi",
  title: "DevOps Engineer",
  location: "Ghaziabad, India",
  email: "utkarshtyagi9050@gmail.com",
  github: "https://github.com/Utkarsh-262003",
  linkedin: "https://linkedin.com/in/utkarsh-tyagi26",
};

export const battleroom = {
  live: "https://battleroom.utkarshtyagi.in",
  repo: "https://github.com/Utkarsh-262003/battleroom",
};

/** Resume link only goes live once public/resume.pdf exists (the web copy, phone number removed). */
export const resume = existsSync(join(process.cwd(), "public", "resume.pdf")) ? "/resume.pdf" : null;

export const numbers = [
  { value: 23, suffix: "", label: "AWS resources in Terraform" },
  { value: 5, suffix: "", label: "pipeline jobs on every push" },
  { value: 26, suffix: "", label: "automated tests on the real app" },
  { value: 8, suffix: "", label: "Prometheus alert rules" },
  { value: 15, suffix: " min", label: "outside uptime check" },
];

export const skills = [
  { group: "Cloud & IaC", items: ["AWS EC2", "VPC", "IAM", "Security Groups", "Elastic IP", "Terraform", "Ansible"] },
  { group: "Containers & CI/CD", items: ["Docker", "Docker Compose", "GitHub Actions", "Jenkins"] },
  { group: "Monitoring", items: ["Prometheus", "Grafana", "Alertmanager", "node_exporter", "blackbox exporter"] },
  { group: "Web & networking", items: ["Linux", "Nginx", "DNS", "HTTP/HTTPS", "TLS", "Let’s Encrypt", "WebSockets"] },
  { group: "Languages & data", items: ["Bash", "JavaScript", "Node.js", "Express", "SQL", "C++", "MongoDB", "MySQL"] },
  { group: "Learning now", items: ["Kubernetes", "ELK Stack"] },
];

export const alertRules = [
  "TargetDown",
  "EndpointDown",
  "HighErrorRate",
  "SlowResponses",
  "QuestionGenerationFailing",
  "CertificateExpiringSoon",
  "DiskAlmostFull",
  "MemoryAlmostFull",
];

/** The commit this site was built from, and when. Shown in the footer. */
export const build = {
  sha: (() => {
    try {
      return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    } catch {
      return null;
    }
  })(),
  date: new Date().toISOString().slice(0, 10),
};

export interface Health {
  status: string;
  db: boolean;
  version: string;
  checkedAt: string;
}

let healthCache: Promise<Health | null> | undefined;

/**
 * Asks the live app's /healthz once, at build time. The browser can't do this itself:
 * the app sends Cross-Origin-Resource-Policy: same-origin. Returns null if it can't be reached.
 */
export function getHealth(): Promise<Health | null> {
  healthCache ??= (async () => {
    try {
      const res = await fetch(`${battleroom.live}/healthz`, { signal: AbortSignal.timeout(5000) });
      const body = (await res.json()) as { status?: unknown; db?: unknown; version?: unknown };
      if (typeof body.status !== "string" || typeof body.version !== "string") return null;
      return {
        status: body.status,
        db: body.db === true,
        version: body.version.slice(0, 7),
        checkedAt: new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC",
      };
    } catch {
      return null;
    }
  })();
  return healthCache;
}
