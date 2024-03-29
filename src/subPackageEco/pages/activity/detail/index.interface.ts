import activity from "@/src/models/eco/activity/activity";

/**
 * signup.state 参数类型
 *
 * @export
 * @interface SignupState
 */
export interface ActivityDetailState {
    partyWorks: any;
}

/**
 * signup.props 参数类型
 *
 * @export
 * @interface SignupProps
 */
export interface ActivityDetailProps {
    dispatch?:any
    activityDetail:any
    loading:boolean
}
