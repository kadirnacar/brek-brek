import { AuthActions } from "@reducers";
import { ApplicationState } from "@store";
import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Button, Grid, CssBaseline, Avatar, Typography, Link, FormControlLabel, Checkbox, Box, TextField, Paper } from "@material-ui/core";
import { withSnackbar, useSnackbar } from 'notistack';
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const styles = (theme) => createStyles({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(../../../assets/layout/images/forfoots-slider.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Login extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }


  handleUsername(event) {
    this.setState({ username: event.target.value });
  }

  handlePassword(event) {
    this.setState({ password: event.target.value });
  }

  async handleLogin(e) {
    e.preventDefault();
    const islogin: any = await this.props.AuthActions.login(
      this.state.username,
      this.state.password
    );
    if (islogin == true) {
      this.props.history.push("/");
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
          </Typography>
            <form className={classes.form} onSubmit={this.handleLogin}
              noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Username"
                onChange={this.handleUsername}
                autoComplete="Username"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                onChange={this.handlePassword}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                // onClick={this.handleLogin}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
            </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }
}

var component = withStyles(styles)(withRouter(connect(
  (state: ApplicationState) => state.Auth,
  dispatch => {
    return {
      AuthActions: bindActionCreators({ ...AuthActions }, dispatch)
    };
  }
)(withSnackbar(Login)) as any));

export default (component as any) as typeof Login;
