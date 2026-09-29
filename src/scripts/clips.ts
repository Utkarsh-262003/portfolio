// Clips play only while on screen and pause when scrolled away (saves CPU and data).
// Under prefers-reduced-motion nothing autoplays: the poster shows and the button offers Play.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

for (const figure of document.querySelectorAll<HTMLElement>("[data-clip]")) {
  const video = figure.querySelector("video");
  const button = figure.querySelector<HTMLButtonElement>(".clip-toggle");
  if (!video || !button) continue;

  let onScreen = false;
  let heldByUser = reduceMotion.matches;

  const render = () => {
    const playing = !video.paused;
    button.textContent = playing ? "Pause" : "Play";
    button.setAttribute("aria-label", `${playing ? "Pause" : "Play"}: ${video.getAttribute("aria-label") ?? "clip"}`);
  };

  const sync = () => {
    if (onScreen && !heldByUser) {
      if (video.paused) video.play().catch(() => render());
    } else if (!video.paused) {
      video.pause();
    }
  };

  video.addEventListener("play", render);
  video.addEventListener("pause", render);

  button.disabled = false;
  render();

  button.addEventListener("click", () => {
    heldByUser = !video.paused;
    if (heldByUser) video.pause();
    else video.play().catch(() => render());
  });

  new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    },
    { threshold: 0.35 },
  ).observe(figure);
}

// Pipeline rail: each step's marker turns "passed" green once it has scrolled into view,
// like a CI check going green. Stays green after that.
const steps = document.querySelectorAll<HTMLElement>("[data-step]");
if (steps.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-passed");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -40% 0px" },
  );
  steps.forEach((step) => observer.observe(step));
}
