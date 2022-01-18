import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

const bundle = config => ({
    ...config,
    input: 'src/index.ts',
    external: id => !/^[./]/.test(id)
})

export default [
    bundle({
        output: {
            file: pkg.main,
            format: 'cjs'
        },
        plugins: [typescript(), terser()]
    }),
    bundle({
        output: {
            file: pkg.module,
            format: 'esm'
        },
        plugins: [typescript(), terser()]
    }),
    bundle({
        output: {
            file: pkg.typings,
        },
        plugins: [dts()]
    })
];