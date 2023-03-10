<template>
    <a-list :data-source="scholarships" bordered>
        <a-list-item v-for="(item, index) in scholarships" :key="index" style="width:100%;">
            <template #actions>
                <a-space>
                    <a style="color:blue;" @click="jumpToDetail(item.scholarship_id, item.name)">查看详情</a>
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

    <a-modal v-model:visible="visible" width="1000px" :title="ModalTitle" @ok="handleOk">
        <RouterView />
    </a-modal>
    <NewScholarship />
    <a-pagination v-model:current="current" v-model:pageSize="pageSize" :total="total" @change="handleChange" />
</template>

<script setup>
import { ref } from 'vue';
import { getScholarships } from '../requests/scholarships'
import { useRouter, RouterView } from 'vue-router';
import NewScholarship from '@/components/NewScholarship.vue';

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

// 查看详情
const jumpToDetail = (id, name) => {
    visible.value = true;
    router.push('/scholarship/detail/' + id)
    ModalTitle.value = name
}

// 详情modal关闭
const handleOk = e => {
    console.log(e);
    visible.value = false;
};

</script>