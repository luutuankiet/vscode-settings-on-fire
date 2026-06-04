const esbuild = require('esbuild')

const production = process.argv.includes('--production')
const watch = process.argv.includes('--watch')

const shared = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'cjs',
  minify: production,
  sourcemap: !production,
  sourcesContent: false,
  external: ['vscode'],
  logLevel: 'info',
}

const targets = [
  { ...shared, platform: 'node', target: 'node16', outfile: 'dist/node/extension.js' },
  { ...shared, platform: 'browser', target: 'es2022', outfile: 'dist/web/extension.js' },
]

async function main() {
  if (watch) {
    const ctxs = await Promise.all(targets.map((t) => esbuild.context(t)))
    await Promise.all(ctxs.map((c) => c.watch()))
    console.log('[watch] watching node + web bundles...')
  } else {
    for (const t of targets) {
      await esbuild.build(t)
      console.log('[build] done -> ' + t.outfile)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
