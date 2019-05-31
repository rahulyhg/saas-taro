
/** 单选/多选/问答 */
export interface IFormDetailObj {
    type: 'radio' | 'checkbox' | 'textarea';
    /** 扩展属性 */
    config?: IFormDetailObj_Textarea | IFormDetailObj_RadioGroup[] | IFormDetailObj_CheckboxGroup[];
    /** 是否必填 */
    isRequire: boolean;
    /** 组件的name */
    typeName: string;
    /** 组件的label */
    label: string;
    /** 组件值改变事件 */
    onChange?: (e) => void;
}
export interface IFormDetailObj_Textarea {
    /** 提示语 */
    placeholder: string;
    maxLength?: number
}
export interface IFormDetailObj_RadioGroup {
    id: string | number;
    value: string | number;
    /** 有此选项会在后面多加一个input */
    hasInput?: boolean;
}
export interface IFormDetailObj_CheckboxGroup {
    id: string | number;
    value: string | number;
    min?: number;
    max?: number;
    /** 有此选项会在后面多加一个input */
    hasInput?: boolean;
}