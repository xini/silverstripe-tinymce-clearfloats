import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { optimize } from 'svgo';
import { watch } from 'chokidar';
import { rolldown } from 'rolldown';
import sharp from 'sharp';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(root, process.env.BUILD_DIR || 'dist');
const args = new Set(process.argv.slice(2));
const debug = args.has('--debug');
const hasTask = args.has('--css') || args.has('--js') || args.has('--svgs') || args.has('--svg') || args.has('--images') || args.has('--image');
const buildCss = args.has('--css') || !hasTask;
const buildSvgs = args.has('--svgs') || args.has('--svg') || !hasTask;
const buildJs = args.has('--js') || !hasTask;
const buildImages = args.has('--images') || args.has('--image') || !hasTask;

async function styles() {
    const source = path.join(root, 'src/scss');
    const destination = path.join(output, 'css');
    await mkdir(destination, { recursive: true });
    for (const file of await readdir(source)) {
        if (!file.endsWith('.scss') || file.startsWith('_')) continue;
        const input = path.join(source, file);
        const target = path.join(destination, file.replace(/\.scss$/, '.css'));
        const result = await sass.compileAsync(input, { style: 'compressed', sourceMap: true });
        const css = await postcss([postcssImport(), autoprefixer({ cascade: false, supports: false }), cssnano()])
            .process(result.css, { from: input, to: target, map: { prev: result.sourceMap, inline: false } });
        await writeFile(target, css.css);
        await writeFile(`${target}.map`, css.map.toString());
    }
}

async function scripts() {
    const source = path.join(root, 'src/javascript');
    const destination = path.join(output, 'javascript');
    await mkdir(destination, { recursive: true });
    for (const file of await readdir(source)) {
        if (!file.endsWith('.js')) continue;
        const bundle = await rolldown({ input: path.join(source, file), platform: 'browser' });
        try {
            await bundle.write({ file: path.join(destination, file), format: 'es', sourcemap: true, minify: !debug });
        } finally {
            await bundle.close();
        }
    }
}

async function svgs() {
    const source = path.join(root, 'src/images');
    const destination = path.join(output, 'images');
    await mkdir(destination, { recursive: true });
    for (const file of await readdir(source)) {
        if (!file.endsWith('.svg')) continue;
        const input = path.join(source, file);
        const target = path.join(destination, file);
        const content = await readFile(input, 'utf8');
        const result = optimize(content, {
            path: input,
            plugins: [
                {
                    name: 'preset-default',
                    params: {
                        overrides: {
                            cleanupIds: false,
                            removeUselessStrokeAndFill: false,
                            removeUselessDefs: false,
                        },
                    },
                },
            ],
        });
        await writeFile(target, result.data);
    }
}

async function images() {
    const source = path.join(root, 'src/images');
    const destination = path.join(output, 'images');
    await mkdir(destination, { recursive: true });
    for (const file of await readdir(source)) {
        if (!/\.(jpe?g|png|gif|webp|avif)$/i.test(file)) continue;
        const input = path.join(source, file);
        const target = path.join(destination, file);
        await sharp(input, { animated: true }).toFile(target);
    }
}

async function build() {
    if (buildCss) await styles();
    if (buildJs) await scripts();
    if (buildSvgs) await svgs();
    if (buildImages) await images();
}

await build();
if (args.has('--watch')) {
    let pending = Promise.resolve();
    watch(path.join(root, 'src'), { ignoreInitial: true }).on('all', () => {
        pending = pending.then(build).catch(error => console.error(error));
    });
    console.log('Watching client sources for changes');
}
