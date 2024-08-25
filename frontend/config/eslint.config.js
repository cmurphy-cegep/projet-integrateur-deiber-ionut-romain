import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";


export default [
	{
		languageOptions: {
			globals: globals.node
		}
	},
	pluginJs.configs.recommended,
	...pluginVue.configs["flat/essential"],
	{
		files: ["src/**/*.{js,mjs,cjs,vue}"],
		rules: {
			"no-var": "error",
			"eqeqeq": "error",
			"no-shadow": "error",
			"no-eq-null": "error"
		}
	}

];