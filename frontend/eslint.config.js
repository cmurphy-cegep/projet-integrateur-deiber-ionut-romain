import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";


export default [
	{
		files: ["**/*.{js,mjs,cjs,vue}"]
	},
	{
		languageOptions: {
			globals: globals.node
		}
	},
	pluginJs.configs.recommended,
	...pluginVue.configs["flat/essential"],
	{
		rules: {
			"max-lines": "error",
			"no-var": "error",
			"eqeqeq": "error",
			"no-shadow": "error",
			"no-eq-null": "error"
		}
	}

];