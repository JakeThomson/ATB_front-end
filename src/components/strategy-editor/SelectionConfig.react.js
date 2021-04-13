import React, { Component } from 'react';
import '../../css/strategy-editor/selection-config.css';


class NumberForm extends Component {
    render() {
      return (
        <div  className="form-group px-1">
          <label htmlFor={this.props.id}>{this.props.label}</label>
          <input 
            form={this.props.method}
            className="form-control" 
            id={this.props.id}
            type="number"
            name={this.props.id} 
            value={this.props.value} 
            onChange={this.props.handleInputChange}
            required 
            autoComplete="off"
          />
        </div>
      )
  }
}

const MultiSelect = ({id, label, type, options}, value) => {
    return (
        <div className="form-group px-1">
            <label htmlFor={id}>{label}</label>
            <select className="form-control" id={id} name={id} >
                {options.map(option => <option value={value} key={id+"-"+option}>{option}</option>)}
            </select>
        </div>
    )
}

const UnrecognisedFormType = config => {
    return (
        <div>
            Unrecognised form type
        </div>
    )
}

class ConfigFormItem extends Component {
        
    formItems = {
        number: NumberForm,
        multiSelect: MultiSelect
    };

    render() {
        const FormItem = this.formItems[this.props.config.type] || UnrecognisedFormType;
        return <FormItem method={this.props.method} {...this.props.config} value={this.props.value} handleInputChange={this.props.handleInputChange} />
    }
}


class SelectionConfig extends Component {

  getModuleConfigData = (strategyData, configId, method) => {
    for(var i = 0; i < strategyData.length; i += 1) {
      if(strategyData[i].name === method) {
        return strategyData[i].config[configId];
      }
    }
    return undefined
  }

  render() {
    return (
      <div id="selection-config-container" className="container py-2 px-3">
        <h5 className="row col-12 strategy-editor-header">Configuration</h5>
        <div id="selection-config-editor-container">
          {this.props.configurationForms[this.props.selected]?.map(config => {
            const value = this.getModuleConfigData(this.props.strategyData, config.id, this.props.selected)
            return (
              <ConfigFormItem method={this.props.selected} config={config} value={value} key={config.id} handleInputChange={this.props.handleInputChange} />
            )
          })}
        </div>
      </div>
    )
  }
}

export default SelectionConfig;