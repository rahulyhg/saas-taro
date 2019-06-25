export interface IType {
    type: 'title' | 'content'
}
/**
 * activity.state 参数类型
 *
 * @export 
 * @interface IcreateVoteState
 */
export interface IcreateVoteState {
    title: string,
    content: string,
    startTime: string,
    endTime: string,
    cover: string,
    joinOrg: any,
    joinUser: any,
    peopleJoin: string,
    repeatVote: string,
    anonymous: string,
    voteNum: any,

    activityTitleActive: boolean,
    activityExplainActive: boolean,
    [x: string]: any
}

/**
 * activity.props 参数类型
 *
 * @export
 * @interface IcreateVoteProps
 */
export interface IcreateVoteProps {
    dispatch?: any,
    joinUser: any,
    joinOrg: any,
    checkedOrg: any
}
