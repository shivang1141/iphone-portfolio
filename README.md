# Shivang Patel — Portfolio

A portfolio you can hold: a working iPhone, built for the web.

On a laptop it renders a titanium iPhone with a lock screen, home screen, widgets, a Dynamic Island,
and real apps for **About, Experience, Projects, Skills, Education, Resume, Messages, and Settings**.
On a phone it drops the frame and becomes the phone.

## Interactions

- **Unlock** — swipe up on the lock screen (it tracks your finger 1:1 and uses momentum to decide), or tap.
- **Open an app** — it zooms out of the exact icon you tapped. Tap the icon again mid-close and it reverses.
- **Go home** — drag the home bar up: the app shrinks into a card that follows you; flick to dismiss.
  `Esc` works too, and so does the browser's back button.
- **Lock** — press the side button on the right of the device.
- **Deep links** — `/#projects`, `/#messages`, etc. open straight into an app.
- **Messages** — typing and sending opens the visitor's mail app with the message ready to go.
- **Resume** — the printer button (or `Ctrl+P` anywhere) prints a clean one-page resume.
- **Settings** — Light/Dark/Automatic appearance, Reduce Motion, and Reduce Transparency.

## Design notes

Built with the [skills](https://github.com/emilkowalski/skills) design-engineering rules:

- Springs for anything a finger can touch (critically damped by default, bounce only after a flick),
  Apple's momentum projection and rubber-banding for gestures, interruptible open/close.
- Only `transform`, `opacity`, and `clip-path` animate; Motion values use full transform strings.
- Custom curves (`--ease-out`, `--ease-in-out`), hover styles gated behind `(hover: hover) and (pointer: fine)`.
- Mobile baseline: `100dvh`, safe-area insets, 16px inputs, no tap highlight, `overscroll-behavior`.
- `prefers-reduced-motion` and `prefers-reduced-transparency` are honored, plus in-phone toggles.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-checks, then builds to dist/
```

All copy lives in [`src/lib/content.ts`](src/lib/content.ts); images in `public/images`.
