// =============================================================================
// build-native-assets.mjs
// =============================================================================
// Produces the deterministic source PNGs that `@capacitor/assets` consumes:
//
//   resources/icon.png            — 1024×1024, brown isotype on transparent.
//   resources/icon-foreground.png — 1024×1024, same as icon (Android adaptive).
//   resources/icon-background.png — 1024×1024, solid cream `#FBF7F0`.
//   resources/splash.png          — 2732×2732, isotype centred on cream.
//   resources/splash-dark.png     — same artwork (no dark mode design yet).
//
// Re-run after changing the brand assets:
//   npm run native:resources
// =============================================================================

import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const RESOURCES = resolve(ROOT, 'resources')
const BRAND_PNG = resolve(
  ROOT,
  'docs/design/assets/brand/png/isotipo-cafe-1024.png',
)

const CREAM = { r: 0xfb, g: 0xf7, b: 0xf0, alpha: 1 }

async function ensureDir(path) {
  await mkdir(path, { recursive: true })
}

async function writeIcon() {
  // Icon stays as the original brown isotype. Capacitor will mask/round
  // it for each platform variant.
  await sharp(BRAND_PNG).resize(1024, 1024, { fit: 'contain' }).png().toFile(
    resolve(RESOURCES, 'icon.png'),
  )
  await sharp(BRAND_PNG).resize(1024, 1024, { fit: 'contain' }).png().toFile(
    resolve(RESOURCES, 'icon-foreground.png'),
  )
}

async function writeIconBackground() {
  // Solid cream square so Android adaptive icons stand on the brand colour.
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: CREAM,
    },
  })
    .png()
    .toFile(resolve(RESOURCES, 'icon-background.png'))
}

async function writeSplash(filename) {
  // Resize the isotype to ~30 % of the splash width so it reads at any size.
  // `contain` keeps the aspect ratio and pads with transparency where needed.
  const logoSize = 820 // 30 % of 2732
  const logo = await sharp(BRAND_PNG)
    .resize(logoSize, logoSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: 2732,
      height: 2732,
      channels: 4,
      background: CREAM,
    },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(resolve(RESOURCES, filename))
}

async function main() {
  await ensureDir(RESOURCES)
  await writeIcon()
  await writeIconBackground()
  await writeSplash('splash.png')
  await writeSplash('splash-dark.png')
  console.log('✓ native asset sources written to resources/')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
