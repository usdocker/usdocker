const showdocs = require('../../include/showdocs');
const path = require('path');

beforeEach(() => {
});

afterEach(() => {
});

test('showdocs test 1', () => {
    let docs = showdocs.getDocumentation(path.join(__dirname, 'mockdir'), 'justfortest.txt');
    expect(docs).toBe('# Header 1\n\ntest');
});



test('showdocs fail 1', () => {
    expect(() => {
        showdocs.getDocumentation(path.join(__dirname, 'does-not-exists'), 'justfortest.txt');
    }).toThrow();
});


