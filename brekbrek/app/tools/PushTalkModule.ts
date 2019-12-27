import { NativeModules, NativeEventEmitter } from 'react-native';
// export default NativeModules.pushtalk;

const { pushtalk } = NativeModules;
const emitter = new NativeEventEmitter(pushtalk);

export default {
    // TODO: params check
    init: options => pushtalk.init(options),
    start: () => pushtalk.start(),
    pause: () => pushtalk.pause(),
    stop: () => pushtalk.stop(),
    addListener: listener => emitter.addListener('audioData', listener),
};