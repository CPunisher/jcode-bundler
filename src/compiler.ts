import { TransformOptions } from '@babel/core';
import * as Babel from '@babel/standalone';

/**
 * 对 Babel transform 的封装，具有编译 Typescript 和 React JSX 的基本能力
 * 此外也支持自定义其他的编译参数
 * @param code 需要编译的代码
 * @param options 自定义编译参数
 * @returns BabelFileResult 编译结果
 */
export function transform(code: string, options?: TransformOptions) {
    const result = Babel.transform(code, {
        filename: 'index.tsx',
        presets: [
            "typescript",
            "react",
            ...(options?.presets || []),
        ],
        ...options,
    });
    return result;
}

export function compile(code: string) {
    const result = transform(code);
    return result.code || '';
}