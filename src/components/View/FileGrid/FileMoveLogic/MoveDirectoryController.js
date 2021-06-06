import React from 'react';

async function MoveDirectoryController({oldDirHandle, oldDirName, newDirHandle, newDirName, removeAfter = false}) {
    let srcDir = await oldDirHandle.getDirectoryHandle(oldDirName);
    let dstDir = undefined;

    try {
        dstDir = await newDirHandle.getDirectoryHandle(newDirName)
    } catch (error) {
    }

    if (dstDir !== undefined) {
        throw ("Katalog o tej nazwie już istnieje");
    }

    dstDir = await newDirHandle.getDirectoryHandle(newDirName, {create: true});

    let toVisitDirs = [{old: srcDir, new: dstDir}];

    while (toVisitDirs.length) {
        let dir = toVisitDirs.pop();
        for await (let [name, handle] of dir.old) {
            if (handle.kind === 'directory') {
                let newHandle = await dir.new.getDirectoryHandle(name, {create: true});
                toVisitDirs.push({old: handle, new: newHandle});
            } else {
                await MoveFileController({
                    oldDirHandle: dir.old,
                    oldFileName: name,
                    newDirHandle: dir.new,
                    newFileName: name,
                    removeAfter: removeAfter
                })
            }
        }
    }

    if (removeAfter) await oldDirHandle.removeEntry(oldDirName, {recursive: true});
}

async function MoveFileController({oldDirHandle, oldFileName, newDirHandle, newFileName, removeAfter = false}) {
    let oldFileHandle = await oldDirHandle.getFileHandle(oldFileName);
    let newFileHandle = undefined;

    try {
        newFileHandle = await newDirHandle.getFileHandle(newFileName);
    } catch (error) {
    }

    if (newFileHandle !== undefined) {
        throw ("Plik o tej nazwie już istnieje");
    }

    newFileHandle = await newDirHandle.getFileHandle(newFileName, {create: true});
    let newFileWritable = await newFileHandle.createWritable();

    let oldFileFile = await oldFileHandle.getFile();

    newFileWritable.write(oldFileFile);

    await newFileWritable.close();

    if (removeAfter) await oldDirHandle.removeEntry(oldFileName, {recursive: false});
}

export {MoveFileController, MoveDirectoryController};
