import React, { Component } from 'react'
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
const NumberFormatCustom = (props) => {
    const { inputRef, prefix, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                        name: other.name
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix={prefix}
        />
    );
}
class NumberField extends Component<any, any> {
    render() {
        const { decimalScale, fixedDecimalScale, ...others } = this.props;
        return (
            <TextField
                {...others}
                InputProps={{
                    inputComponent: NumberFormatCustom
                }}
            />
        )
    }
}

export default NumberField
