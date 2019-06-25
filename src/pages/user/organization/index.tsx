import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { OrganizationProps, OrganizationState } from './index.interface'
import './index.scss'
// import {  } from '../../components'

// @connect(({ organization }) => ({
//     ...organization,
// }))

class Organization extends Component<OrganizationProps, OrganizationState> {
    config: Config = {
        navigationBarTitleText: '组织架构图'
    }
    constructor(props: OrganizationProps) {
        super(props)
        this.state = {
            orgList: [
                {
                    orgName: "测试党委",
                    type: "party",
                    childOrgList: [
                        {
                            orgName: "测试总支1",
                            type: "gbranch",
                            childOrgList: [
                                {
                                    orgName: "测试支部1",
                                    type: "branch"
                                },
                                {
                                    orgName: "测试支部2",
                                    type: "branch"
                                },
                                {
                                    orgName: "测试支部3",
                                    type: "branch"
                                }
                            ]
                        },
                        {
                            orgName: "测试总支1",
                            type: "gbranch",
                            childOrgList: [
                                {
                                    orgName: "测试支部4",
                                    type: "branch"
                                },
                                {
                                    orgName: "测试支部5",
                                    type: "branch"
                                }
                            ]
                        },
                        {
                            orgName: "测试总支1",
                            type: "gbranch",
                            childOrgList: [
                                {
                                    orgName: "测试支部6",
                                    type: "branch"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }

    componentDidMount() {

    }

    render() {
        const { orgList } = this.state;
        return (
            <View style='overflow:auto;'>
                <View className="org-tree-container">
                    <View id='org-tree' className="org-tree collapsable">
                        {
                            orgList && orgList.map(item => (
                                <View className="org-tree-node" >

                                    <View className="org-tree-node-label" style='width: auto;'>
                                        <View className="org-tree-node-label-inner org-tree-node-label-icon">
                                            <View style='margin-bottom: 4px;margin-top: 8px;'>
                                                <Image className='org-tree-node-img' mode="aspectFit" src='https://f1.71dj.org/mobile-pro/img/tx1@2x.f294bc0e.png' />
                                            </View>
                                            <View>{item.orgName}</View>
                                        </View>
                                    </View>
                                    {
                                        item.childOrgList && item.childOrgList.length > 0 && <View className="org-tree-node-children">
                                            {
                                                item.childOrgList && item.childOrgList.map(obj => (
                                                    <View className={`org-tree-node ${obj.childOrgList && obj.childOrgList.length > 0 ? "" : "is-leaf"}`} >
                                                        <View className="org-tree-node-label" style='min-width: 120px;'>
                                                            <View className="org-tree-node-label-inner org-tree-node-label-icon">
                                                                <View style='margin-bottom: 4px;margin-top: 8px;'>
                                                                    <Image className='org-tree-node-img' mode="aspectFit" src='https://f1.71dj.org/mobile-pro/img/tx1@2x.f294bc0e.png' />
                                                                </View>
                                                                <View className='org-tree-node-name' style="background-color:#FF4D4F;color:#fff;">{obj.orgName}</View>

                                                            </View>
                                                        </View>
                                                        {
                                                            obj.childOrgList && obj.childOrgList.length > 0 && <View className="org-tree-node-children">
                                                                {
                                                                    obj.childOrgList && obj.childOrgList.map(child => (
                                                                        <View className={`org-tree-node ${child.childOrgList && child.childOrgList.length > 0 ? "" : "is-leaf"}`}  >
                                                                            <View className="org-tree-node-label">
                                                                                <View className="org-tree-node-label-inner">
                                                                                    <View className='org-tree-node-name'>{child.orgName}</View>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    ))
                                                                }
                                                            </View>
                                                        }
                                                    </View>
                                                ))
                                            }

                                        </View>
                                    }


                                </View>
                            ))
                        }
                    </View>
                </View>
            </View>
        )
    }
}

export default Organization
