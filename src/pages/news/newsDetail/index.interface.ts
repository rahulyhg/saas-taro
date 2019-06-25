
/**
 * newsDetail.state 参数类型
 *
 * @export
 * @interface IndexState
 * [key:string]: any
 */
export interface IndexState {
	[key:string]: any
	isShowLoading: boolean

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
	[key:string]: any
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