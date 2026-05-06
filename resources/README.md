# Native asset sources

This folder feeds [`@capacitor/assets`](https://github.com/ionic-team/capacitor-assets), which generates every iOS/Android icon and splash variant when you run `npm run native:assets`.

## Required files

| File                    | Size          | Purpose                                  |
| ----------------------- | ------------- | ---------------------------------------- |
| `icon.png`              | 1024 × 1024   | App icon (used as fallback on iOS).      |
| `icon-foreground.png`   | 1024 × 1024   | Android adaptive icon foreground layer.  |
| `icon-background.png`   | 1024 × 1024   | Android adaptive icon background layer.  |
| `splash.png`            | 2732 × 2732   | Universal splash. Logo centred on cream. |
| `splash-dark.png`       | 2732 × 2732   | Dark-mode variant (optional).            |

## Current state

- `icon.png` and `icon-foreground.png` already point at the brown isotype (`isotipo-cafe-1024.png`).
- `icon-background.png` and `splash.png` still need to be exported. Use the brand cream `#FBF7F0` as background and centre the brown isotype at ~30% width on the splash.

## Regenerate native assets

```powershell
npm run native:assets
```

This rewrites `android/app/src/main/res/...` and `ios/App/App/Assets.xcassets/...`. Commit the result alongside the source files in this folder so designers and devs stay in sync.
