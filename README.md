# rollup-plugin-remove-call
A Rollup plugin to remove function calls.

## Install
```sh
npm i rollup-plugin-remove-call --save-dev
```

## Usage

The following example removes 
- `addDebugLog(..)`
- `console.log(...)`
- `a?.b?.c(...)` and `a.b.c(...)`

```js
import { removeCall } from 'rollup-plugin-remove-call';

export default {
    input: 'src/index.js',
    plugins: [
        removeCall({ toRemove: ['addDebugLog', 'console.log', 'a.b.c'] })
    ]
};
```

## LICENSE
MIT © [hakocat](mailto:cc4icloud@icloud.com)