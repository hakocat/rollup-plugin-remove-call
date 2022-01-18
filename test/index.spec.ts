import { readFileSync } from 'fs';
import { parse } from 'acorn';
import { removeCall as removeCallPlugin } from '../src/index';
import { generate } from 'escodegen';
import { equal } from "assert";

function buildAST(code: string) {
    return parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
}

const removeCall = { ...{ parse: buildAST }, ...removeCallPlugin({ toRemove: ['greetings'] }) };

const originalCode = readFileSync('./test/code/original.js', 'utf-8');
const result = removeCall.transform(originalCode, 'virtual');
const resultAST = buildAST(result?.code ?? "");

const expectedTransformedCode = readFileSync('./test/code/transformed.js', 'utf-8');
const expectedAST = buildAST(expectedTransformedCode);

describe("Function Call Removal Tests", () => {
    it("should remove `greetings()` in main();", () => {
        equal(generate(expectedAST), generate(resultAST));
    });
});