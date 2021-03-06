/*
 *  Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';

import {Card, CardHeader, CardMedia} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentDelete from 'material-ui/svg-icons/action/delete';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const deleteBtnStyle = {
    color: ' #e74c3c'
};

const addBtnStyle = {
    display: 'inline-block',
    marginRight: 20,
    minWidth: 0,
    width: 0,
    verticalAlign: 'top',
    marginLeft: '30%'
};

const publishedAsValueStyle = {
    verticalAlign: 'middle',
    position: 'absolute',
    marginLeft: 10,
    marginRight: 10,
    width: '25%'
};

const h3Style = {
    marginLeft: 20,
    marginRight: 10,
    verticalAlign: 'top',
    display: 'inline-block'
};

const widgetInputsPaneStyle = {
    verticalAlign: 'middle',
    marginRight: 10,
    marginBottom: 15
};

const widgetInputsCardStyle = {
    padding: 10,
    marginTop: 10
};

class DataPublishingComponent extends Component {

    constructor(props) {
        super(props);
        this.handleDropDown = this.handleDropDown.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.addWidgetInput = this.addWidgetInput.bind(this);
        this.handlePublishedAs = this.handlePublishedAs.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.validatePublishingValues = this.validatePublishingValues.bind(this);
        this.state = {
            selectedKey: 0,
            selectedValue: this.props.outputAttributes[0],
            widgetOutputConfigs: [],
            selectedRow: [],
            errorTextField: "",
            expandAdvanced: false
        }
    }

    handleDropDown(event, index, value) {
        this.setState({selectedKey: index, selectedValue: value});
    }

    handleRowSelection(selectedRow) {
        this.setState({selectedRow: selectedRow});
    }

    validatePublishingValues() {
        let isPublishingValuesValid = true;
        if (!this.state.publishedAsValue || this.state.publishedAsValue === "") {
            isPublishingValuesValid = false;
            this.setState({
                errorTextField: <FormattedMessage id="data.publishingAsValue.error"
                                                  defaultMessage="The publishedAsValue cannot be empty"/>
            });
        } else {
            this.state.widgetOutputConfigs.map(outputAttribute => {
                if (outputAttribute.publishedAsValue === this.state.publishedAsValue) {
                    isPublishingValuesValid = false;
                    this.setState({
                        errorTextField: <FormattedMessage id="data.publishingAsValue.exists.error"
                                                          defaultMessage={'The value \'' +
                                                          this.state.publishedAsValue + '\' already exists'}/>
                    });
                }
            });
        }
        return isPublishingValuesValid;
    }

    addWidgetInput(event) {
        if (this.validatePublishingValues()) {
            this.state.widgetOutputConfigs.push({
                publishingValue: this.state.selectedValue,
                publishedAsValue: this.state.publishedAsValue
            });
            this.props.onConfigurationChange(this.state.widgetOutputConfigs);
            this.setState({widgetOutputConfigs: this.state.widgetOutputConfigs});
        }
    }

    handleDelete(event) {
        this.state.widgetOutputConfigs.splice(this.state.selectedRow[0], 1);
        this.setState({widgetOutputConfigs: this.state.widgetOutputConfigs, selectedRow: []});
    }

    handlePublishedAs(event, value) {
        this.state.publishedAsValue = value;
        this.setState({errorTextField: ''})
    }

    render() {
        let that = this;
        return (
            <Card
                style={widgetInputsCardStyle}
                expanded={this.state.expandAdvanced}
                onExpandChange={e => this.setState({expandAdvanced: e})}
            >
                <CardHeader title={<FormattedMessage id="data.publishingUI.title"
                                                     defaultMessage="Data Publishing Configuration"/>}
                            actAsExpander
                            showExpandableButton
                />
                <CardMedia expandable style={{paddingLeft: 15}}>
                    <div style={{marginTop: 15}}>
                        <div style={widgetInputsPaneStyle}>Add widget outputs</div>
                        <SelectField style={{width: '30%'}} key={this.state.selectedKey}
                                     value={this.state.selectedValue}
                                     onChange={this.handleDropDown}>
                            {this.props.outputAttributes.map((outputAttribute, key) => {
                                return <MenuItem key={key} value={outputAttribute} primaryText={outputAttribute}/>
                            })}
                        </SelectField>
                        <h3 style={h3Style}>As</h3>
                        <TextField
                            style={publishedAsValueStyle}
                            errorText={this.state.errorTextField}
                            onChange={this.handlePublishedAs}
                        />
                        <FloatingActionButton
                            mini={true}
                            style={addBtnStyle}
                            onClick={this.addWidgetInput}
                        >
                            <ContentAdd/>
                        </FloatingActionButton>
                        {this.state.widgetOutputConfigs.length !== 0 ?
                            <Paper style={{
                                marginTop: 10, marginBottom: 10
                            }}>
                                <Table onRowSelection={this.handleRowSelection}>
                                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                        <TableRow>
                                            <TableHeaderColumn>Publishing Value</TableHeaderColumn>
                                            <TableHeaderColumn>Published As</TableHeaderColumn>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody displayRowCheckbox={false} deselectOnClickaway={false}>
                                        {
                                            this.state.widgetOutputConfigs.map(function (outputAttribute, index) {
                                                return (
                                                    <TableRow
                                                        selected={that.state.selectedRow[0] === index}>
                                                        <TableRowColumn>
                                                            {outputAttribute.publishingValue}
                                                        </TableRowColumn>
                                                        <TableRowColumn>
                                                            {outputAttribute.publishedAsValue}
                                                        </TableRowColumn>
                                                    </TableRow>
                                                );
                                            })
                                        }
                                    </TableBody>
                                </Table>
                                {this.state.selectedRow.length !== 0 ?
                                    <FlatButton label={<FormattedMessage id="delete.selected.row"
                                                                         defaultMessage="Delete Selected Row"/>}
                                                primary
                                                style={deleteBtnStyle}
                                                icon={<ContentDelete/>}
                                                onClick={this.handleDelete}/> : ""
                                }
                            </Paper> : ""
                        }
                    </div>
                </CardMedia>
            </Card>
        );
    }

}

export default DataPublishingComponent;
