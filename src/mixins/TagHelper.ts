// mixins.js
import Vue from 'vue'
import Component from 'vue-class-component'

// You can declare mixins as the same style as components.
@Component
export class TagHelper extends Vue {
    createTag() {
        const name = window.prompt('请输入标签名');
        if (!name) {
            return window.alert('标签名不能为空');

        }
        this.$store.commit('createTag',name);

    }
}

export default TagHelper;