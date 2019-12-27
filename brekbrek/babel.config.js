module.exports = function (api) {
  api.cache(false);
  return {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            "@screens": "./app/screens",
            "@navigation": "./app/navigation",
            "@components": "./app/components",
            "@models": "./app/models",
            "@reducers": "./app/reducers",
            "@services": "./app/services",
            "@store": "./app/store/",
            "@config": "./app/config.ts",
            "@utils": "./app/utils.ts",
            "@tools": "./app/tools",
          }
        }
      ]
    ]
  };
};
