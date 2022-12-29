/**
 * 将字符串内容转换为 base64
 * @param str 需要转换的字符串
 * @returns base64字符串
 */
export function toBase64(str: string) {
    return Buffer.from(str).toString("base64");
}
  
/**
 * 给 javascript 代码转换成的 base64 字符串添加前缀，使之可以直接被 import
 * @param jsCode javascript 代码转换成的 base64 字符串
 * @returns 可以直接被 import 的 javascript base64 字符串
 */
export function toDataURL(jsCode: string) {
    return `data:text/javascript;base64,${toBase64(jsCode)}`;
}

// 码上掘金 rawUrl 的匹配模板，可以匹配出 projectId 和 codeId
const RAW_URL_PATTERN = /^https:\/\/code\.juejin\.cn\/api\/raw\/(\d+)\?id=(\d+)$/;

/**
 * 解析码上掘金 rawUrl 中的 projectId 和 codeId
 * @param moduleName rawUrl 字符串
 * @returns 返回包含 projectId 和 codeId 的对象; 如果匹配失败，返回null
 */
export function resolveRawUrl(moduleName: string) {
    const match = RAW_URL_PATTERN.exec(moduleName);
    if (!match || match.length < 3) {
        return null;
    }
    const [, projectId, codeId] = match;
    return {
        projectId,
        codeId,
    }
}