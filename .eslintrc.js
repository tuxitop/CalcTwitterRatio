var OFF = 0, WARN = 1, ERROR = 2;

module.exports = exports = {
    "env": {
        "es6": true,
        "node": true
    },

    "ecmaFeatures": {
        // env=es6 doesn't include modules, which we are using
        "modules": true
    },

    "extends": "eslint:recommended",

    'rules': {
        'indent': [ERROR, 4],
        'semi': [ERROR, "always"],
        'quotes': [ERROR, "single"],
        'linebreak-style': [ERROR, 'unix'],
        'no-console': OFF,
        'global-require': ERROR,
    },
};
