/**
 * index.state 参数类型
 *
 * @export
 * @interface ImeetReleaseState
 */
export interface ImeetReleaseState {
	meetingModality: number,
	meetTypeArray: any,
	orgName: string, // 所属组织 name
	orgId: string, // 所属组织 id
	orgCode: string, // 所属组织 code
	orgTypeId: string,// 所属组织 typeId
	meetTypeArrayIndex:any,
	startDate: string,
	startTime:string,
	joinUserList: any,
	joinOrgList: any,
	meetTimeArray: any,
	meetTimeArrayIndex: any,
	needMap: number,
	content: string,
	name: string,
	topic: string,
	meetingDuration: string,
	mapAddress: string,
	latitude: string,
	longitude: string,
	meetingAddress: string,
}

/**
 * index.props 参数类型
 *
 * @export
 * @interface ImeetReleaseProps 
 */
export interface ImeetReleaseProps {
	dispatch?: any,
	data?: Array<DataInterface>,
	joinUserList: any,
	joinOrgList: any,
	orgType: any,
	
}

export interface DataInterface {
	day: number
	des: string
	lunar: string
	month: number
	pic: string
	title: string
	year: number
	_id?: string
}