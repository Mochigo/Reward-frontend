<template>
    <a-list :data-source="applications" bordered>
        <a-list-item v-for="(item, index) in applications" :key="index" style="width:100%;">
            <template #actions>
                <a-space>
                    <a style="color:blue;" @click="edit(item.id)">查看详情</a>
                    <a style="color:blue;" @click="">编辑</a>
                </a-space>
            </template>
            <a-list-item-meta>
                <template #title>
                    <a>{{ item.scholarship_item_name }}</a>
                </template>
            </a-list-item-meta>
            {{ item.status }}
        </a-list-item>
    </a-list>
    <a-modal v-model:visible="visible" width="1000px" title="申请编辑" @ok="handleOk">
        <RouterView />
    </a-modal>
    <a-pagination v-model:current="current" v-model:pageSize="pageSize" :total="total" @change="handleChange" />
</template>

<script setup>
import { ref } from 'vue';
import { getApplications } from '../requests/applicaiton'
import { RouterView } from 'vue-router'

let pageSize = ref(10);
let current = ref(1);
let applications = ref([]);
let total = ref(0);

const init = () => {
    getApplications(current, pageSize)
        .then((resp) => {
            applications.value = resp.data.applications
            total = resp.data.total
            console.log(applications)
        }).catch((error) => {
            console.log(error)
        })
}

const handleChange = (page, pageSize) => {
    getApplications(current, pageSize)
        .then((resp) => {
            applications.value = resp.data.applications
            total = resp.data.total
            console.log(applications)
        }).catch((error) => {
            console.log(error)
        })
}

init();

const visible = ref(false);
const handleOk = e => {
    console.log(e);
    visible.value = false;
};

const edit = (id) => {
    visible.value = true;
}
</script>