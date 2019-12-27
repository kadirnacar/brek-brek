import AsyncStorage from "@react-native-community/async-storage";

export const loadState = async () => {
  try {
    const serializedState = await AsyncStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return null;
  }
};

export const saveState = async state => {
  try {
    const serializedState = JSON.stringify(state);
    await AsyncStorage.setItem("state", serializedState);
  } catch {
    // ignore write errors
  }
};

export const getItem = async (name) => {
  try {
    const serializedState = await AsyncStorage.getItem(name);
    return !serializedState || serializedState == "null" ? null : serializedState;
  } catch (err) {
    return null;
  }
};

export const setItem = async (name, value) => {
  try {
    await AsyncStorage.setItem(name, value);
  } catch (err) {
  }
};


export const removeItem = async (name) => {
  try {
    await AsyncStorage.removeItem(name);
  } catch (err) {
  }
};
