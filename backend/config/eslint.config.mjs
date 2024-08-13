import globals from "globals";
import pluginJs from "@eslint/js";


export default [
	{
		files: ["**/*.js"], languageOptions: {
			sourceType: "commonjs"
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest
			}
		}
	},
	pluginJs.configs.recommended,
	{
		rules: {
			"complexity": "error",
			"max-depth": "error",
			"max-nested-callbacks": "error",
			"max-params": ["error", 4],
			"no-var": "error",
			"eqeqeq": "error",
			"no-eq-null": "error",
			"no-duplicate-imports": "error",
			"no-inner-declarations": "error",
			"no-template-curly-in-string": "error",
			"no-unmodified-loop-condition": "error",
			"no-unreachable-loop": "error",
			"no-use-before-define": "error",
			"no-useless-assignment": "error",
			"require-atomic-updates": "error",
			"curly": "error",
			"no-bitwise": "error",
			"no-else-return": "error",
			"no-empty-function": "error",
			"no-lonely-if": "error",
			"no-negated-condition": "error",
			"no-shadow": "error",
			"no-throw-literal": "error",
			"no-undef-init": "error",
			"no-useless-return": "error",
			"no-warning-comments": "error",
			"prefer-const": "error",
			"require-await": "error",
			"vars-on-top": "error"
		}
	}
];