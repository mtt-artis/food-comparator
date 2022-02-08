import { Component, createEffect, createSignal } from "solid-js";

export const ThemeToggle: Component = () => {
  const [theme, setTheme] = createSignal(getColorPreference());
  createEffect(() => setPreference(theme()));

  const toggle = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <button
      class="h-10 w-10 rounded-full outline-offset-4 grid place-items-center shrink-0 cursor-pointer
      hover:bg-slate-200 
      dark:bg-slate-900 hover:dark:bg-slate-800
      "
      id="theme-toggle"
      title="Toggles light & dark"
      aria-label="auto"
      aria-live="polite"
      onClick={toggle}
    >
      <svg
        class="sun-and-moon rounded-full"
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style="stroke-linecap: round;"
      >
        <defs>
          <mask id="moon-mask" class="origin-center">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <circle
              class="dark:[--translateX:-7px] dark:fill-current transition duration-500 ease"
              style="transform : translateX(var(--translateX,0))"
              cx="24"
              cy="10"
              r="6"
            />
          </mask>
        </defs>
        <circle
          id="sun"
          class="origin-center rounded-full dark:[--scale:1.75] dark:fill-slate-300
          transition duration-500 ease"
          style="transform : scale(var(--scale,1))"
          cx="12"
          cy="12"
          r="6"
          mask="url(#moon-mask)"
        />
        <g
          class="sun-beams origin-center stroke-slate-900 
                 transform dark:-rotate-45 dark:opacity-0 dark:stroke-slate-900 
                 transition duration-500 ease"
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
      </svg>
    </button>
  );
};

const storageKey = "theme-preference";
const getColorPreference = () => {
  if (localStorage.getItem(storageKey)) return localStorage.getItem(storageKey);
  else
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
};

const setPreference = (theme) => {
  localStorage.setItem(storageKey, theme);
  reflectPreference(theme);
};

const reflectPreference = (theme) => {
  document.body.setAttribute("data-theme", theme);

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  document.querySelector("#theme-toggle")?.setAttribute("aria-label", theme);
};
