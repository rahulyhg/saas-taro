export interface IFormObj {
    /** 类型单行文本、多行文本、下拉框、单选按钮组、上传图片 */
    type: 'input' | 'textarea' | 'picker' | 'radioGroup' | 'image';
    /** 扩展属性 */
    config?: IFormObj_Textarea | IFormObj_Picker[] | IFormObj_RadioGroup[];
    /** 是否必填 */
    isRequire: boolean;
    /** 提示语 */
    placeholder: string;
    /** 组件的name */
    typeName: string;
    /** 组件的label */
    label: string;
    /** 初始值 */
    initValue:string
    /** 组件值改变事件 */
    onChange?: (e) => void;
}

export interface IFormObj_Textarea {
    maxLength?: number
}
/** 下拉组件 */
export interface IFormObj_Picker {
    id: string | number;
    value: string | number;
}
/** 单选按钮 */
export interface IFormObj_RadioGroup {
    id: string | number;
    value: string | number;
}
