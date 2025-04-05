import { context } from 'esbuild';
import process from 'process';
import { exists, generateManifest } from './utils.js';

const watch = process.argv.includes('--watch');
const manifest = await exists('./fxmanifest.lua');

async function build(development) {
  const ctx = await context({
    entryPoints: ['./src/client/index.ts', './src/server/index.ts'],
    outdir: './dist',
    platform: 'node',
    target: 'node22',
    bundle: true,
    minify: false,
    plugins: [
      {
        name: 'build',
        setup(build) {
          build.onEnd(async (result) => {
            if (result.errors.length > 0) {
              console.error(`Build ended with ${result.errors.length} error(s):`);
              result.errors.forEach((error, i) => {
                console.error(`Error ${i + 1}: ${error.text}`);
              });
              return;
            }

            console.log(development ? 'Successfully built (development)' : 'Successfully built (production)');

            if (!development) {
              if (!manifest) {
                await generateManifest({
                  client: ['dist/client/*.js'],
                  server: ['dist/server/*.js'],
                  dependencies: ['/server:12913', '/onesync', 'ox_lib', 'ox_core', 'ox_inventory'],
                  metadata: { node_version: '22' },
                });
              }
              process.exit(0);
            }
          });
        },
      },
    ],
  });

  if (development && !manifest) {
    console.log('fxmanifest.lua not found, run `pnpm build` to generate it.');
    process.exit(1);
  }

  if (development) {
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await ctx.rebuild();
  }
}

watch ? build(true) : build(false);