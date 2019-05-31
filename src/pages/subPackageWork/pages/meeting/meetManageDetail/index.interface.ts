/**
 * meetManageDetail.state 参数类型
 *
 * @export
 * @interface MeetManageDetailState
 */
export interface MeetManageDetailState {
    tabs: any,
    current: number,
    // tab -0
    meetOrgNames: any,
    meetOrgNamesIndex: any,
    meetOrgTypes: any,
    meetOrgTypesIndex: any,
    meetStartTime: string,
    signInByLocation: boolean,
    joinOrg: any,
    joinUser: any, 
    // tab -1
    meetOrgNamesJY: any,
    meetOrgNamesIndexJY: any,
    meetOrgTypesJY: any,
    meetOrgTypesIndexJY: any,
    meetStartTimeJY: string,
    signInByLocationJY: boolean,
    joinUserJY: any, 
    meetHostArrJY: any, 
    meetSpeakerArrJY: any,
    meetHostValueJY: string,
    meetSpeakerValueJY: string,
    // 弹层显示状态
    modalIsOpened: boolean
    // 上传图片list
    selectImageList: any,
    isVideoMeet: number,
    personList: any,
}

/**
 * meetManageDetail.props 参数类型
 *
 * @export
 * @interface MeetManageDetailProps
 */
export interface MeetManageDetailProps {
    joinOrg: any,
    joinUser: any, 
    dispatch: any
}
