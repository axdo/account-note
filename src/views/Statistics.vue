<template>
  <Layout>
    <Tabs class-prefix="type" :data-source="recordTypeList" :value.sync="type"/>


    <ol v-if="groupedList.length>0">
      <li v-for="(group,index) in groupedList" :key="index">
        <h3 class="title">{{ beautify(group.title) }} <span>￥{{group.total}}</span></h3>
        <ol>
          <li class="record" v-for="item in group.items" :key="item.id">

            <span>{{ tagString(item.tags) }}</span>
            <span class="notes">{{item.notes}}</span>
            <span>￥{{ item.amount }}</span>
          </li>
        </ol>
      </li>
    </ol>
    <div class="no-record" v-else>
      <p>❕</p>
      目前还没有相关记录
    </div>

  </Layout>
</template>

<script lang="ts">


import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import Tabs from '@/components/Tabs.vue';
import recordTypeList from '@/constants/recordTypeList';
import dayjs from 'dayjs';
import clone from '@/lib/clone';



@Component({
  components: {Tabs},
})
export default class Statistics extends Vue {
  // eslint-disable-next-line no-undef,@typescript-eslint/explicit-module-boundary-types
  tagString(tags:Tag[]){
    return tags.length===0?'无':tags.map(t=>t.name).join(',');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  beautify(string:string){
    const day = dayjs(string);
    const now = dayjs();
    if(day.isSame(now,'day')){
      return '今天';
    } else if(day.isSame(now.subtract(1,'day'),'day')){
      return '昨天';
    } else if(day.isSame(now.subtract(2,'day'),'day')){
      return '前天';
    } else if(day.isSame(now,'year')){
      return day.format('M月D日');
    }else{
      return day.format('YYYY年M月D日');
    }
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get recordList() {
    // eslint-disable-next-line no-undef
    return (this.$store.state as RootState).recordList;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get groupedList() {
    const {recordList} = this;
    const newList = clone(recordList).filter(r=>r.type===this.type).sort((a,b)=>dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
    if (newList.length === 0){return [];}
    // eslint-disable-next-line no-undef
    type Result = { title: string, total?: number, items: RecordItem[] }[]
    const result:Result = [{title:dayjs(newList[0].createdAt).format('YYYY-MM-DD'),total:0,items:[newList[0]]}];
    for (let i = 1;i<newList.length;i++){
      const current = newList[i];
      const last = result[result.length-1];
      if(dayjs(last.title).isSame(dayjs(current.createdAt),'day')){
        last.items.push(current)
      } else {
        result.push({title: dayjs(current.createdAt).format('YYYY-MM-DD'),total:0,items:[current]})
      }
    }
    result.map(group=>{
      group.total = group.items.reduce((sum,item)=>sum+item.amount,0)
    })
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  beforeCreate() {
    this.$store.commit('fetchRecords');
  }

  type = '-';
  recordTypeList = recordTypeList;
}
</script>

<style lang="scss" scoped>
::v-deep {
  .type-tabs-item {
    background: #c4c4c4;

    &.selected {
      background: #fff;

      &::after {
        display: none;
      }
    }
  }

  .interval-tabs-item {
    height: 48px;
  }
}

%item {
  padding: 8px 16px;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.title {
  @extend %item;
}

.record {
  background: white;
  @extend %item;
}
.notes{
  margin-right: auto;
  margin-left: 16px;
  color: #999;
}
.no-record{
  font-size: 30px;
  color: #ccc;
  font-weight: lighter;
  text-align: center;
  margin: 150px auto;
}
</style>