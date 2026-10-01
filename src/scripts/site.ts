// All page behaviour. Everything degrades: without JS the server-rendered page is complete,
// and under prefers-reduced-motion nothing autoplays, types or travels.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

/** Run `fn(true)` when `el` scrolls into view and `fn(false)` when it leaves. */
function whenVisible(el: Element, fn: (visible: boolean) => void, threshold = 0.3) {
  new IntersectionObserver(([entry]) => fn(entry.isIntersecting), { threshold }).observe(el);
}

/* ---------- Clips: play only on screen; Pause/Play; Expand into the shared player ---------- */
const lightbox = $<HTMLDialogElement>(".lightbox");
const lightboxVideo = lightbox && $<HTMLVideoElement>("video", lightbox);
const lightboxCaption = lightbox && $(".lightbox-caption", lightbox);
const inlineVideos: HTMLVideoElement[] = [];

for (const figure of $$("[data-clip]")) {
  const video = $<HTMLVideoElement>("video", figure);
  const toggle = $<HTMLButtonElement>(".clip-toggle", figure);
  const expand = $<HTMLButtonElement>(".clip-expand", figure);
  if (!video || !toggle) continue;
  inlineVideos.push(video);

  let onScreen = false;
  let heldByUser = reduceMotion;
  const label = video.getAttribute("aria-label") ?? "clip";
  const render = () => {
    const playing = !video.paused;
    toggle.textContent = playing ? "Pause" : "Play";
    toggle.setAttribute("aria-label", `${playing ? "Pause" : "Play"}: ${label}`);
  };
  const sync = () => {
    if (onScreen && !heldByUser && !lightbox?.open) {
      if (video.paused) video.play().catch(render);
    } else if (!video.paused) {
      video.pause();
    }
  };
  video.addEventListener("play", render);
  video.addEventListener("pause", render);
  toggle.disabled = false;
  render();
  toggle.addEventListener("click", () => {
    heldByUser = !video.paused;
    if (heldByUser) video.pause();
    else video.play().catch(render);
  });
  whenVisible(figure, (v) => {
    onScreen = v;
    sync();
  }, 0.35);

  if (expand && lightbox && lightboxVideo) {
    expand.disabled = false;
    expand.addEventListener("click", () => {
      inlineVideos.forEach((v) => v.pause());
      lightboxVideo.src = expand.dataset.src ?? "";
      lightboxVideo.poster = video.poster;
      if (lightboxCaption) lightboxCaption.textContent = expand.dataset.caption ?? "";
      lightbox.showModal();
      if (!reduceMotion) lightboxVideo.play().catch(() => {});
    });
  }
}

if (lightbox && lightboxVideo) {
  lightbox.addEventListener("close", () => {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
  });
  // click on the backdrop closes
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.close();
  });
}

/* ---------- Card spotlight follows the cursor ---------- */
if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
  document.addEventListener("pointermove", (e) => {
    const card = (e.target as Element | null)?.closest?.<HTMLElement>("[data-spot]");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, { passive: true });
}

/* ---------- Clock: Noida and New York, to show the overlap ---------- */
const clock = $("[data-clock]");
if (clock) {
  const fmt = (tz: string) =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(new Date());
  const tick = () => {
    clock.textContent = `${fmt("Asia/Kolkata")} in Noida · ${fmt("America/New_York")} in New York`;
  };
  tick();
  setInterval(tick, 30_000);
}

/* ---------- Count-up numbers ---------- */
for (const el of $$("[data-count]")) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? "";
  if (reduceMotion || !Number.isFinite(target)) continue;
  // the real number stays in the page until the count-up actually starts
  let done = false;
  whenVisible(el, (v) => {
    if (!v || done) return;
    done = true;
    const start = performance.now();
    const dur = 900;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, 0.6);
}

/* ---------- Pipeline: a signal walks 01 → 07, lighting each stage, then resets ---------- */
const pipe = $("[data-pipe]");
if (pipe) {
  const stages = $$("[data-stage]", pipe);
  const last = stages.length - 1;
  const show = (k: number) => {
    pipe.style.setProperty("--pos", String(Math.max(0, k) / last));
    stages.forEach((s, i) => s.classList.toggle("lit", i <= k));
  };
  if (reduceMotion) {
    show(last);
  } else {
    let k = -1;
    let timer: number | undefined;
    const run = () => {
      k = k >= last ? -1 : k + 1;
      show(k);
      timer = window.setTimeout(run, k === last ? 2600 : k === -1 ? 500 : 750);
    };
    whenVisible(pipe, (v) => {
      window.clearTimeout(timer);
      if (v) run();
    }, 0.25);
  }
}

