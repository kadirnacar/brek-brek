import { ApplicationState } from "@store";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AuthActions, AuthState } from "@reducers";
import { bindActionCreators } from "redux";
import { AppBar, Toolbar, IconButton, Typography, Theme } from "@material-ui/core";
import { Menu, ExitToApp } from '@material-ui/icons';

interface TopbarProps extends ApplicationState {
  onToggleMenu: (event: any) => void;
  theme: Theme;
  left: number;
}

type Props = { AuthActions: typeof AuthActions } & TopbarProps &
  RouteComponentProps;

class TopbarComponent extends React.Component<Props, any> {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <AppBar position="fixed" color="secondary" style={
        {
          marginLeft: this.props.left,
          width: `calc(100% - ${this.props.left}px)`,
          transition: this.props.theme.transitions.create(['width', 'margin'], {
            easing: this.props.theme.transitions.easing.sharp,
            duration: this.props.theme.transitions.duration.enteringScreen,
          })
        }
      }>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.props.onToggleMenu}>
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>Brek Brek</Typography>
          <IconButton color="inherit" onClick={async () => { await this.props.AuthActions.logout(); this.props.history.push('/login')}}>
            <ExitToApp />
          </IconButton> 
        </Toolbar>
      </AppBar>
    );
  }
}

export const Topbar = withRouter(
  connect(
    (state: ApplicationState) => state,
    dispatch => {
      return { AuthActions: bindActionCreators({ ...AuthActions }, dispatch) };
    }
  )(TopbarComponent)
) as any;
