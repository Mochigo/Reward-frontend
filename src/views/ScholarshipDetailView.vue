<template>
    <div class="body">
        <p :style="pStyle">子项列表</p>
        <a-list :data-source="scholarshipItems" bordered>
            <a-list-item v-for="(item, index) in scholarshipItems" :key="index" style="width:100%;">
                <template #actions>
                    <a-button type="primary" @click="apply(item)">
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        申请
                    </a-button>
                </template>
                <a-list-item-meta>
                    <template #title>
                        <a>{{ item.name }}</a>
                    </template>
                </a-list-item-meta>
            </a-list-item>
        </a-list>
        <a-divider />
        <p :style="pStyle">说明文件</p>
        <a-list :data-source="attachments" bordered>
            <a-list-item v-for="(item, index) in attachments" :key="index" style="width:100%;">
                <a-list-item-meta>
                    <template #title>
                        <a :href="item.url">{{ item.url.split('/').slice(-1)[0] }}</a>
                    </template>
                </a-list-item-meta>
            </a-list-item>
        </a-list>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRoute } from "vue-router";
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { createApplication } from "../requests/applicaiton";
import { getScholarshipItems, getScholarshipInfo } from '../requests/scholarships';
import { getAttachments } from '../requests/attachments';

const pStyle = {
    fontSize: '16px',
    color: 'rgba(0,0,0,0.85)',
    lineHeight: '24px',
    display: 'block',
    marginBottom: '16px',
};

const route = useRoute(); //route 和 router 有差别


let scholarshipItems = ref([]);
let attachments = ref([]);
const init = () => {
    getScholarshipItems(route.params.id)
        .then((resp) => {
            // console.log(route.params.id)
            scholarshipItems.value = resp.data
            console.log(scholarshipItems)
        }).catch((error) => {
            console.log(error)
        })

    getAttachments(route.params.id)
        .then((resp) => {
            attachments.value = resp.data
            console.log(attachments)
        }).catch((error) => {
            console.log(error)
        })

}
init();

const apply = (item) => {
    // console.log("奖学金子项id", id)
    // console.log("奖学金项id", scholarship_id)
    let data = {}
    data["scholarship_item_id"] = item.id
    data["scholarship_id"] = item.scholarship_id
    data["deadline"] = item.end_time
    console.log(item)
    getScholarshipInfo(item.scholarship_id).then(res => {
        console.log("getScholarshipInfo调用成功", res);
        let data = {}
        data["scholarship_item_id"] = item.id
        data["scholarship_id"] = item.scholarship_id
        data["deadline"] = res.data.end_time
        createApplication(data)
            .then(res => {
                console.log("createApplication调用成功", res);
                message.success("申请提交成功");
            }).catch((error) => {
                message.warning("申请已提交，请勿重复提交");
                console.log("createApplication调用失败", error);
            })
    }).catch((error) => {
        console.log("getScholarshipInfo调用失败", error);
    })
};


</script>


