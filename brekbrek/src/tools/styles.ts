import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
    input: {
        borderColor: colors.borderColor,
        borderWidth: 1,
        color: colors.inputTextColor,
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 10,
        fontSize: 20,
        marginBottom: 20,
    },
    text: {
        fontSize: 20,
        color: colors.textColor,
    },
    primaryButton: {
        alignContent: "center",
        // textAlign: "center",
        alignItems: "center",
        backgroundColor: colors.primaryButtonColor,
        marginBottom: 20,
        borderRadius: 10,
        padding: 10
    },
    primaryButtonText: {
        color: colors.primaryButtonTextColor,
        fontSize: 20,
        fontWeight: "bold"
    }
});