import { simple } from 'acorn-walk';
import { createFilter, FilterPattern } from '@rollup/pluginutils';
import MagicString from 'magic-string';

function flatten(node: any): string {
    if (node.name !== undefined) {
        return node.name
    }

    if (node.type === 'MemberExpression') {
        return `${flatten(node.object)}.${flatten(node.property)}`
    }

    return '';
}

interface SourceLocation {
    start: number;
    end: number;
}

export interface RollupOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
    toRemove?: string[]
}

export function removeCall(options: RollupOptions = {}) {
    const name = 'remove-call';
    const { include, exclude, toRemove } = options;
    const filter = createFilter(include, exclude);

    return {
        name: name,
        transform(code: string, id: any) {
            const shouldSkip = !filter(id);
            if (shouldSkip) {
                return null;
            }

            //@ts-ignore
            const ast = this.parse(code);
            let locations: SourceLocation[] = []

            simple(ast, {
                CallExpression(node) {
                    //@ts-ignore
                    const fn = flatten(node.callee);
                    if (toRemove?.includes(fn) && node) {
                        locations.push({ start: node.start, end: node.end });
                    }
                }
            });

            if (locations.length) {
                const s = new MagicString(code);
                for (const each of locations) {
                    s.remove(each.start, each.end);
                }

                return {
                    code: s.toString(),
                    map: s.generateMap()
                };
            }

            return null;
        }
    };
}