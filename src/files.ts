import { scanAsync, Dree } from "dree";
import { ResolvedOptions, onFilterFile, GeneratorTree } from "./types";

export async function getTrees(path: string, options: ResolvedOptions): Promise<Dree> {
    const { extensions, exclude = [] } = options;

    const files = await scanAsync(path, {
        normalize: true,
        sizeInBytes: false,
        size: false,
        exclude: [/node_modules/, /.git/, /\*\*\/__\*__\/\*\*/, ...exclude],
        extensions
    });
    console.log("extensions", extensions);
    return files;
}

export function generateFileTree(tree: Dree, rootPath: string = ".", options: ResolvedOptions): GeneratorTree {
    const { onFilterFile } = options;

    function recursiveFileTree(tree: Dree, onFilterFile: onFilterFile) {
        const { relativePath, path, type, children, name, extension } = tree;
        let generateTree: GeneratorTree = { name, path, type, extension, relativePath: `${rootPath}/${relativePath}` };

        if (children && children.length > 0)
            generateTree.children = children.map((el) => recursiveFileTree(el, onFilterFile));

        return generateTree;
    }

    return recursiveFileTree(tree, onFilterFile);
}