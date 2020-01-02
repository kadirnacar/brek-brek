import { Footer, Sidebar, Topbar } from "@components";
import { Container, Grid } from "@material-ui/core";
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { AuthActions } from "@reducers";
import DateFnsUtils from '@date-io/date-fns';
import Routes from "@routes";
import { ApplicationState } from "@store";
import * as React from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';



class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      sideBarToggle: false,
      isLogin: false
    };
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ sideBarToggle: window.innerWidth > 576 })
  }

  onToggleMenu(event) {
    this.setState({
      sideBarToggle: !this.state.sideBarToggle
    });
  }

  public render() {
    const theme = createMuiTheme({
      palette: {
        type: 'dark',
      },
      mixins: {
        toolbar: {
          minHeight: 48,
        }
      }
    });
    const authInfo = localStorage.getItem('user');
    const isLogin = authInfo != null;
    return (
      isLogin ?
        <React.Fragment>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Topbar onToggleMenu={this.onToggleMenu} theme={theme} left={this.state.sideBarToggle ? 240 : 0} />
            <Sidebar isOpen={this.state.sideBarToggle} theme={theme} width={this.state.sideBarToggle ? 240 : 0} />

            <main style={{
              flexGrow: 1,
              marginLeft: this.state.sideBarToggle ? 240 : 0,
              transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              display: 'flex',
              flexDirection: 'column',
              minHeight: "100%"
            }}>
              <div style={{ minHeight: 64 }} />

              <Container maxWidth="xl">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container spacing={2} >
                    {/* <Routes/> */}
                    {this.props.children}
                  </Grid>
                </MuiPickersUtilsProvider>
              </Container>
              {/* <Footer /> */}
            </main>
          </ThemeProvider>
        </React.Fragment>
        : this.props.children
    );
  }
}

export const component = withRouter(connect(
  (state: ApplicationState) => state.Auth,
  AuthActions
)(App as any) as any);
