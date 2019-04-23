module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended", "plugin:import/recommended","airbnb"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "experimentalObjectRestSpread": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
    ],
    "rules": {
        "linebreak-style": [0 ,"error", "windows"],
        "parser": "babel-eslint",
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/prefer-stateless-function": [0],
        "amd-imports/rule-name": 2,
        "quotes": ["error", "double"],
        "class-methods-use-this": [0],
        "react/prop-types":[0],
        "react/jsx-one-expression-per-line":[0],
        'jsx-a11y/click-events-have-key-events':[0],
        'jsx-a11y/no-static-element-interactions':[0],
        "amd-imports/rule-name":[0]
    }
};