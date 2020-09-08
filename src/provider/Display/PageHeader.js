import React from "react";
import PropTypes from "prop-types";

const PageHeaderWrapper = ({ showWrapper, children }) =>
  showWrapper ? (
    <div className="page-header-controls">{children}</div>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  );

const PageHeader = ({
  title,
  subtitle,
  showWrapper,
  children,
  titleTag: TitleTag
}) => (
  <PageHeaderWrapper showWrapper={showWrapper}>
    <div className="page-header">
      <TitleTag className="page-title">{title}</TitleTag>
      {subtitle && <div className="page-subtitle">{subtitle}</div>}
      {children}
    </div>
  </PageHeaderWrapper>
);

PageHeader.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.node
  ]).isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  showWrapper: PropTypes.bool,
  titleTag: PropTypes.string
};

PageHeader.defaultProps = {
  subtitle: "",
  showWrapper: false,
  titleTag: "h1"
};

export default PageHeader;
