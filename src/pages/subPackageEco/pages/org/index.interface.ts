
export interface OrgViewState {
    checkedList:any[]
    checkboxOption:any[]
}

export interface OrgViewProps {
    dispatch?: any
    checkedList:any[],
    checkedOrgList:any[],
    oldCheckedOrgList:any[]
}