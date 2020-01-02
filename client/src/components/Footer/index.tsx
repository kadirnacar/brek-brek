import * as React from 'react';
import { Container, Typography } from '@material-ui/core';
import { Copyright } from '@material-ui/icons';

export class Footer extends React.Component<any, any>{
    constructor(props) {
        super(props);
    }
    render() {
        return <footer style={{
            backgroundColor: '#4c4c4c',
        }}>
            <Container maxWidth="sm">
                <Typography variant="body1">Bengsoft <Copyright /> </Typography>
            </Container>
        </footer>
    }
}
export default Footer;