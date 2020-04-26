export const colors = {
    color1: "rgba(33,36,45,0.9)",
    color3: "rgba(33,36,45,1)",
    color2: "#ff5252",
    borderColor: "rgba(255,255,255,.3)",
    inputTextColor: "rgba(255,255,255,0.87)",
    textColor: "#fff",
    primaryButtonColor: "#ff5252",
    primaryButtonTextColor: "#fff"
}

export const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}