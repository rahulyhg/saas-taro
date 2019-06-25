
export interface OrgViewState {
    checkedList:any[]
    checkboxOption:any[]
    count:Number
}

export interface OrgViewProps {
    dispatch?: any
    checkedList:any[],
    checkedOrgList:any[],
    oldCheckedOrgList:any[]
}