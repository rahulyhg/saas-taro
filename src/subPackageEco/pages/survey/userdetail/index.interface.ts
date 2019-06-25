import { IFormObj } from "src/pages/common/FormObjItem/index.interface";
import { IFormDetailObj } from "src/pages/common/FormRadioObjitem/index.interface";

/**
 * signUp.state 参数类型
 *
 * @export
 * @interface SurveyDetailState
 */
export interface SurveyDetailState {
    formObj: IFormObj[]
    formDetailObj?:  IFormDetailObj[]

    customOptions:any[]
    questions:any[]

    customValues:any[]
    returnQuestions:any[]

    preOptionList:any[]
    customList:any[]
}

/**
 * signUp.props 参数类型
 *
 * @export
 * @interface SurveyDetailProps
 */
export interface SurveyDetailProps {
    dispatch?:any
    id:string
    title:string
    createByName:string
    createByCover:string
    startTime:string
    endTime:string
    customOptions:any[]
    questions:any[]
    loading:boolean
}
