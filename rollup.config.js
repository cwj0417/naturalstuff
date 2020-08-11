import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';

export default {
    input: process.env.mode && process.env.mode === 'snake' ? 'snake/index.ts' : 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'cjs',
    },
    plugins: [
        typescript(),
        // terser(),
    ]
}
