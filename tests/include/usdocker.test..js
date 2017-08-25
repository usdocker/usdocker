'use strict';

const usdocker = require('../../include/usdocker');
const fsutil = require('../../include/fsutil');

beforeEach(() => {
    process.env.USDOCKER_HOME = '/tmp';
});

afterEach(() => {
    process.env.USDOCKER_HOME = '';
    fsutil.removeDirectoryRecursive('/tmp/.usdocker');
});

test('Test config path', () => {
    expect(usdocker.config('script').path()).toBe('/tmp/.usdocker/setup/script/environment.json');
    expect(usdocker.configGlobal().path()).toBe('/tmp/.usdocker/setup/environment.json');
});

