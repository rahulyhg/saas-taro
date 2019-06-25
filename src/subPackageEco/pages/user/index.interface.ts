
export interface UserViewState {
    checkedList:any[]
    checkboxOption:any[]
    count:Number
}

export interface UserViewProps {
    dispatch?: any
    checkedList:any[]
    checkedUserList:any[]
    oldCheckedUserList:any[]
}