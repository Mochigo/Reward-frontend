<template>
    <a-list :data-source="applications" bordered>
        <a-list-item v-for="(item, index) in applications" :key="index" style="width:100%;">
            <template #actions>
                <a-space>
                    <a style="color:blue;" @click="edit(item.id)">编辑</a>
                </a-space>
            </template>
            <a-list-item-meta>
                <template #title>
                    <a>{{ item.scholarship_item_name }}</a>
                </template>
            </a-list-item-meta>
            <a-badge v-if="item.status === 'PROCESS'" status="processing" :text="item.status" />
            <a-badge v-if="item.status === 'APPROVED'" status="success" :text="item.status" />
        </a-list-item>
    </a-list>
    <a-drawer :width="736" :visible="visible" :body-style="{ paddingBottom: '80px' }" :footer-style="{ textAlign: 'right' }"
        @close="handleOk()">
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
            </keep-alive>
            <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
        </router-view>
    </a-drawer>
    <a-pagination v-model:current="current" v-model:pageSize="pageSize" :total="total" @change="handleChange" />
</template>

<script setup>
import { ref } from 'vue';
import { getApplications } from '../requests/applicaiton'
import { RouterView, useRouter } from 'vue-router'

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
const handleOk = () => {
    visible.value = false;
    router.back() // 回退的关键
};

const router = useRouter()

const edit = (id) => {
    // console.log(id)
    visible.value = true;
    router.push('/application/edit/' + id)
}
</script>