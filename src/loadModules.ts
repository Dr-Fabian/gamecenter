import * as readdir from 'directory-tree';

function loadModules(): any {
  let buildModules = (src: any): any => {
    let data: any = {};
    src = src.children ? src.children : src;

        src.forEach((f: readdir.DirectoryTree) => {
            if ((f.type === 'file') && (f.extension === '.ts')) data[f.name.replace(/\.ts/g, "")] = require(f.path)
            else if (f.type === 'directory') data[f.name] = buildModules(f);
        });
        return data;
  }
  let tree = readdir(`${__dirname}/modules`).children;
    return buildModules(tree);
}

export { loadModules };