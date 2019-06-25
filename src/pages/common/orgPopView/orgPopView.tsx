import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Image, Icon, Block, Text } from '@tarojs/components'
import { AtSearchBar, AtDivider } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { OrgPopViewProps, OrgPopViewState } from './orgPopView.interface'
import './orgPopView.scss'
import _lodash from 'underscore'
import { element } from 'prop-types';
const arrowImg = process.env.remoteImgPreUrl + '/images/common/arrow.png';
const checkedImg = process.env.remoteImgPreUrl + '/images/common/checked.png';
const uncheckImg = process.env.remoteImgPreUrl + '/images/common/uncheck.png';

import DjLoading from '../djLoading';
@connect(({ orgPopView, loading }) => ({
	...orgPopView,
	loading: loading.models.orgPopView
}))

class OrgPopView extends Component<OrgPopViewProps, OrgPopViewState> {
	config: Config = {
		navigationBarTitleText: '选择组织'
	}
	constructor(props: OrgPopViewProps) {
		super(props);
		this.state = {
			isSearch: false,
			breadList: [],
			searchValue: '',

			orgList: [],
			checkedOrgList: [],
			allChecked: false,
			searchOrgList: [],
			count: 0
		}
	}

	componentDidMount() {
		const { checkedList } = this.props;
		if (this.props.checkedList && this.props.checkedList.length > 0) {
			this.setState({
				checkedOrgList: checkedList
			}, () => {
				this.getMaxOrgByUserId();
			})
		} else {
			this.getMaxOrgByUserId();
		}

	}

	componentDidShow() {

	}

	async transDataState() {

		// TODO: orgList deepClone
		let orgList = _lodash.clone(this.props.orgList);
		let count = 0;
		const { checkedOrgList } = this.state;
		checkedOrgList.forEach(element => {
			for (let i = 0; i < orgList.length; i++) {
				if (element.orgId == orgList[i].orgId) {
					orgList[i].checked = true;
					count++;
					break;
				}
			}
		});
		this.setState({
			orgList: orgList,
			count: checkedOrgList.length,
			allChecked: count != 0 && count === orgList.length
		})

	}

	// 初始化获取用户最大权限组织&下级组织
	async getMaxOrgByUserId() {
		const orgId = this.$router.params.orgId;
		const partyUserState = this.$router.params.partyUserState;
		const hasParty = _lodash.isEmpty(partyUserState) && _lodash.isUndefined(partyUserState);

		const { dispatch } = this.props;
		if (!_lodash.isEmpty(orgId) && !_lodash.isUndefined(orgId) && "undefined" != orgId) {
			await dispatch({
				type: 'orgPopView/getMaxOrgByOrgId',
				payload: { orgId: orgId, partyUserState: !hasParty ? partyUserState : '' }
			});
		} else {
			await dispatch({
				type: 'orgPopView/getMaxOrgByUserId',
				payload: { partyUserState: !hasParty ? partyUserState : '' }

			});
		}
		this.setState({
			breadList: []
		}, () => {
			this.transDataState();
		});

	}

	// 搜索
	async onSearch(e) {
		const orgId = this.$router.params.orgId;
		await this.props.dispatch({
			type: 'orgPopView/getOrgByOrgName',
			payload: {
				inputName: e.detail.value,
				orgId: (!_lodash.isEmpty(orgId) && !_lodash.isUndefined(orgId)) ? orgId : ''
			}
		});

		// TODO: searchOrgList deepClone
		let { searchOrgList } = this.props;
		const { checkedOrgList } = this.state;
		checkedOrgList.forEach(element => {
			for (let i = 0; i < searchOrgList.length; i++) {
				if (element.orgId == searchOrgList[i].orgId) {
					searchOrgList[i].checked = true;
					break;
				}
			}
		});

		this.setState({
			searchOrgList: searchOrgList
		})
	}

	// 点击下级
	async onClick(orgId, orgName, e) {
		e.stopPropagation();
		Taro.pageScrollTo({
			scrollTop: 0,
			duration: 300
		})
		await this.props.dispatch({
			type: 'orgPopView/getOrgAndUserByorgId',
			payload: {
				orgId: orgId
			}
		});
		if (this.props.orgList.length > 0) {
			this.setState({
				breadList: this.state.breadList.concat([{ orgId, orgName }])
			})
		} else {
			Taro.showToast({ title: '暂无下级组织', icon: 'none' });
			return
		}
		this.transDataState();
	}

	async onBreadClick(orgId, index, e) {
		e.stopPropagation();
		await this.props.dispatch({
			type: 'orgPopView/getOrgAndUserByorgId',
			payload: {
				orgId: orgId
			}
		});

		let { breadList } = this.state;
		this.setState({
			breadList: _lodash.first(breadList, index + 1)
		})
		this.transDataState();
	}

