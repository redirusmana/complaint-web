import React from "react";
import isEqual from "lodash/isEqual";
import { axiosError, AXIOS_CANCEL_MESSAGE } from "./converter";
import api from "./api";
import LoadingCard from "../Display/LoadingCard";
import Alert from "../Display/Alert";

class FetchResource extends React.PureComponent {
  constructor(props) {
    super(props);

    let initialDataSource;
    if (props.resultType === "array") {
      initialDataSource = [];
    } else if (props.resultType === "object") {
      initialDataSource = {};
    }
    this.state = {
      dataSource: initialDataSource,
      loading: false,
      error: ""
    };

    this.loadSourceInit = this.loadSourceInit.bind(this);
    this.loadSourceStart = this.loadSourceStart.bind(this);
  }

  componentDidMount() {
    this.loadSourceInit();
  }

  componentDidUpdate(prevProps) {
    const isDifferentUrl = !isEqual(prevProps.dataUrl, this.props.dataUrl);
    const isDifferentParams = !isEqual(
      prevProps.queryParams,
      this.props.queryParams
    );
    if (isDifferentUrl || isDifferentParams) {
      this.loadSourceInit();
    }
  }

  componentWillUnmount() {
    if (typeof this._requestSource !== "undefined") {
      this._requestSource.cancel();
    }
  }

  loadSourceInit() {
    const { dataUrl } = this.props;
    if (dataUrl) {
      this.setState(
        {
          loading: true,
          error: ""
        },
        () => {
          this.loadSourceStart();
        }
      );
    }
  }

  async loadSourceStart() {
    try {
      const { dataUrl, queryParams, parseRequestData } = this.props;
      this._requestSource = api.generateCancelToken();
      const { data } = await api.get(dataUrl, this._requestSource.token, {
        params: queryParams
      });

      const dataSource = parseRequestData(data);
      this.setState({
        dataSource,
        loading: false
      });
    } catch (e) {
      const error = axiosError(e);
      if (error === AXIOS_CANCEL_MESSAGE) {
        return;
      }

      this.setState({
        loading: false,
        error
      });
    }
  }

  render() {
    const { loading, error } = this.state;
    const { isShowLoading, isShowError } = this.props;

    if (loading && isShowLoading) {
      return <LoadingCard />;
    }
    if (error && isShowError) {
      return <Alert type="error" message="Request error" description={error} />;
    }

    return this.props.render(this.state);
  }
}

FetchResource.defaultProps = {
  dataUrl: "",
  queryParams: {},
  parseRequestData: data => data,
  resultType: "array",
  isShowLoading: false,
  isShowError: false,
  render: () => null
};

export default FetchResource;
