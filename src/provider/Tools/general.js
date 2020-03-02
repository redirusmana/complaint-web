export const CLIENT_NAME = process.env.REACT_APP_NAME;
export const CLIENT_TARGET = process.env.REACT_APP_TARGET;

const generateConfig = () => {
  let backendUrl; // = process.env.REACT_APP_DEFAULT_BACKEND;
  let socketUrl; // = process.env.REACT_APP_DEFAULT_SOCKET_URL;
  let socketPath; // = process.env.REACT_APP_DEFAULT_SOCKET_PATH;
  let routeBase; // = process.env.REACT_APP_DEFAULT_ROUTE_BASE;

  // Dont forget to check .htaccess to match 'routeBase' path so it shouldbe '{routeBase}index.html'
  switch (CLIENT_TARGET) {
    case "development":
      backendUrl = process.env.REACT_APP_DEFAULT_BACKEND;
      socketUrl = process.env.REACT_APP_DEFAULT_SOCKET_URL;
      socketPath = process.env.REACT_APP_DEFAULT_SOCKET_PATH;
      routeBase = process.env.REACT_APP_DEFAULT_ROUTE_BASE;
      break;
    default:
      break;
  }

  return {
    backendUrl,
    socketUrl,
    socketPath,
    routeBase
  };
};

const { socketPath, socketUrl, backendUrl, routeBase } = generateConfig();

export const CLIENT_API = backendUrl;
export const CLIENT_ROUTE_BASE = routeBase;
export const SOCKET_URL = socketUrl;
export const SOCKET_PATH = socketPath;

export const isDevelopment = process.env.NODE_ENV === "development";

// export const assetsApiUrl = url => {
//   return `${url}`;
// };

export const assetsApiUrl = url => {
  if (!url) {
    return undefined;
  }
  if (url.includes(CLIENT_API)) {
    return url;
  }
  return `${CLIENT_API}/${url}`;
};
