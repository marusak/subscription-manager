/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2016 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

var cockpit = require("cockpit");
var _ = cockpit.gettext;

var React = require("react");
import {
    Checkbox,
    Form, FormGroup, FormSelect, FormSelectOption,
    Radio, TextInput,
} from '@patternfly/react-core';

import subscriptionsClient from './subscriptions-client';
import * as Insights from './insights.jsx';

/* Subscriptions: registration dialog body
 * Expected props:
 *   - onChange  callback to signal when the data has changed
 *   - properties as in defaultRegisterDialogSettings()
 */
class SubscriptionsRegister extends React.Component {
    render() {
        let proxy;
        if (this.props.proxy) {
            proxy = (
                <>
                    <FormGroup fieldId="subscription-proxy-server" label={_("Proxy location")}>
                        <TextInput id="subscription-proxy-server"
                                   value={this.props.proxy_server}
                                   onChange={value => this.props.onChange('proxy_server', value)} />
                    </FormGroup>
                    <FormGroup fieldId="subscription-proxy-user" label={_("Proxy username")}>
                        <TextInput id="subscription-proxy-user"
                                   value={this.props.proxy_user}
                                   onChange={value => this.props.onChange('proxy_user', value)} />
                    </FormGroup>
                    <FormGroup fieldId="subscription-proxy-password" label={_("Proxy password")}>
                        <TextInput id="subscription-proxy-password"
                                   value={this.props.proxy_password}
                                   onChange={value => this.props.onChange('proxy_password', value)} />
                    </FormGroup>
                </>
            );
        }

        let insights_checkbox_disabled = true;
        if (this.props.insights_available === true) {
            insights_checkbox_disabled = false;
        } else {
            if (this.props.auto_attach === true) {
                insights_checkbox_disabled = false;
            }
        }

        let credentials;
        if (this.props.register_method === "account") {
            credentials = (
                <>
                    <FormGroup fieldId="subscription-register-username" label={_("Username")}>
                        <TextInput id="subscription-register-username"
                                   value={this.props.user}
                                   onChange={value => this.props.onChange('user', value)} />
                    </FormGroup>
                    <FormGroup fieldId="subscription-register-password" label={_("Password")}>
                        <TextInput id="subscription-register-password"
                                   value={this.props.password}
                                   onChange={value => this.props.onChange('password', value)} />
                    </FormGroup>
                    <FormGroup fieldId="subscription-register-org" label={_("Organization")}>
                        <TextInput id="subscription-register-org"
                                   value={this.props.org}
                                   onChange={value => this.props.onChange('org', value)} />
                    </FormGroup>
                </>
            );
        } else {
            credentials = (
                <>
                    <FormGroup fieldId="subscription-register-key" label={_("Activation key")}>
                        <TextInput id="subscription-register-key"
                                   value={this.props.activation_keys}
                                   onChange={value => this.props.onChange('activation_keys', value)} />
                    </FormGroup>
                    <FormGroup fieldId="subscription-register-org" label={_("Organization")}>
                        <TextInput id="subscription-register-org"
                                   value={this.props.org}
                                   onChange={value => this.props.onChange('org', value)} />
                    </FormGroup>
                </>
            );
        }

        return (
            <div className="modal-body">
                <Form isHorizontal>
                    <FormGroup fieldId="subscription-register-url" label={_("URL")} hasNoPaddingTop>
                        <Checkbox id="subscription-register-url"
                                  isChecked={this.props.url === "custom"}
                                  label={_("Custom URL")}
                                  onChange={value => this.props.onChange('url', value ? "custom" : "default")}
                                  body={this.props.url === 'custom' && <TextInput id="subscription-register-url-custom"
                                                                                  value={this.props.server_url}
                                                                                  onChange={value => this.props.onChange('server_url', value)} />}
                        />
                    </FormGroup>
                    <FormGroup fieldId="subscription-proxy-use" label={_("Proxy server")} hasNoPaddingTop>
                        <Checkbox id="subscription-proxy-use"
                                  isChecked={this.props.proxy}
                                  label={_("Use proxy server")}
                                  onChange={value => this.props.onChange('proxy', value)}
                                  body={proxy}
                        />
                    </FormGroup>
                    <FormGroup fieldId="subscription-register-method" label={_("Method")} isInline hasNoPaddingTop>
                        <Radio id="subscription-register-account-method" value="account"
                           name="subscription-register-account-method"
                           label="Account"
                           isChecked={this.props.register_method === 'account'}
                           onChange={() => {this.props.onChange('register_method', 'account');}} />
                        <Radio id="subscription-register-activation-key-method" value="activation-key"
                           name="subscription-register-activation-key-method"
                           label="Activation key"
                           isChecked={this.props.register_method === 'activation-key'}
                           onChange={() => this.props.onChange('register_method', 'activation-key')} />
                        { credentials }
                    </FormGroup>
                    <FormGroup fieldId="subscription-auto-attach-use" label={_("Subscriptions")} hasNoPaddingTop>
                        <Checkbox id="subscription-auto-attach-use"
                                  isChecked={this.props.auto_attach}
                                  label={_("Attach automatically")}
                                  onChange={value => this.props.onChange('auto_attach', value)} />
                    </FormGroup>
                    <FormGroup fieldId="subscription-insights" label={_("Insights")} hasNoPaddingTop>
                        <Checkbox id="subscription-insights"
                                  isChecked={this.props.insights} isDisabled={insights_checkbox_disabled}
                                  label={Insights.arrfmt(_("Connect this system to $0."), Insights.link)}
                                  onChange={value => this.props.onChange('insights', value)}
                                  body={(this.props.insights && !this.props.insights_detected) ? <p>{ Insights.arrfmt(_("The $0 package will be installed."), <strong>{subscriptionsClient.insightsPackage}</strong>)}</p> : null }
                        />
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default SubscriptionsRegister;
