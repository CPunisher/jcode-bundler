import { PluginObj, Visitor } from '@babel/core';
import { JCodeModuleGraph, PendingModule } from './interface';
import fetch from 'node-fetch';
import * as t from '@babel/types';
import { toDataURL, resolveRawUrl } from './utils';

/**
 * 构建依赖图插件的参数
 */
export type BuilderProps = {
    /**
     * 当前解析的代码片段的 id
     */
    callerId: string,

    /**
     * 依赖图对象
     */
    graph: JCodeModuleGraph,

    /**
     * 尚未 fetch 源代码的 module 队列
     */
    workList: PendingModule[],
}

/**
 * 构建依赖图的 Babel 插件
 * 解析特定代码片段中的 import rawUrl，创建新的 module 节点和依赖边
 * @param param0 构建依赖图所需的参数
 * @returns Babel 插件对象
 */
export function dependencyGraphBuilder({ callerId, graph, workList }: BuilderProps): PluginObj<void> {
    const buildVisitor: Visitor<void> = {
        ImportDeclaration(path) {
            const moduleName = path.node.source.value;
            const rawUrlObj = resolveRawUrl(moduleName);
            if (!rawUrlObj) {
                return;
            }
            const { projectId, codeId } = rawUrlObj;

            // 如果 codeId 对应的 Node 在 Graph 和 WorkList 中均不存在则创建
            if (Object.keys(graph.nodes).indexOf(codeId) === -1 && workList.findIndex(pm => pm.id === codeId) === -1) {
                workList.push({
                    id: codeId,
                    promise: fetch(moduleName).then(res => res.text()),
                })
            }
    
            // 如果边 caller -> codeId 未添加，则添加
            let edges = graph.edges[callerId];
            if (!edges) {
                edges = [];
                graph.edges[callerId] = edges;
            }
            if (edges.indexOf(codeId) === -1) {
                edges.push(codeId);
            }

            // 添加 codeId -> projectId
            graph.codeToProject[codeId] = projectId;
        }
    };
    
    return {
        visitor: buildVisitor,
    }
}

/**
 * 打包代码的 Babel 插件
 * 解析特定代码片段的 import rawUrl，将 rawUrl 替换为编译好的代码的 base64
 * @param graph 依赖图
 * @returns Babel 插件对象
 */
export function jcodeDependency(graph: JCodeModuleGraph): PluginObj<void> {
    const visitor: Visitor<void> = {
        ImportDeclaration(path) {
            const moduleName = path.node.source.value;
            const rawUrlObj = resolveRawUrl(moduleName);
            if (!rawUrlObj) {
                return;
            }

            const { codeId } = rawUrlObj;
            // 从依赖图中获得 module 节点
            const target = graph.nodes[codeId];
            if (!target) {
                return;
            }

            // 将 rawUrl 替换为编译好的代码的 base64
            path.replaceWith(
                t.importDeclaration(
                    path.node.specifiers,
                    t.stringLiteral(toDataURL(target.compiledCode)),
                )
            )
        }
    };
    
    return {
        visitor,
    }
}
