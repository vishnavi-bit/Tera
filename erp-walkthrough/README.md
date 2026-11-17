# ERP walkthrough

Two layers: `walkthrough/` (the shared engine that frames a mock app) and `apps/<app>/` (one mock app and its sequences).

    walkthrough/            engine: index.html, src/, validate-cli.mjs (app-agnostic)
    apps/apps.json          list of apps
    apps/<app>/
      app.json              name, title, spec, feedbackApp, walkthroughs
      roles.json            colour per user role
      mock-app/             the independent mock ERP (screens, shared, mock-data, registry)
      sequences/            one JSON per walkthrough
      gaps/                 spec gaps found while building each walkthrough

## Run
From this folder:

    python3 -m http.server 8765

- Walkthroughs: http://localhost:8765/walkthrough/?app=everp  (the app is chosen automatically when only one exists)
- Mock app on its own (screen directory): http://localhost:8765/apps/everp/mock-app/

## Validate
    node walkthrough/validate-cli.mjs              # every app
    node walkthrough/validate-cli.mjs --app everp  # one app

Fails if a sequence points at a missing screen, action, step, or data key. Run it after editing a mock screen.

## Add a screen
1. Create `apps/<app>/mock-app/screens/<side>/<name>.js` exporting `meta` and `render(context)`.
2. Register its code in `apps/<app>/mock-app/registry.js`.
3. Reference the code from a step in `apps/<app>/sequences/*.json`.

## Add an app or walkthrough
Use the `create-walkthrough` skill (`.claude/skills/create-walkthrough`).
