import * as React from 'react';
import classNames from 'classnames';
import { withRouter, RouteComponentProps } from "react-router";
import { ListItem, ListItemIcon, ListItemText, Icon, Collapse, List } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import AppSubmenuItem from './subMenuItem';

class AppSubmenu extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = { activeIndex: "", open: false };
    }

    onMenuItemClick(event, item, index) {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        //prevent hash change
        if (item.items || !item.url) {
            event.preventDefault();
            if (item.items.length > 0) {
                this.setState({ open: !this.state.open })
            }
            return;
        }



        if (index === this.state.activeIndex)
            this.setState({ activeIndex: null });
        else
            this.setState({ activeIndex: index });

        if (this.props.onChangeLocation) {
            this.props.onChangeLocation({
                originalEvent: event,
                item: item
            });
        }
    }

    render() {
        let items = this.props.items && this.props.items.map((item, i) => {
            return <AppSubmenuItem key={i} item={item} depth={this.props.depth} onChangeLocation={this.props.onChangeLocation.bind(this)} />
        });

        return items ? items : null;
    }
}

export default withRouter(AppSubmenu);