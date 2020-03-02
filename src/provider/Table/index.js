import React from 'react';
import PropTypes from 'prop-types';
import TableClient from './TableClient';
import TableServer from './TableServer';

const Table = ({ clientControl, ...restProps }) =>
  clientControl ? <TableClient {...restProps} /> : <TableServer {...restProps} />;

Table.propTypes = {
  clientControl: PropTypes.bool
};

Table.defaultProps = {
  clientControl: false
};

export default Table;
