/**
 * edit.state 参数类型
 *
 * @export
 * @interface EditState
 */
export interface EditState {
    title: string,
    content: string,
    startTime: string,
    endTime: string,
    cover: string,
    joinOrg: any,
    joinUser: any,
    peopleJoin?: string,
    repeatVote: string,
    anonymous: string,
    voteNum: any,

    activityTitleActive: boolean,
    activityExplainActive: boolean,

    activityId: string,
    [x: string]: any,
}

/**
 * edit.props 参数类型
 *
 * @export
 * @interface EditProps
 */
export interface EditProps {
    dispatch: any,
    joinUser: any,
    joinOrg: any,
    [x: string]: any,
}