	// 点击选择组织
	onCheckClick(org, e) {
		e.stopPropagation();

		// 处理选中状态
		let { orgList, searchOrgList } = this.state;
		let count = 0;
		orgList.forEach(item => {
			if (item.orgId === org.orgId) {
				item.checked = !item.checked;
			}
			if (item.checked) {
				count++;
			}
		})

		searchOrgList.forEach(item => {
			if (item.orgId === org.orgId) {
				item.checked = !item.checked
			}
		})

		// 处理选中数组 org.checked true 则删除 否则插入
		let { checkedOrgList } = this.state;
		let temp: any = [];
		if (org.checked) {
			temp = checkedOrgList.filter(element => {
				return element.orgId != org.orgId
			});
		} else {
			temp = checkedOrgList.concat(org);
		}
		this.setState({
			orgList: orgList,
			checkedOrgList: temp,
			count: temp.length,
			allChecked: count != 0 && count === orgList.length
		})

	}


	// 点击选择组织
	async onSearchCheckClick(org, e) {
		e.stopPropagation();

	}
	// 全选
	async onAllCheck() {
		const { orgList, allChecked, checkedOrgList } = this.state;
		orgList.map(element => {
			element.checked = !allChecked
		})
		let temp: any = [];
		if (allChecked) {
			temp = checkedOrgList.filter(element => {
				let flag = true;
				for (let i = 0; i < orgList.length; i++) {
					if (element.orgId === orgList[i].orgId) {
						flag = false;
						break;
					}
				}
				return flag
			});
		} else {
			temp = checkedOrgList.concat(orgList);
			temp = _lodash.uniq(temp, 'orgId');
		}
		this.setState({
			allChecked: !this.state.allChecked,
			checkedOrgList: temp,
			orgList: this.state.orgList,
			count: temp.length
		})
	}

	// 点击确定
	onConfirmClick() {
		let { checkedOrgList } = this.state;

		this.props.dispatch({
			type: 'orgPopView/updateState',
			payload: {
				checkedOrgList: checkedOrgList,
				checkedList: checkedOrgList
			}
		});
		Taro.navigateBack({ delta: 1 });
	}

	onFocusSearch(e) {
		e.stopPropagation();
		this.setState({
			isSearch: !this.state.isSearch
		})
	}

	render() {
		const { breadList, count, orgList, allChecked, isSearch, searchOrgList } = this.state;
		const { loading } = this.props;
		return (
			<View className='fx-orgPopView-wrap' style={{ marginBottom: '160rpx', paddingBottom: '160rpx' }}>
				<View className='fx-orgPopView-search'>
					<View className='form flex'>
						<Icon type='search' size='14' />
						{
							isSearch ? (
								<Block>
									<Input className='flex-item' type='text' focus onConfirm={this.onSearch} />
									<Text onClick={this.onFocusSearch}>取消</Text>
								</Block>
							) : (<Input className='flex-item' type='text' placeholder='搜索' disabled onClick={this.onFocusSearch} />)
						}
					</View>
					{
						!isSearch && (
							<View className='scrollview' >
								<View className='scrollview-item' onClick={this.getMaxOrgByUserId}>首页</View>
								{
									breadList && breadList.map((item, index) => {
										return (
											<Block>
												<Image src={arrowImg} style={'width:20px;height:20px;vertical-align:middle'} />
												{
													index != breadList.length - 1 ? <View className='scrollview-item' onClick={this.onBreadClick.bind(this, item.orgId, index)}>{item.orgName}</View> :
														<View className='scrollview-item'>{item.orgName}</View>
												}
											</Block>
										)
									})
								}
							</View>
						)
					}

				</View>

				{
					!isSearch && (
						<View className='flex fx-orgPopView-all' onClick={this.onAllCheck}>
							<Image src={allChecked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;margin-right:8px;'} />
							<View className='flex-item'>全选</View>
						</View>
					)
				}
				{
					!isSearch && (

						<View className='fx-orgPopView-container'>
							{
								orgList && orgList.map((item) => {
									return (
										<View className='flex van-hairline--bottom'>
											<Image src={item.checked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;margin-right:8px;'} onClick={this.onCheckClick.bind(this, item)} />
											<View className='flex-item' onClick={this.onCheckClick.bind(this, item)} >{item.orgName}</View>
											<View className='action van-hairline--left' onClick={this.onClick.bind(this, item.orgId, item.orgName)}>下级</View>
										</View>
									)
								})
							}
							{
								orgList.length <= 0 && <AtDivider content='暂无数据' fontColor='#999' lineColor='#ccc' />
							}
						</View>)
				}

				{
					isSearch && <View className='fx-orgPopView-container'>
						{
							searchOrgList && searchOrgList.map(item => {
								return (
									<View className='flex van-hairline--bottom'>
										<Image src={item.checked ? checkedImg : uncheckImg} style={'width:20px;height:20px;vertical-align:middle;margin-right:8px;'} onClick={this.onCheckClick.bind(this, item)} />
										<View className='flex-item' onClick={this.onCheckClick.bind(this, item)} >{item.orgName}</View>
									</View>
								)
							})
						}
						{
							searchOrgList.length <= 0 && <AtDivider content='暂无数据' fontColor='#999' lineColor='#ccc' />
						}
					</View>
				}

				<View className='fx-orgPopView-footer flex'>
					<View className='flex-item'>已选择{count}个组织</View>
					<View className='btn' onClick={this.onConfirmClick}>确定</View>
				</View>

				<DjLoading isshow={loading} />

			</View>
		)
	}
}

export default OrgPopView
