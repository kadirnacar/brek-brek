// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: [
//     [
//       {
//         root: ["./src"],
//         alias: {
//           "@screens": "./src/screens",
//           "@navigation": "./src/navigation"
//         }
//       }
//     ]
//   ]
// };

module.exports = function (api) {
  api.cache(false);
  return {
    presets: ["module:metro-react-native-babel-preset"],
    // plugins: [
    //   [
    //     'module-resolver',
    //     {
    //       alias: {
    //         "@screens": "./src/screens",
    //         "@navigation": "./src/navigation",
    //         "@components": "./src/components",
    //         "@models": "./src/models",
    //         "@reducers": "./src/reducers",
    //         "@services": "./src/services",
    //         "@store": "./src/store/",
    //         "@config": "./src/config.ts",
    //         "@utils": "./src/utils.ts",
    //         "@tools": "./src/tools",
    //       }
    //     }
    //   ]
    // ]
  };
};