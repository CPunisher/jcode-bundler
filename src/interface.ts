/**
 * 编译的最小单位，代表一个代码片段
 */
export interface JCodeModule {
    /**
     * 代码id，对应 rawUrl 上的 codeId
     */
    id: string;

    /**
     * 原始代码，也就是直接 fetch 下来的未编译的代码
     */
    raw: string;

    /**
     * 编译好的代码，只能是浏览器可以直接解析的 javascript
     */
    compiledCode: string;    

    /**
     * 是否编译了。如果未编译的话，那么 compileCode 就为空字符串
     */
    compiled: boolean;
}

/**
 * 抽象的依赖图类型，范型 T 代表节点包含的数据类型
 */
export type DependencyGraph<T> = {
    /**
     * 节点列表，从 id 到数据的映射
     */
    nodes: Record<string, T>;

    /**
     * 边列表，从节点id到节点id数组的映射，代表一个节点有多条指向其他节点的边
     */
    edges: Record<string, string[]>;
}

/**
 * 节点数据为 module 的依赖图，还持有了从 codeId 到 projectId 的映射
 */
export type JCodeModuleGraph = DependencyGraph<JCodeModule> & {
    codeToProject: Record<string, string>;
}

/**
 * 还未获取到原始代码的 module，处于 workList 中
 */
export type PendingModule = {
    id: string;
    promise: Promise<string>;
} 