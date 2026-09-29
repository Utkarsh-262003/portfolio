// Facts used on more than one page. Source of truth: CLAUDE.md. Don't add numbers that aren't there.
import { existsSync } from "node:fs";
import { join } from "node:path";

export const person = {
  name: "Utkarsh Tyagi",
  title: "DevOps Engineer",
  location: "Ghaziabad, India · open to remote · overlaps US hours",
  email: "utkarshtyagi9050@gmail.com",
  github: "https://github.com/Utkarsh-262003",
  linkedin: "https://linkedin.com/in/utkarsh-tyagi26",
};

export const battleroom = {
  live: "https://battleroom.utkarshtyagi.in",
  repo: "https://github.com/Utkarsh-262003/battleroom",
};

/** Resume link only goes live once public/resume.pdf exists. */
export const resume = existsSync(join(process.cwd(), "public", "resume.pdf")) ? "/resume.pdf" : null;

export const numbers = [
  { value: "23", label: "AWS resources in Terraform" },
  { value: "5", label: "pipeline jobs on every push" },
  { value: "26", label: "automated tests on the real app" },
  { value: "8", label: "Prometheus alert rules" },
  { value: "15 min", label: "outside uptime check" },
];
