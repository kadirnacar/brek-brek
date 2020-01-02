import * as React from 'react';
import { withRouter } from "react-router";
import AppSubmenu from './subMenu';

class AppMenu extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    onChangeLocation(event) {
        if(event.item && event.item.url){
            this.props.history.push(event.item.url);
        }
    }
    render() {
        return <AppSubmenu items={this.props.model}
                parentIndex={0}
                onChangeLocation={this.onChangeLocation.bind(this)}
                root={true} />
    }
}
export default withRouter(AppMenu);