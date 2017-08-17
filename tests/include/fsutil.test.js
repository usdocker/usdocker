const fs = require('fs');
const fsutil = require('../../include/fsutil');

beforeEach(() => {
    fsutil.makeDirectory('/tmp/.fsutil/template');
    fs.writeFileSync('/tmp/.fsutil/template/filea.txt', 'contenta');
    fs.writeFileSync('/tmp/.fsutil/template/fileb.txt', 'contentb');
});

afterEach(() => {
    fsutil.removeDirectoryRecursive('/tmp/.fsutil');
});

test('Check if directories is OK', () => {
    expect(fs.statSync('/tmp/.fsutil/template').isDirectory()).toBe(true);
    expect(fs.statSync('/tmp/.fsutil/template/filea.txt').isFile()).toBe(true);
    expect(fs.statSync('/tmp/.fsutil/template/fileb.txt').isFile()).toBe(true);
});

test('Test create directory', () => {
    expect(fs.existsSync('/tmp/.fsutil/test')).toBe(false);
    fsutil.makeDirectory('/tmp/.fsutil/test/a/b');
    expect(fs.statSync('/tmp/.fsutil/test/a/b').isDirectory()).toBe(true);
});

test('Test copy file', () => {
    expect(fs.existsSync('/tmp/.fsutil/copy.txt')).toBe(false);
    fsutil.copyFileSync('/tmp/.fsutil/template/fileb.txt', '/tmp/.fsutil/copy.txt');
    expect(fs.existsSync('/tmp/.fsutil/copy.txt')).toBe(true);
    expect(fs.readFileSync('/tmp/.fsutil/copy.txt').toString()).toBe('contentb');
});


test('Test copy and remove folder recursively', () => {
    expect(fs.existsSync('/tmp/.fsutil/copy')).toBe(false);
    expect(fs.existsSync('/tmp/.fsutil/template')).toBe(true);

    // First copy will create the directory so, do not append template
    fsutil.copyFolderRecursiveSync('/tmp/.fsutil/template', '/tmp/.fsutil/copy');
    expect(fs.existsSync('/tmp/.fsutil/copy/filea.txt')).toBe(true);
    expect(fs.existsSync('/tmp/.fsutil/copy/fileb.txt')).toBe(true);
    expect(fs.existsSync('/tmp/.fsutil/copy/template')).toBe(false);

    // Second copy will append template
    fsutil.copyFolderRecursiveSync('/tmp/.fsutil/template', '/tmp/.fsutil/copy');
    expect(fs.existsSync('/tmp/.fsutil/copy/template/filea.txt')).toBe(true);
    expect(fs.existsSync('/tmp/.fsutil/copy/template/fileb.txt')).toBe(true);

    // Remove
    fsutil.removeDirectoryRecursive('/tmp/.fsutil/copy');
    expect(fs.existsSync('/tmp/.fsutil/copy')).toBe(false);
});

test('Test get directories', () => {
    fsutil.makeDirectory('/tmp/.fsutil/folder');
    expect(fsutil.getDirectories('/tmp/.fsutil')).toEqual(['folder', 'template']);
});

test('Test get files', () => {
    expect(fsutil.getFiles('/tmp/.fsutil/template')).toEqual(['filea.txt', 'fileb.txt']);
});

