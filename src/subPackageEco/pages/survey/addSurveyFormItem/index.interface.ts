/**
 * AddFormItem.state 参数类型
 *
 * @export
 * @interface AddFormItemState
 */
export interface AddFormItemState {
    grayDelet: string
    placeholder: string
    atcAddIcon: string
    addOtherDisabled: boolean
    question: QuestionProps
}

/**
 * AddFormItem.props 参数类型
 *
 * @export
 * @interface AddFormItemProps
 */
export interface AddFormItemProps {
    dispatch?:any
    questions:any[]
}

/**
 * type 1单选 2多选 3问答
 */
export interface QuestionProps {
    index: number
    title: string
    must:string
    type: string
    answerList: Array<OptionItem>
    
}

/**
 * OptionItem.props 参数类型
 *
 * @export
 * @interface OptionItem
 * type I一般选项 O其他选项
 */
export interface OptionItem {
    index:number
    name: string,
    type: string
}