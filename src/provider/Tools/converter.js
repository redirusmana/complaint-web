// eslint-disable-next-line import/prefer-default-export
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import bigint from "big-integer";
import numeral from "numeral";

moment.locale("id");

numeral.register("locale", "idFiles", {
  delimiters: {
    thousands: ",",
    decimal: "."
  },
  abbreviations: {
    hundred: " B",
    thousand: " KB",
    million: " MB",
    billion: " GB",
    trillion: " TB"
  },
  currency: {
    symbol: ""
  }
});

export const getInitial = name => {
  if (!name) {
    return "";
  }

  if (typeof name === "number") {
    // return `....`;
    return `+${name}`;
    // return `${name}`;
  }

  let initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  return initials;
};

export const stringToNumber = (number = 0) => {
  if (typeof number === "string") {
    if (number.includes(".")) {
      const num = parseFloat(number);
      return bigint(num);
    }
    return bigint(number);
  }
  return number;
};

export const numberToPercentage = (number = 0, showDecimal = true) => {
  numeral.locale("id");
  if (typeof number === "number") {
    return showDecimal
      ? numeral(number).format("0.00")
      : numeral(number).format("0");
  }
  if (typeof number === "string") {
    const formatted = stringToNumber(number);
    return showDecimal
      ? numeral(formatted).format("0.00")
      : numeral(formatted).format("0");
  }

  return "-";
};
export const numberToFileSize = (number = 0) => {
  numeral.locale("idFiles");
  return numeral(number).format("0.0 b");
};

export const dateFromNowString = date =>
  moment(date)
    .locale("en")
    .fromNow();
export const dateFullString = date => moment(date).format("DD MMMM YYYY");
export const dateShortString = date => moment(date).format("DD MMM YYYY");
export const dateNoYearString = date => moment(date).format("DD MMM");
export const dateYearString = date => moment(date).format("YYYY");
export const dateShortTimeString = date =>
  moment(date).format("DD MMM 'YY, HH:mm");

export const AXIOS_CANCEL_MESSAGE = "Axios Cancelled";

export const axiosError = e => {
  if (axios.isCancel(e)) {
    return AXIOS_CANCEL_MESSAGE;
  }
  const { message, response, request: eRequest } = e;
  // let error = message;
  // if (response) {
  //   error =
  //     typeof response.data.error !== "undefined"
  //       ? response.data.error
  //       : message;
  // } else if (eRequest) {
  //   error = typeof eRequest === "object" ? JSON.stringify(eRequest) : eRequest;
  // }

  let error = message;
  if (response) {
    if (response.data.error) {
      // eslint-disable-next-line prefer-destructuring
      error = response.data.error;
    } else if (response.data.message) {
      error = response.data.message;
    }
  } else if (eRequest) {
    error = typeof eRequest === "object" ? JSON.stringify(eRequest) : eRequest;
  }

  return error;
};
