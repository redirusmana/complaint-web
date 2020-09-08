/* eslint-disable arrow-body-style */
import React from "react";
import { Collapse } from "reactstrap";
import moment from "moment";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import InputDate from "./InputDate";
import InputSelectLong from "./InputSelectLong";
import PageHeader from "../Display/PageHeader";
import InputAutoComplete from "./InputAutocomplete";

const FilterSelect = ({
  options,
  name,
  title,
  disabled,
  depends,
  handleChange,
  value
}) => {
  return (
    <div className="w-auto col-lg-6 mb-2">
      <label className="form-label" htmlFor={name}>
        {title}
      </label>
      <InputSelectLong
        id={name}
        className="w-100"
        name={name}
        options={options}
        placeholder={
          Array.isArray(depends) && disabled
            ? `Please select ${depends.join(", ")} first`
            : "All"
        }
        size="small"
        disabled={disabled}
        notFoundText={`${title} not found`}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};

const FilterDate = ({
  name,
  title,
  disabled,
  handleChange,
  value,
  depends,
  initialValue,
  isBlockAfterToday
}) => (
  <div className="w-auto col-lg-6 mb-1">
    <label className="form-label" htmlFor={name}>
      {title}
    </label>
    <InputDate
      id={name}
      name={name}
      size="small"
      disabled={disabled}
      placeholder={
        Array.isArray(depends) && disabled
          ? `Please Choose ${depends.join(", ")} First`
          : "Please Choose a Date"
      }
      handleChange={handleChange}
      value={value}
      initialValue={initialValue}
      isBlockAfterToday={isBlockAfterToday}
    />
  </div>
);

FilterDate.defaultProps = {
  isBlockAfterToday: true
};

const FilterAutoComplete = ({
  name,
  title,
  disabled,
  handleChange,
  initialValue,
  value,
  otherConfigs
}) => (
  <div className="w-auto col-lg-6 mb-1">
    <label className="form-label" htmlFor={name}>
      {title}
    </label>
    <InputAutoComplete
      id={name}
      name={name}
      disabled={disabled}
      handleChange={handleChange}
      defaultValue={value}
      initialValue={initialValue}
      size="small"
      placeholder={title}
      {...otherConfigs}
    />
  </div>
);

class FilterOptions extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpenCollapse: props.defaultOpenCollapse
    };
  }

  toggleCollapse = () => {
    const { isOpenCollapse } = this.state;
    this.setState({
      isOpenCollapse: !isOpenCollapse
    });
  };

  render() {
    const {
      id,
      configs,
      options,
      title,
      subtitle,
      queries,
      children,
      showInPageHeader,
      headerWrapper: HeaderWrapper
    } = this.props;
    const { isOpenCollapse } = this.state;
    return (
      <React.Fragment>
        {!showInPageHeader && typeof HeaderWrapper === "function" ? (
          <HeaderWrapper>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.toggleCollapse}
            >
              <i className="la la-filter" /> Filters
            </button>
            {children}
          </HeaderWrapper>
        ) : (
          <PageHeader title={title} subtitle={subtitle}>
            <div className="page-options d-flex">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.toggleCollapse}
              >
                <i className="la la-filter" /> Filters
              </button>
              {children}
            </div>
          </PageHeader>
        )}
        <div className="row">
          <div className="col">
            <Collapse isOpen={isOpenCollapse}>
              <div className="filter-container bg-white">
                <div className="row">
                  {typeof options === "object" &&
                    configs.map(config => {
                      const {
                        type,
                        key,
                        title: configTitle,
                        ...restConfig
                      } = config;
                      const componentKey = `${id}-${key}`;

                      let disabled = config.disabled || false;
                      if (Array.isArray(config.depends)) {
                        disabled =
                          config.depends.filter(
                            it =>
                              (typeof queries[it] !== "number" &&
                                isEmpty(queries[it])) ||
                              (typeof queries[it] === "number" &&
                                queries[it] === 0)
                          ).length > 0;
                      }

                      if (
                        type === "select" &&
                        typeof options[config.key] !== "undefined"
                      ) {
                        return (
                          <FilterSelect
                            key={componentKey}
                            name={componentKey}
                            title={configTitle}
                            options={
                              Array.isArray(config.depends)
                                ? options[config.key].filter(
                                    option =>
                                      config.depends.filter(
                                        item => option.depends === queries[item]
                                      ).length > 0
                                  )
                                : options[config.key]
                            }
                            disabled={disabled}
                            depends={config.depends}
                            handleChange={value =>
                              this.props.onFilterChange(config.key, value)
                            }
                            value={queries[config.key]}
                          />
                        );
                      }

                      if (config.type === "datepicker") {
                        return (
                          <FilterDate
                            key={componentKey}
                            name={componentKey}
                            initialValue={options[config.key]}
                            title={config.title}
                            disabled={disabled}
                            depends={config.depends}
                            handleChange={value => {
                              if (!value) {
                                return this.props.onFilterChange(
                                  config.key,
                                  undefined
                                );
                              }
                              return this.props.onFilterChange(
                                config.key,
                                value.format("YYYY-MM-DD")
                              );
                            }}
                            value={
                              queries[config.key]
                                ? moment(queries[config.key])
                                : undefined
                            }
                            isBlockAfterToday={config.isBlockAfterToday}
                          />
                        );
                      }

                      if (config.type === "autocomplete") {
                        return (
                          <FilterAutoComplete
                            key={componentKey}
                            name={componentKey}
                            initialValue={options[config.key]}
                            title={config.title}
                            disabled={!!config.depends}
                            handleChange={value =>
                              this.props.onFilterChange(config.key, value)
                            }
                            value={queries[config.key]}
                            otherConfigs={restConfig}
                          />
                        );
                      }
                      return null;
                    })}
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

FilterOptions.propTypes = {
  id: PropTypes.string,
  configs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  options: PropTypes.shape({}),
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element
  ]),
  onFilterChange: PropTypes.func,
  defaultOpenCollapse: PropTypes.bool,
  showInPageHeader: PropTypes.bool
};

FilterOptions.defaultProps = {
  id: "filter",
  subtitle: "",
  options: {},
  onFilterChange: () => {},
  defaultOpenCollapse: true,
  showInPageHeader: true
};

export default FilterOptions;
