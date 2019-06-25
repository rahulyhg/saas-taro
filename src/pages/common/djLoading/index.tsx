import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { djLoadingProps, djLoadingState } from "./index.interface";
import "./index.scss";
import xq1 from "../../../assets/images/djLoading/xq1.png";
import xq2 from "../../../assets/images/djLoading/xq2.png";

class DjLoading extends Component<djLoadingProps, djLoadingState> {
    config: Config = {
        navigationBarTitleText: ""
    };

    defaultProps = {
        isshow: false
    };

    constructor(props: djLoadingProps) {
        super(props);
        this.state = {
            index: 0,
            canShowDom: false,
        };
    }

    setTimeOutFunc:any
    intervalCount = 0
    djLoadingInterval: any;

    componentDidMount() {
        const { isshow } = this.props;
        this.intervalFun(isshow);
    }

    // 定时器封装
    intervalFun(_isshow) {
        this.djLoadingInterval = setInterval(() => {
            if (_isshow) {
                const { index } = this.state;
                this.setState({
                    index: index == 0 ? 1 : 0
                });
            } else {
                clearInterval(this.djLoadingInterval);
            }
        }, 300);
    }

    componentWillReceiveProps(nextProps) {
        const { isshow } = nextProps;
        if (isshow != this.props.isshow) {
            if (isshow) {
                this.setState({
                    canShowDom: false
                })

                this.setTimeOutFunc = setTimeout(() => {
                    this.setState({
                        canShowDom: true
                    })
                    this.intervalFun(isshow);
                }, 350) // 请求发起350豪秒后再显示loading
            } else {
                if(this.setTimeOutFunc) {
                    this.setState({
                        canShowDom: false
                    })
                    clearTimeout(this.setTimeOutFunc)
                }
                clearInterval(this.djLoadingInterval);
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.djLoadingInterval);
    }

    render() {
        const { index, canShowDom } = this.state;
        const showLoading = this.props.isshow && canShowDom ? 'block' : 'none'

        return (
            <View
                className="adLoading"
                style={{ display: showLoading }}
            >
                <View className="opacityCover" />
                <View className="loadingCover">
                    <Image
                        src={xq1}
                        className={`loadImg ${index == 0 ? "show" : "hide"}`}
                    />
                    <Image
                        src={xq2}
                        className={`loadImg ${index == 1 ? "show" : "hide"}`}
                    />
                    <View className="loading">努力加载中...</View>
                </View>
            </View>
        );
    }
}

export default DjLoading;
