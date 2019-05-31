
/**
 * newsDetail.state 参数类型
 *
 * @export
 * @interface IndexState
 * [key:string]: any
 */
export interface IndexState {
	isShowCommentTextarea:boolean
	commentList: Array<ComInterface>
	demoImg: string
	demo_icons_a: string
	demo_icons_b: string
	videoSrc: string
	audioSrc: string
	playIconRed: string
	playIconRed_play: string
	audioIsPlay: boolean
	addComt: string
	botMenu: any
	commentText: string

}
export interface ComInterface {
	iszan: boolean
	backList: any
}

 /**
 * index.props 参数类型
 *
 * @export
 * @interface IndexProps
 */
export interface IndexProps {
	dispatch?: any,
	data?: Array<DataInterface>
}

export interface DataInterface {
	day: number
	des: string
	lunar: string
	month: number
	pic: string
	title: string
	year: number
	_id: string
}