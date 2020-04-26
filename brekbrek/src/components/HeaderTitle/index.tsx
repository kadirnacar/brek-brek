import React, { Component } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';

interface HeaderTitleState {
}

interface HeaderTitleProps {
    style?: StyleProp<TextStyle>;
}

type Props = HeaderTitleProps & ApplicationState;


class HeaderTitleComp extends Component<Props, HeaderTitleState> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Text style={[this.props.style, { color: "#fff", fontWeight: "bold", fontSize: 20 }]}>Brek Brek</Text>
        )
    }
}

export const HeaderTitle = connect(
    (state: ApplicationState) => state,
    dispatch => {
        return {
        };
    }
)(HeaderTitleComp);