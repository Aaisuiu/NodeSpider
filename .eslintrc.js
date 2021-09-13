module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ['airbnb'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        curly: 'off',
        camelcase: 'off',
        'no-case-declarations': 'off',
        semi: ['error', 'always'],
        'comma-dangle': ['error', 'only-multiline'],
        'space-before-function-paren': 'off',
        yoda: 'off',
        "no-magic-numbers": ["error", {
            "ignoreArrayIndexes": true,  //  排除数组下标报错
            "ignore": [0, 1],   // 排除二进制
             "enforceConst": true   // 必须const声明常量， 一般大写
        }]
    },
    
};
