'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Some synchronous utilities functions for manipulate the file system.
 * @module fsutil
 */

let fsutil = {

    /**
     * Create a directory recursively
     * @param {string} targetDir
     */
    makeDirectory: function (targetDir) {
        const sep = path.sep;
        const initDir = path.isAbsolute(targetDir) ? sep : '';
        targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(parentDir, childDir);
            if (!fs.existsSync(curDir)) {
                fs.mkdirSync(curDir);
            }

            return curDir;
        }, initDir);
    },

    /**
     * Copy the file source to target
     * @param {string} source
     * @param {string} target
     */
    copyFileSync: function (source, target) {

        let targetFile = target;

        //if target is a directory a new file with the same name will be created
        if (fs.existsSync(target)) {
            if (fs.lstatSync(target).isDirectory()) {
                targetFile = path.join(target, path.basename(source));
            }
        }

        fs.writeFileSync(targetFile, fs.readFileSync(source));
    },

    /**
     * Copy the folder source to the folder target recursively
     * @param {string} source
     * @param {string} target
     */
    copyFolderRecursiveSync: function (source, target) {
        let files = [];

        //check if folder needs to be created or integrated
        let targetFolder = path.join(target, path.basename(source));
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }

        //copy
        if (fs.lstatSync(source).isDirectory()) {
            files = fs.readdirSync(source);
            files.forEach(function (file) {
                let curSource = path.join(source, file);
                if (fs.lstatSync(curSource).isDirectory()) {
                    fsutil.copyFolderRecursiveSync(curSource, targetFolder);
                } else {
                    fsutil.copyFileSync(curSource, targetFolder);
                }
            });
        }
    },

    /**
     * Remove the directory recursively
     * @param dirPath
     */
    removeDirectoryRecursive: function(dirPath) {
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach(function(entry) {
                let entryPath = path.join(dirPath, entry);
                if (fs.lstatSync(entryPath).isDirectory()) {
                    fsutil.removeDirectoryRecursive(entryPath);
                } else {
                    fs.unlinkSync(entryPath);
                }
            });
            fs.rmdirSync(dirPath);
        }
    }
};

module.exports = fsutil;