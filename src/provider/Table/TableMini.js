import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Tooltip from "../Display/Tooltip";
import LoadingCard from "../Display/LoadingCard";
import { getUrlFromHref } from "../../utils/converter";

export const colorSet = [
  "#3F826D",
  "#8bcbc8",
  "#ecc7c0",
  "#fdae84",
  "#3c2e3d",
  "#e8edf3",
  "#e6cf8b",
  "#daad86",
  "#b56969",
  "#5a5c51",
  "#22264b",
  "#bcd5d1",
  "#89bdd3",
  "#9ad3de",
  "#98dafc"
];

const generateCellClass = className => {
  let cellClass = "";
  if (Array.isArray(className) && className.length > 0) {
    cellClass = className.map(cN => `chart-table-${cN}`).join(" ");
  } else {
    cellClass = `chart-table-${className}`;
  }
  return cellClass;
};

const TableRowWrapper = ({ record, onClickRow, children }) => {
  if (typeof onClickRow === "function") {
    return (
      <div
        className="chart-table-item"
        role="button"
        tabIndex={-1}
        onClick={() => onClickRow(record)}
        onKeyPress={() => onClickRow(record)}
      >
        {children}
      </div>
    );
  }

  if (
    typeof onClickRow === "object" &&
    typeof onClickRow.pathname !== "undefined"
  ) {
    const anchor = getUrlFromHref(onClickRow.pathname);
    return (
      <Link
        to={`${anchor.pathname}/${record[onClickRow.recordKey]}`}
        className="chart-table-item"
      >
        {children}
      </Link>
    );
  }

  return <div className="chart-table-item">{children}</div>;
};

const InnerTableMini = ({
  dataSource,
  formats,
  tableName,
  showNumber,
  onClickRow
}) => {
  if (dataSource.length === 0) {
    return (
      <TableRowWrapper>
        {formats.map(format => {
          if (format.className === "color") {
            return (
              <span
                className="chart-table-color"
                key={`table-mini-cell-${tableName}-empty-${format.key}`}
              />
            );
          }

          return (
            <span
              className={generateCellClass(format.className)}
              key={`table-mini-cell-${tableName}-empty-${format.key}`}
            >
              -
            </span>
          );
        })}
      </TableRowWrapper>
    );
  }

  const result = dataSource.map((datum, index) => (
    <TableRowWrapper
      onClickRow={onClickRow}
      record={datum}
      key={`table-mini-row-${tableName}-${index}`}
    >
      {showNumber && <span className="chart-table-percent">{index + 1}</span>}
      {formats.map(format => {
        if (format.className === "color") {
          return (
            <span
              className="chart-table-color"
              style={{ backgroundColor: colorSet[index] }}
              key={`table-mini-cell-${tableName}-${index}-${format.key}`}
            />
          );
        }

        if (format.className === "desc") {
          const tooltipKey =
            typeof format.tooltipKey !== "undefined"
              ? format.tooltipKey
              : format.key;
          return (
            <Tooltip
              key={`table-mini-cell-${tableName}-${index}-${format.key}`}
              placement="bottomLeft"
              title={datum[tooltipKey]}
            >
              <span className="chart-table-desc">{datum[format.key]}</span>
            </Tooltip>
          );
        }

        return (
          <span
            className={generateCellClass(format.className)}
            key={`table-mini-cell-${tableName}-${index}-${format.key}`}
          >
            {datum[format.key] || "-"}
          </span>
        );
      })}
    </TableRowWrapper>
  ));

  return <React.Fragment>{result}</React.Fragment>;
};

const TableMini = ({
  tableName,
  dataSource,
  formats,
  showNumber,
  showHeader,
  showLoading,
  isLoading,
  labelNumber,
  onClickRow,
  className,
  showTopHeader,
  topFormat
}) => (
  <div className={`chart-table-mini ${className}`}>
    {showTopHeader && (
      <div className="chart-table-item chart-table-header">
        {showNumber && <span className="chart-table-percent" />}
        {topFormat.map((format, indexFormat) => (
          <span
            className={`chart-table-${format.className}`}
            key={`${tableName}-table-top-header-${indexFormat}`}
          >
            {format.label}
          </span>
        ))}
      </div>
    )}
    {showHeader && (
      <div className="chart-table-item chart-table-header">
        {showNumber && (
          <span className="chart-table-percent">{labelNumber}</span>
        )}
        {formats.map(format => (
          <span
            className={`chart-table-${format.className}`}
            key={`${tableName}-table-header-${format.key}`}
          >
            {format.label}
          </span>
        ))}
      </div>
    )}
    {showLoading ? (
      <React.Fragment>
        {isLoading ? (
          <LoadingCard />
        ) : (
          <InnerTableMini
            dataSource={dataSource}
            formats={formats}
            showNumber={showNumber}
            tableName={tableName}
            onClickRow={onClickRow}
          />
        )}
      </React.Fragment>
    ) : (
      <InnerTableMini
        dataSource={dataSource}
        formats={formats}
        showNumber={showNumber}
        tableName={tableName}
        onClickRow={onClickRow}
      />
    )}
  </div>
);

TableMini.propTypes = {
  tableName: PropTypes.string.isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.shape({})),
  className: PropTypes.string,
  formats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      className: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string
      ]),
      key: PropTypes.string
    })
  ).isRequired,
  showHeader: PropTypes.bool,
  showNumber: PropTypes.bool,
  showTopHeader: PropTypes.bool,
  topFormat: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      className: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string
      ])
    })
  ),
  showLoading: PropTypes.bool,
  isLoading: PropTypes.bool,
  labelNumber: PropTypes.string,
  onClickRow: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
    PropTypes.shape({})
  ])
};

TableMini.defaultProps = {
  dataSource: [],
  className: "",
  showHeader: true,
  showNumber: false,
  showTopHeader: false,
  topFormat: [],
  showLoading: false,
  labelNumber: "No.",
  isLoading: false,
  onClickRow: false
};

export default TableMini;
