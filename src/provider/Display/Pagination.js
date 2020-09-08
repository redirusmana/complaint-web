import React from 'react';
import PropTypes from 'prop-types';

const isActive = (index, currentPage) => (index === currentPage ? 'page-item active' : 'page-item');
const isDisabled = (targetPage, currentPage, totalItem) => {
  const minTargetPage = targetPage > 0 ? targetPage : 1;
  return minTargetPage === currentPage || totalItem < 1 ? 'page-item disabled' : 'page-item';
};

const withinRangePage = ({ currentPage, checkPage, maxPage, limit = 5 }) => {
  const halfLimit = Math.ceil(limit / 2);
  if (checkPage > currentPage - halfLimit && checkPage < currentPage + halfLimit) {
    return true;
  }

  if (checkPage <= limit && currentPage <= halfLimit) {
    return true;
  }

  if (checkPage > maxPage - limit && currentPage > maxPage - halfLimit) {
    return true;
  }

  return false;
};

const Pagination = ({ name, shortStat, currentPage, totalPage, maxItem, handleClick, totalItem, maxNumberShow }) => (
  <div className="pagination">
    <div className="pagination-nav">
      <div className={isDisabled(1, currentPage, totalItem)}>
        <button
          className="page-link page-icon"
          type="button"
          onClick={() => handleClick(1)}
          disabled={currentPage === 1 || totalItem < 1}
          title="Show initial page"
        >
          <i className="la la-angle-double-left" />
        </button>
      </div>
      <div className={isDisabled(1, currentPage, totalItem)}>
        <button
          className="page-link page-icon"
          type="button"
          disabled={currentPage === 1 || totalItem < 1}
          onClick={() => handleClick(currentPage - 1)}
          title="Previous page"
        >
          <i className="la la-angle-left" />
        </button>
      </div>
      {Array.from(
        { length: totalPage },
        (value, index) =>
          withinRangePage({
            currentPage,
            checkPage: index + 1,
            maxPage: totalPage,
            limit: maxNumberShow
          }) && (
            <div className={isActive(currentPage, index + 1)} key={`pagination-${name}-${index}`}>
              <button
                type="button"
                className="page-link"
                disabled={currentPage === index + 1 || totalItem < 1}
                onClick={() => handleClick(index + 1)}
              >
                <span>{index + 1}</span>
              </button>
            </div>
          )
      )}
      <div className={isDisabled(totalPage, currentPage, totalItem)}>
        <button
          type="button"
          className="page-link page-icon"
          disabled={currentPage >= totalPage || totalItem < 1}
          onClick={() => handleClick(currentPage + 1)}
          title="Next page"
        >
          <i className="la la-angle-right" />
        </button>
      </div>
      <div className={isDisabled(totalPage, currentPage, totalItem)}>
        <button
          type="button"
          className="page-link page-icon"
          disabled={currentPage >= totalPage || totalItem < 1}
          onClick={() => handleClick(totalPage)}
          title="Last page"
        >
          <i className="la la-angle-double-right" />
        </button>
      </div>
    </div>
    <div className="pagination-stats">
      {shortStat ? (
        <span>
          {totalItem} records. Page {currentPage} / {totalPage}
        </span>
      ) : (
        <span>
          Displaying {currentPage > 0 ? (currentPage - 1) * maxItem + 1 : 0} {' - '}
          {currentPage * maxItem > totalItem ? totalItem : currentPage * maxItem}
          {' of '}
          {totalItem} records. Page {currentPage} / {totalPage}
        </span>
      )}
    </div>
  </div>
);

Pagination.propTypes = {
  name: PropTypes.string.isRequired,
  currentPage: PropTypes.number,
  maxItem: PropTypes.number,
  totalItem: PropTypes.number,
  handleClick: PropTypes.func,
  totalPage: PropTypes.number,
  maxNumberShow: PropTypes.number,
  shortStat: PropTypes.bool
};

Pagination.defaultProps = {
  maxItem: 20,
  totalItem: 0,
  handleClick: () => {},
  totalPage: 1,
  maxNumberShow: 7,
  currentPage: 1,
  shortStat: false
};

export default Pagination;
