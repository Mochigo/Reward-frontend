<template>
    <a-table :columns="columns" :data-source="scholarships" :pagination="pagination" :loading="loading"
        @change="handleTableChange()">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <a-space>
                    <a v-if="role === 'STUDENT'" style="color:blue;"
                        @click="jumpToDetail(record.scholarship_id, record.name)">查看详情</a>
                    <a v-if="role === 'SECRETARY'" style="color:blue;"
                        @click="edit(record.scholarship_id, record.name)">编辑</a>
                </a-space>
            </template>
        </template>
    </a-table>

    <a-modal v-model:visible="visible" width="1000px" :title="ModalTitle" @ok="handleOk" @cancel="handleOk()">
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
            </keep-alive>
            <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
        </router-view>
    </a-modal>
    <NewScholarship v-if="role === 'SECRETARY'" />
</template>
<script setup>
import { ref, reactive } from 'vue';
import { getScholarships } from '../requests/scholarships'
import { useRouter, RouterView } from 'vue-router';
import NewScholarship from '@/components/NewScholarship.vue';

const role = localStorage.getItem('role');

// 获取奖学金列表
let scholarships = ref([]);
let pageSize = 10;
let current = 1;
const loading = ref(false);

const pagination = reactive({
    defaultPageSize: 10,
    total: 0,
    showTotal: total => `共 ${total} 条数据`,
    showSizeChanger: true,
    onShowSizeChange: (current, pageSize) => {
        this.pageSize = pageSize
        this.current = current
    }
})

const getScholarshipList = () => {
    loading.value = true
    getScholarships(current, pageSize)
        .then((resp) => {
            console.log(resp)
            scholarships.value = resp.data.scholarships
            pagination.total = resp.data.total
            console.log(scholarships)
        }).catch((error) => {
            console.log(error)
        })
    loading.value = false;
}

getScholarshipList();

const handleTableChange = () => {
    getScholarshipList()
}

const visible = ref(false);
const ModalTitle = ref("");
const router = useRouter();

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

const columns = [
    {
        title: '奖学金名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: '开始时间',
        key: 'start_time',
        dataIndex: 'start_time',
        ellipsis: true,
    },
    {
        title: '结束时间',
        key: 'end_time',
        dataIndex: 'end_time',
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'action',
    },
];
</script>