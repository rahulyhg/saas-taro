import Taro, { Component, Config } from "@tarojs/taro";
import "@tarojs/async-await";
import { Provider } from "@tarojs/redux";
import "./utils/request";
import Index from "./pages/index";
import dva from './utils/dva'
import models from './models'
import './assets/scss/custom-theme.scss'
import './app.scss'
import './assets/iconfont/iconfont.scss'
// import 'taro-ui/dist/style/index.scss';
import { globalData } from "./utils/common";

const dvaApp = dva.createApp({
	initialState: {},
	models: models,
});
const store = dvaApp.getStore();

class App extends Component {
	config: Config = {
		pages: [
			'pages/work/home/index',
			'pages/news/home/index',
			'pages/aiHelper/home/index',
			'pages/eco/home/index',
			'pages/user/home/index',

			'pages/news/newsDetail/index',
			'pages/common/userSinglePopView/userSinglePopView',
			'pages/common/orgSinglePopView/orgSinglePopView',
			'pages/common/orgPopView/orgPopView',
			'pages/common/userPopView/userPopView',
			'pages/index/index'
		],
		window: {
			backgroundTextStyle: 'light',
			navigationBarBackgroundColor: '#fff',
			navigationBarTitleText: 'WeChat',
			navigationBarTextStyle: 'black'
		},
		tabBar: {
			"color": "#666666",
			"selectedColor": "#e68478",
			"backgroundColor": "#ffffff",
			"position": "bottom",
			list: [
				{
					pagePath: "pages/work/home/index",
					text: "党务",
					iconPath: "./assets/images/foot_b.png",
					selectedIconPath: "./assets/images/foot_b_active.png"
				},
				{
					pagePath: "pages/news/home/index",
					text: "资讯",
					iconPath: "./assets/images/foot_a.png",
					selectedIconPath: "./assets/images/foot_a_active.png"
				},
				{
					pagePath: "pages/aiHelper/home/index",
					text: "小七",
					iconPath: "./assets/images/foot_c.png",
					selectedIconPath: "./assets/images/foot_c_active.png"
				},
				{
					pagePath: "pages/eco/home/index",
					text: "生态",
					iconPath: "./assets/images/foot_d.png",
					selectedIconPath: "./assets/images/foot_d_active.png"
				},
				{
					pagePath: "pages/user/home/index",
					text: "我的",
					iconPath: "./assets/images/foot_e.png",
					selectedIconPath: "./assets/images/foot_e_active.png"
				}
			]
		},
		subPackages: [
			{
				"root": "subPackageWork",
				"pages": [
					/** 会议 开始 */
					"pages/meeting/meetManageDetail/index",
					"pages/meeting/meetManageList/index",
					"pages/meeting/meetUserList/index",
					"pages/meeting/meetUserDetail/index",
					'pages/meeting/meetRelease/index',
					'pages/meeting/meetMsgMind/index',
					'pages/meeting/meetOrgAndUserList/index',
					/** 会议 结束 */

					/** 考试 结束 */
					'pages/exam/examExplain/index',
					'pages/exam/examList/index',
					'pages/exam/examResultA/index',
					'pages/exam/examResultB/index',
					'pages/exam/examSubjects/index',
					'pages/exam/examSuccess/index',
					/** 开始 结束 */

					/** 调动 开始 */
					'pages/transfer/list/index',
					/** 调动 结束 */

					/** 党费 开始 */
					'pages/dues/index/index',
					'pages/dues/special/index',
					'pages/dues/pay/index',
					'pages/dues/edit/index',
					'pages/dues/msg/index',
					'pages/dues/credentials/index',
					'pages/dues/record/index',
					'pages/dues/list/index',
					'pages/dues/detail/index',
					/** 党费 结束 */

					/** 党员调动 开始 */
					'pages/transfer/index/index',
					'pages/transfer/out/index',
					'pages/transfer/in/index',
					'pages/transfer/introduce/index',
					/** 工作协同 */
					'pages/coordination/detail/index',
					/** 附件 */
					'pages/coordination/enclosure/index',
					/**工作协同图片详情 */
					'pages/coordination/imageDetail/index',
					

					/** 工作协同 开始*/
					'pages/coordination/coordinationList/index',
					'pages/coordination/sendCoordination/index'
					/** 工作协同 结束 */
				]
			},
			{
				"root": "subPackageEco",
				"pages": [
					'pages/detail/index',
					'pages/personal/index',
					'pages/public/index',
					'pages/answer/release/index',
					'pages/answer/addAnswerForm/index',
					'pages/answer/addAnswerFormItem/index',
					"pages/answer/redBag/index",
					'pages/activity/create/index',
					'pages/activity/addActForm/index',
					'pages/activity/addActTypesForm/index',
					
					'pages/org/index',
					'pages/user/index',
					
					'pages/activity/edit/index',
					'pages/activity/detail/index',
					'pages/activity/signUp/index',
					'pages/activity/signUpDetail/index',
					'pages/activity/staffList/index',
					'pages/vote/addVoteForm/index',
					'pages/vote/addTypesForm/index',
					'pages/survey/detail/index',
					'pages/survey/userdetail/index',
					'pages/survey/more/index',
					'pages/survey/redBag/index',
					'pages/survey/addSurveyForm/index',
					'pages/survey/addSurveyFormItem/index',
					'pages/vote/voteDetail/index',
					'pages/vote/create/index',
					'pages/vote/edit/index',
					'pages/survey/create/index',
					'pages/survey/edit/index',
					'pages/answer/create/index',
					'pages/answer/detail/index',
					'pages/answer/edit/index',
					'pages/answer/startAnswer/index'
				]
			}
		],
		"preloadRule": {
			"pages/news/home/index": {
				"network": "all",
				"packages": ["subPackageEco"]
			},
		},
		"permission": {
			"scope.userLocation": {
				"desc": "你的位置信息将应用于小程序位置接口的效果展示"
			}
		}

	}

	/**
	 *
	 *  1.小程序打开的参数 globalData.extraData.xx
	 *  2.从二维码进入的参数 globalData.extraData.xx
	 *  3.获取小程序的设备信息 globalData.systemInfo
	 * @memberof App
	 */
	async componentDidMount() {
		// 获取参数
		const referrerInfo = this.$router.params.referrerInfo;
		const query = this.$router.params.query;
		!globalData.extraData && (globalData.extraData = {});
		if (referrerInfo && referrerInfo.extraData) {
			globalData.extraData = referrerInfo.extraData;
		}
		if (query) {
			globalData.extraData = {
				...globalData.extraData,
				...query
			};
		}

		// 获取设备信息
		const sys = await Taro.getSystemInfo();
        sys && (globalData.systemInfo = sys);

	}

	componentDidShow() { }

	componentDidHide() { }

	componentDidCatchError() { }

	// 在 App 类中的 render() 函数没有实际作用
	// 请勿修改此函数
	render() {
		return (
			<Provider store={store}>
				<Index />
			</Provider>
		)
	}
}

Taro.render(<App />, document.getElementById('app'))
