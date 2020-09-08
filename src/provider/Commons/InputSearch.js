import React from 'react';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

class InputSearch extends React.PureComponent {
  input = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      value: props.initialSearch
    };

    // this.onSearchChange = debounce(this.onSearchChange, props.delaySearch);
    this.delaySearch = debounce(this.sendSearchChange, props.delaySearch);
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.input.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialSearch !== this.props.initialSearch && this.props.initialSearch !== this.state.value) {
      this.setState({
        value: this.props.initialSearch
      });
    }

    if (this.props.autoFocus && this.state.value !== '') {
      this.input.current.focus();
    }
  }

  onSearchChange = value => {
    this.setState(
      {
        value
      },
      () => {
        this.delaySearch();
      }
    );
  };

  sendSearchChange = () => {
    if (typeof this.props.onSearchChange === 'function') {
      const { value } = this.state;
      this.props.onSearchChange(value);
    }
  };

  render() {
    const { placeholder, className } = this.props;
    const { value } = this.state;
    return (
      <div className={`input-icon ${className}`}>
        <input
          ref={this.input}
          type="search"
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={({ target }) => this.onSearchChange(target.value)}
        />
        <div className="input-icon-addon">
          <i className="flaticon-search-magnifier-interface-symbol" />
        </div>
      </div>
    );
  }
}

InputSearch.propTypes = {
  initialSearch: PropTypes.string,
  placeholder: PropTypes.string,
  onSearchChange: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  className: PropTypes.string,
  delaySearch: PropTypes.number,
  autoFocus: PropTypes.bool
};

InputSearch.defaultProps = {
  initialSearch: '',
  placeholder: 'Search',
  onSearchChange: false,
  className: '',
  delaySearch: 600,
  autoFocus: false
};

export default InputSearch;
