import typescript from 'rollup-plugin-typescript2';
import { uglify } from "rollup-plugin-uglify";

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'cjs',
    },
    plugins: [
        typescript(),
        uglify(),
    ]
}
