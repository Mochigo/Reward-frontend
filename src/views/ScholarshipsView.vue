<template>
    <a-list :data-source="scholarships" bordered>
        <a-list-item v-for="(item, index) in scholarships" :key="index" style="width:100%;">
            <template #actions>
                <a-space>
                    <a v-if="role === 'STUDENT'" style="color:blue;"
                        @click="jumpToDetail(item.scholarship_id, item.name)">查看详情</a>
                    <a v-if="role === 'SECRETARY'" style="color:blue;" @click="edit(item.scholarship_id, item.name)">编辑</a>
                </a-space>
            </template>
            <a-list-item-meta>
                <template #title>
                    <a>{{ item.name }}</a>
                </template>
            </a-list-item-meta>
            {{ item.start_time }} - {{ item.end_time }}
        </a-list-item>
    </a-list>

    <a-modal v-model:visible="visible" width="1000px" :title="ModalTitle" @ok="handleOk" @cancel="handleOk()">
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
            </keep-alive>
            <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
        </router-view>
    </a-modal>
    <NewScholarship v-if="role === 'SECRETARY'" />
    <a-pagination v-model:current="current" v-model:pageSize="pageSize" :total="total" @change="handleChange" />
</template>
<script setup>
import { ref } from 'vue';
import { getScholarships } from '../requests/scholarships'
import { useRoute, useRouter, RouterView } from 'vue-router';
import NewScholarship from '@/components/NewScholarship.vue';

const role = localStorage.getItem('role');

// 获取奖学金列表
const pageSize = ref(10);
const current = ref(1);
let scholarships = ref([]);
const visible = ref(false);
const ModalTitle = ref("");
let total = ref(0)


const init = () => { // 加载的时候获取奖学金列表
    getScholarships(current, pageSize)
        .then((resp) => {
            scholarships.value = resp.data.scholarships
            total = resp.data.total
            console.log(scholarships)
        }).catch((error) => {
            console.log(error)
        })
}
init();

const handleChange = () => { // 切换页面的时候获取奖学金列表
    getScholarships(current, pageSize)
        .then((resp) => {
            scholarships.value = resp.data.scholarships
            total = resp.data.total
            console.log(scholarships)
        }).catch((error) => {
            console.log(error)
        })
}

const router = useRouter();
const route = useRoute();

// 查看详情
const jumpToDetail = (id, name) => {
    visible.value = true;
    router.push('/scholarship/detail/' + id)
    ModalTitle.value = name
}

const edit = (id, name) => {
    visible.value = true;
    router.push('/scholarship/edit/' + id)
    ModalTitle.value = name
}

// 详情modal关闭
const handleOk = () => {
    visible.value = false;
    router.back()
};

</script>