/* ---------- Copy email ---------- */
for (const btn of $$<HTMLButtonElement>("[data-copy]")) {
  btn.hidden = false;
  btn.addEventListener("click", async () => {
    const text = btn.dataset.copy ?? "";
    const label = btn.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied ✓";
    } catch {
      btn.textContent = "Press Ctrl+C";
      const sel = window.getSelection();
      const target = $(btn.dataset.copyTarget ?? "");
      if (sel && target) {
        const range = document.createRange();
        range.selectNodeContents(target);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    window.setTimeout(() => (btn.textContent = label), 1800);
  });
}

/* ---------- Terminal ---------- */
const term = $("[data-terminal]");
if (term) setupTerminal(term);

function setupTerminal(root: HTMLElement) {
  const body = $("[data-term-body]", root)!;
  const lines = $("[data-term-lines]", root)!;
  const form = $<HTMLFormElement>("[data-term-form]", root)!;
  const input = $<HTMLInputElement>("input", form)!;
  const data = JSON.parse($("[data-term-data]", root)?.textContent ?? "{}") as {
    name: string; email: string; github: string; linkedin: string; live: string; repo: string;
    resume: string | null; skills: [string, string][];
  };

  const scrollDown = () => (body.scrollTop = body.scrollHeight);

  // --- intro: replay the deploy, typing the commands ---
  const intro = $$("[data-intro]", lines);
  let skip = false;
  const finishIntro = () => {
    skip = true;
    lines.classList.remove("is-typing");
    intro.forEach((l) => l.classList.add("shown"));
    $$("[data-type]", lines).forEach((t) => (t.textContent = t.dataset.full ?? t.textContent));
    scrollDown();
  };
  if (!reduceMotion) {
    lines.classList.add("is-typing");
    $$("[data-type]", lines).forEach((t) => (t.dataset.full = t.textContent ?? ""));
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await wait(400);
      for (const line of intro) {
        if (skip) return;
        const typed = $("[data-type]", line);
        if (typed) {
          const full = typed.dataset.full ?? "";
          typed.textContent = "";
          line.classList.add("shown");
          for (let i = 1; i <= full.length; i++) {
            if (skip) return;
            typed.textContent = full.slice(0, i);
            await wait(22 + Math.random() * 30);
          }
          await wait(260);
        } else {
          line.classList.add("shown");
          await wait(line.classList.contains("line-ok") ? 230 : 160);
        }
        scrollDown();
      }
      lines.classList.remove("is-typing");
    })();
    input.addEventListener("focus", finishIntro, { once: true });
  }

  // clicking anywhere in the terminal focuses the prompt
  body.addEventListener("click", (e) => {
    if (!(e.target as Element).closest("a") && !window.getSelection()?.toString()) input.focus({ preventScroll: true });
  });

  // --- output helpers (text only via textContent; links built as elements) ---
  type Part = string | { href: string; text: string };
  const print = (parts: Part | Part[], kind = "out") => {
    const li = document.createElement("div");
    li.className = `line line-${kind}`;
    for (const p of Array.isArray(parts) ? parts : [parts]) {
      if (typeof p === "string") li.append(p);
      else {
        const a = document.createElement("a");
        a.href = p.href;
        a.textContent = p.text;
        if (/^https?:/.test(p.href)) a.rel = "noopener";
        li.append(a);
      }
    }
    lines.append(li);
  };
  const go = (href: string, label: string) => {
    print(`opening ${label}…`, "note");
    window.open(href, /^https?:/.test(href) ? "_blank" : "_self", "noopener");
  };

  const links: Record<string, [string, string]> = {
    live: [data.live, "battleroom.utkarshtyagi.in"],
    app: [data.live, "battleroom.utkarshtyagi.in"],
    repo: [data.repo, "the BattleRoom repo"],
    github: [data.github, "GitHub"],
    linkedin: [data.linkedin, "LinkedIn"],
    case: ["/battleroom/", "the case study"],
  };

  const commands: Record<string, (args: string[]) => void> = {
    help() {
      print("commands:");
      print("  whoami · skills · battleroom · pipeline · stack · experience · contact · resume");
      print("  open <live|repo|github|linkedin|case> · ls · clear");
      print("  (there may be a few others. it's a terminal, poke around.)", "note");
    },
    whoami() {
      print(`${data.name}. DevOps engineer.`);
      print("Noida, India · open to remote · overlaps US hours");
    },
    skills() {
      for (const [group, items] of data.skills) print(`${group.padEnd(20)}${items}`);
    },
    battleroom() {
      print("BattleRoom: real-time multiplayer quiz game, running on AWS.");
      print("terraform (23 resources) · ansible · github actions · prometheus · grafana · alertmanager");
      print(["live  ", { href: data.live, text: "battleroom.utkarshtyagi.in" }]);
      print(["code  ", { href: data.repo, text: "github.com/Utkarsh-262003/battleroom" }]);
      print(["story ", { href: "/battleroom/", text: "the case study" }]);
    },
    pipeline() {
      print("on every push to main:");
      print("  1 test        eslint, then 26 tests against the real app (~20 s)");
      print("  2 infra-lint  ansible-lint, terraform fmt, terraform validate");
      print("  3 docker      build, stamp the SHA, push :SHA and :latest");
      print("  4 deploy      pinned ansible ships that exact SHA");
      print("  5 smoke tests /healthz ok + new SHA, monitoring answers");
      print("rollback = type an old SHA into “Run workflow”.", "note");
    },
    stack() {
      print("this site (project 2, on azure):");
      print("  infra    terraform: vnet, subnet, nsg (22/80/443), static ip, ubuntu 24.04 vm");
      print("  region   central india, zone 1");
      print("  image    node 22 builds → nginx 1.29 alpine, ~85 MB, no node inside");
      print("  config   ansible: docker, compose, certbot + renewal hook");
      print("  ci       check → docker → deploy → smoke test over https");
      print("battleroom is the aws one. try: battleroom", "note");
    },
    experience() {
      print("Telgoo5 · Technical Project Coordinator (Trainee) · Mar 2026 → now");
      print("  automated a bulk portal task across ~460 accounts (portal API + read-only SQL)");
      print("  bulk operations across 3,500+ agents on a live platform");
      print("  SQL on production data to trace billing and payment discrepancies");
    },
    contact() {
      print(["email     ", { href: `mailto:${data.email}`, text: data.email }]);
      print(["github    ", { href: data.github, text: "github.com/Utkarsh-262003" }]);
      print(["linkedin  ", { href: data.linkedin, text: "linkedin.com/in/utkarsh-tyagi26" }]);
    },
    resume() {
      if (data.resume) go(data.resume, "resume.pdf");
      else print("resume.pdf isn't uploaded yet.", "err");
    },
    open(args) {
      const target = links[args[0] ?? ""];
      if (target) go(target[0], target[1]);
      else print("usage: open <live|repo|github|linkedin|case>", "err");
    },
    ls() {
      print("battleroom/   case-study.md   contact.txt   resume.pdf");
    },
    cat(args) {
      const f = args[0] ?? "";
      if (f === "contact.txt") commands.contact([]);
      else if (f === "resume.pdf") print("that's a binary file. try: resume", "note");
      else if (f.startsWith("case-study")) go("/battleroom/", "the case study");
      else print(`cat: ${f || "?"}: no such file`, "err");
    },
    cd(args) {
      if ((args[0] ?? "").startsWith("battleroom")) go("/battleroom/", "the case study");
      else print("you're already where the good stuff is.", "note");
    },
    sudo() {
      print("utkarsh is not in the sudoers file. This incident will be reported to #alerts.", "err");
    },
    rm() {
      print("blocked: this change didn't pass the pre-deploy checks.", "err");
    },
    ping() {
      print("can't ping from your browser: the app only answers its own origin.", "note");
      print("at build time /healthz said ok. try: open live");
    },
    exit() {
      print("there's no exit here, only rollbacks.", "note");
    },
    vim() {
      print("you are now trapped in vim. just kidding. try: help", "note");
    },
    clear() {
      lines.replaceChildren();
    },
  };
  commands.projects = commands.battleroom;
  commands.hire = commands.contact;
  commands.email = commands.contact;
  commands.cv = commands.resume;
  commands.nano = commands.vim;
  commands.emacs = commands.vim;

  const history: string[] = [];
  let hIndex = 0;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    finishIntro();
    const raw = input.value.trim();
    input.value = "";
    if (!raw) return;
    history.push(raw);
    hIndex = history.length;
    const echo = document.createElement("div");
    echo.className = "line line-cmd";
    const ps1 = document.createElement("span");
    ps1.className = "ps1";
    ps1.textContent = "$ ";
    echo.append(ps1, raw);
    lines.append(echo);
    const [cmd, ...args] = raw.split(/\s+/);
    const fn = commands[cmd.toLowerCase()];
    if (fn) fn(args);
    else print(`command not found: ${cmd}. try: help`, "err");
    scrollDown();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hIndex > 0) {
      hIndex--;
      input.value = history[hIndex];
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] ?? "";
      e.preventDefault();
    }
  });
}
