import { resolve } from "path";
import { ResolvedOptions, GeneratorTree, GeneratorFile } from "./types";

export function flattenTree(trees: GeneratorTree[], onFilterFile: (el: GeneratorTree) => boolean = () => true) {
    let flattenedFiles: GeneratorFile[] = [];
    function recurseFlatten(trees: GeneratorTree[]) {
        trees.forEach((el) => {
            const { name, path, relativePath, extension, type, children } = el;
            onFilterFile(el) && flattenedFiles.push({ name, path, relativePath, extension, type });
            if (children && children.length > 0) recurseFlatten(children);
        });
    }
    recurseFlatten(trees);
    return flattenedFiles;
}

function isDir(file: string, options: ResolvedOptions) {
    for (const page of options.dirOptions) {
        const dirPath = slash(resolve(options.root, page.dir));
        if (file.startsWith(dirPath)) return true;
    }
    return false;
}

export function isTarget(file: string, options: ResolvedOptions) {
    return isDir(file, options) && options.extensionsReg.test(file);
}

export function slash(str: string): string {
    return str.replace(/\\/g, "/");
}

export function pathToName(filepath: string) {
    return filepath.replace(/[_.\-\\/]/g, "_").replace(/[[:\]()]/g, "$");
}
