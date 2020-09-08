import React from "react";
import debounce from "lodash/debounce";
import Autocomplete from "antd/lib/auto-complete";
import api from "../Tools/api";
import { axiosError, AXIOS_CANCEL_MESSAGE } from "../Tools/converter";
import alertFloat from "../Display/alertFloat";

class InputAutoComplete extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: props.initialDataSource,
      value: props.defaultValue
    };

    this.lastSearch = 0;
    this.delaySearch = debounce(this.delaySearch, 400);
  }

  componentWillUnmount() {
    if (typeof this._requestSource !== "undefined") {
      this._requestSource.cancel();
    }
  }

  delaySearch = value => {
    this.lastSearch += 1;
    // eslint-disable-next-line prefer-destructuring
    const lastSearch = this.lastSearch;
    this.handleSearch(value, lastSearch);
  };

  handleChange = newValue => {
    this.setState(
      {
        value: newValue
      },
      () => {
        if (
          (newValue === "" || typeof newValue === "undefined") &&
          typeof this.props.handleChange === "function"
        ) {
          this.props.handleChange(newValue);
        }
      }
    );
  };

  handleSearch = async (value, lastSearch) => {
    if (lastSearch !== this.lastSearch) {
      return;
    }
    const { useRequest, onSearchChange } = this.props;
    let result;
    if (useRequest) {
      result = await this.handleSearchRequest(value);
    } else if (typeof onSearchChange === "function") {
      result = onSearchChange(value);
    }

    if (Array.isArray(result)) {
      const slicedResult = result.lengt > 50 ? result.slice(0, 50) : result;
      this.setState(
        {
          dataSource: slicedResult
        },
        () => {
          const { changeOnSearch, handleChange } = this.props;
          if (changeOnSearch && typeof handleChange === "function") {
            handleChange(value);
          }
        }
      );
    }
  };

  handleSearchRequest = async value => {
    try {
      const { fetchUrl, fetchParamKey, otherParams } = this.props;
      this._requestSource = api.generateCancelToken();
      const { data } = await api.get(fetchUrl, this._requestSource.token, {
        params: {
          ...otherParams,
          [fetchParamKey]: value
        }
      });
      return data;
    } catch (e) {
      const error = axiosError(e);
      if (error !== AXIOS_CANCEL_MESSAGE) {
        alertFloat({
          type: "error",
          content: error
        });
      }
      return null;
    }
  };

  handleSelect = value => {
    this.setState(
      {
        value
      },
      () => {
        const { changeOnSelect, handleChange } = this.props;
        if (changeOnSelect && typeof handleChange === "function") {
          handleChange(value);
        }
      }
    );
  };

  render() {
    const { value, dataSource } = this.state;
    const { size, placeholder, parseDataSource } = this.props;
    return (
      <Autocomplete
        size={size}
        value={value}
        dataSource={parseDataSource(dataSource)}
        onSearch={this.delaySearch}
        onSelect={this.handleSelect}
        onChange={this.handleChange}
        placeholder={placeholder}
        allowClear
      >
        <input type="text" />
      </Autocomplete>
    );
  }
}

InputAutoComplete.defaultProps = {
  initialDataSource: [],
  useRequest: false,
  size: "default",
  placeholder: "",
  changeOnSearch: true,
  changeOnSelect: true,
  handleChange: () => {},
  parseDataSource: dataSource => dataSource
};

export default InputAutoComplete;
