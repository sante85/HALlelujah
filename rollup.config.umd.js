import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';

export default {
    entry: 'src/ng2-hallelujah.ts',
    format: 'umd',
    moduleName: 'ng2-hallelujah',
    sourceMap: true,
    external: [
        '@angular/core',
    ],
    dest: 'dist/ng2-hallelujah.umd.js',
    plugins: [
        typescript({
            typescript: require('typescript')
        }),
        resolve({
            module: true,
            main: true
        }),
        commonjs({
            include: 'node_modules/**',
        })
    ],
    onwarn: warning => {
        const skip_codes = [
            'THIS_IS_UNDEFINED',
            'MISSING_GLOBAL_NAME'
        ];
        if (skip_codes.indexOf(warning.code) != -1) return;
        console.error(warning);
    }
};