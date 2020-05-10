export const colors = {
  color1: '#232D36', //"rgba(33,36,45,0.9)",
  color2: '#2C363F',
  color3: '#C1C5C7',
  color4: '#313C42',
  borderColor: '#2C363F',
  activeBorderColor: '#00B09C',
  inputTextColor: 'rgba(255,255,255,0.87)',
  textColor: '#fff',
  primaryButtonColor: '#3390BB',
  primaryButtonTextColor: '#E8F9F7',
  headerTextColor: '#92969B',
  bodyBackground: '#101D25',
};

export const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};
