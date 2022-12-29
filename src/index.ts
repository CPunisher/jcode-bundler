import { buildDependencyGraph, pack } from "./dependency-graph";
import { JCodeModule, JCodeModuleGraph, PendingModule } from "./interface";
import { resolveRawUrl } from "./utils";
import fetch from "node-fetch";

/**
 * 编译入口代码，生成和处理依赖图
 * @param entryRawUrl 入口 rawUrl 字符串
 * @returns 包含依赖图和最终处理好的代码字符串
 */
export default async function bundle(entryRawUrl: string) {
    const workList: PendingModule[] = [];
    const graph: JCodeModuleGraph = {
        nodes: {},
        edges: {},
        codeToProject: {},
    };

    const rawUrlObj = resolveRawUrl(entryRawUrl);
    if (!rawUrlObj) {
        return;
    }
    const { codeId: entryId } = rawUrlObj;
    // 将入口节点添加到 workList 中
    workList.push({
        id: entryId,
        promise: fetch(entryRawUrl).then(res => res.text()),
    })

    // 只要 workList 中还存在没有 fetch 的节点，就说明还有依赖没处理和构建
    while (workList.length > 0) {
        const pending = workList.pop();
        const node: JCodeModule = {
            id: pending?.id!,
            raw: await pending?.promise!,
            compiledCode: "",
            compiled: false,
        }

        graph.nodes[pending?.id!] = node;
        // 用新 fetch 的代码所生成的 module 节点继续更新依赖图
        buildDependencyGraph(node.raw, {
            callerId: node.id,
            graph,
            workList,
        });
    }

    // 拓扑排序 + 编译所有相关 module 节点
    pack(entryId, graph);
    return {
        graph,
        code: graph.nodes[entryId].compiledCode,
    }
}