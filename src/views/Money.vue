<template>
  <div>
    <Layout class-prefix="layout">
      <NumberPad :value.sync="record.amount" @submit="saveRecord"/>
      <Tabs :data-source="recordTypeList"
            :value.sync="record.type"/>
      <div class="notes">
        <FormItem field-name="备注"
                  placeholder="在这里输入备注"
                  :value.sync="record.notes"/>
      </div>
      <Tags @update:value="record.tags=$event"/>
    </Layout>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import NumberPad from '@/components/Money/NumberPad.vue';
import FormItem from '@/components/Money/FormItem.vue';
import Tags from '@/components/Money/Tags.vue';
import {Component} from 'vue-property-decorator';
import recordTypeList from '@/constants/recordTypeList';
import Tabs from '@/components/Tabs.vue';



@Component({
  components: {Tabs, Tags, FormItem, NumberPad},
})
export default class Money extends Vue {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get recordList() {
    return this.$store.state.recordList;
  }

  recordTypeList= recordTypeList;
  // eslint-disable-next-line no-undef
  record: RecordItem = {tags: [], notes: '', type: '-', amount: 0, createRecordError:null};


  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  created(){
    this.$store.commit('fetchRecords')
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onUpdateNotes(value: string) {
    this.record.notes = value;
  }


  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  saveRecord() {
    if (!this.record.tags|| this.record.tags.length===0){
      return window.alert('请至少选择一个标签');
    }
    this.$store.commit('createRecord',this.record);
    if (this.$store.state.createRecordError === null){
      window.alert('添加账目成功');
      this.record.notes='';
    }
  }

}
</script>

<style lang="scss" scoped>
::v-deep .layout-content {
  //border:1px solid red;
  display: flex;
  flex-direction: column-reverse;
}

.notes {
  padding: 12px 0;
}
</style>

