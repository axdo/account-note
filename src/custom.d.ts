type RecordItem = {
    tags:Tag[],
    createRecordError:Error|null,
    notes:string,
    type:string,
    amount:number //数据类型
    createdAt?:string //类/构造函数
}

type Tag={
    id:string;
    name:string;
}
type TagListModel={
    data:Tag[]
    fetch:()=>Tag[]
    create:(name:string)=> 'success'|'duplicated' //联合类型
    update:(id:string,name:string)=>'success'|'not found'|'duplicated'
    remove:(id:string)=>boolean
    save:()=>void
}
type RootState={
    recordList: RecordItem[],
    tagList: Tag[],
    currentTag?:Tag
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Window{

}