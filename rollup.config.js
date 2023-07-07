import external from "rollup-plugin-peer-deps-external";
import sourcemaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const config = {
  input: pkg.source,
  output: {
    file: "dist/index.js",
    format: "esm",
    name: "ReactInvertedForm",
    sourcemap: true,
    exports: "named",
  },
  external: ["lodash", "rxjs", "react"],
  plugins: [
    external(),
    typescript({
      clean: true,
      exclude: ["**/__tests__", "**/*.test.ts"],
    }),
    sourcemaps(),
    terser({
      output: { comments: false },
      compress: {
        drop_console: true,
      },
    }),
  ],
};

export default config;
