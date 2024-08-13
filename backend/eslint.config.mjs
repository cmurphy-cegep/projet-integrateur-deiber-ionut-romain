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
			"max-lines": "error",
			"max-lines-per-function": "error",
			"max-nested-callbacks": "error",
			"max-params": ["error", 4],
			"max-statements": "error",
			"no-var": "error",
			"eqeqeq": "error",
			"no-console": "error"
		}
	}
];