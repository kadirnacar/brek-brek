import { Avatar, Divider, Drawer, List, Theme } from "@material-ui/core";
import { ApplicationState } from "@store";
import * as React from "react";
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import AppMenu from "./menu";

interface SidebarProps {
  isOpen: boolean;
  theme: Theme;
  width: number;
}

type Props = RouteComponentProps & SidebarProps;

export class SidebarComponent extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.onSidebarClick = this.onSidebarClick.bind(this);
  }

  layoutMenuScroller: any;

  onSidebarClick(event) {

  }

  render() {
    let menu = [
      { label: "Anasayfa", icon: "fa fa-home", url: "/", items: null },
    ];

    return (
      <Drawer
        variant="permanent"
        open={this.props.isOpen}
        style={{
          width: this.props.width,
          transition: this.props.theme.transitions.create('width', {
            easing: this.props.theme.transitions.easing.sharp,
            duration: this.props.theme.transitions.duration.leavingScreen,
          })
        }}
        PaperProps={{
          style: {
            backgroundColor: '#424242',
            color: "#fff",
            width: this.props.width,
            transition: this.props.theme.transitions.create('width', {
              easing: this.props.theme.transitions.easing.sharp,
              duration: this.props.theme.transitions.duration.leavingScreen,
            })
          }
        }}
      >
        <Avatar variant="square" style={{ width: "100%", height: 100 }}
          imgProps={{
            style: { height: 60, objectFit: "contain" }
          }}
          src="assets/layout/images/atso.png" />
        <Divider />

        <Scrollbars>
          <List>
            <div>
              <AppMenu model={menu} parentIndex={0} />
            </div>
          </List>
        </Scrollbars>
      </Drawer>
    );
  }
}

export const Sidebar = withRouter(
  connect(
    (state: ApplicationState) => state,
    {}
  )(SidebarComponent)
) as any;
