import { transform } from "./compiler";
import { BuilderProps, dependencyGraphBuilder, jcodeDependency } from "./babel-plugins";
import { JCodeModuleGraph } from "./interface";

/**
 * 根据代码构建依赖图
 * @param code 未编译转换的代码
 * @param props 构建依赖图所需的参数
 */
export function buildDependencyGraph(code: string, props: BuilderProps) {
    transform(code, {
        plugins: [dependencyGraphBuilder(props)]
    });
}

/**
 * 根据依赖图将相关代码的 module node 进行编译和 rawUrl 替换
 * @param entry 入口 module 节点的id(codeId)
 * @param graph 依赖图
 */
export function pack(entry: string, graph: JCodeModuleGraph) {
    const visited = new Set<string>();
    dfsPack(entry, graph, visited);
}

/**
 * 深度优先搜索算法，按照依赖关系进行拓扑排序，并对相关 module 节点的代码进行编译和 rawUrl 替换
 * @param codeId 当前处理的 module 节点 id
 * @param graph 依赖图
 * @param visited 记录访问过的节点的集合
 */
function dfsPack(codeId: string, graph: JCodeModuleGraph, visited: Set<string>) {
    visited.add(codeId);
    const edges = graph.edges[codeId] ?? [];
    // 遍历从 codeId 出发的每条边的目标节点，也就是所有依赖
    for (const target of edges) {
        if (!visited.has(target)) {
            // 递归搜索，也就是先把所有依赖编译了，再编译本身
            dfsPack(target, graph, visited);
        } else if (!graph.nodes[target].compiled) {
            // 如果再次访问了一个访问过但还没有被编译的节点，说明出现了循环依赖
            throw Error('Circular dependency');
        }
    }

    const node = graph.nodes[codeId];
    if (!node) {
        throw Error(`Node ${codeId} do not exist`);
    }

    // 编译 + rawUrl 替换
    const resultCode = transform(node.raw, {
        plugins: [jcodeDependency(graph)],
    }).code;

    if (resultCode) {
        // 记录编译结果
        node.compiledCode = resultCode;
        node.compiled = true;
    }
}
