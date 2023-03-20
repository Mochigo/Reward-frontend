<template>
    <a-drawer :width="736" :visible="visible" :body-style="{ paddingBottom: '80px' }" :footer-style="{ textAlign: 'right' }"
        @close="handleOk()">
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
            </keep-alive>
            <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
        </router-view>
    </a-drawer>
    <a-table :columns="columns" :data-source="applications" :pagination="pagination" :loading="loading"
        @change="handleTableChange()">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key == 'status'">
                <a-badge v-if="record.status === 'PROCESS'" status="processing" :text="record.status" />
                <a-badge v-if="record.status === 'APPROVED'" status="success" :text="record.status" />
            </template>
            <template v-if="column.key === 'action'">
                <a-space>
                    <a style="color:blue;" @click="edit(record.id)">编辑</a>
                </a-space>
            </template>
        </template>
    </a-table>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { getApplications } from '../requests/applicaiton'
import { RouterView, useRouter } from 'vue-router'

let applications = ref([]);
const loading = ref(false);
let pageSize = 10;
let current = 1;

const getApplicationList = () => {
    loading.value = true
    getApplications(current, pageSize)
        .then((resp) => {
            console.log(resp)
            applications.value = resp.data.applications
            pagination.total = resp.data.total
            console.log(applications)
        }).catch((error) => {
            console.log(error)
        })
    loading.value = false;
}

getApplicationList();

const handleTableChange = () => {
    getApplicationList()
}

const visible = ref(false);
const handleOk = () => {
    visible.value = false;
    router.back() // 回退的关键
};

const router = useRouter()

const edit = (id) => {
    visible.value = true;
    router.push('/application/edit/' + id)
}

const pagination = reactive({
    defaultPageSize: 10,
    total: 0,
    showTotal: total => `共 ${total} 条数据`,
    showSizeChanger: true,
    onShowSizeChange: (page, limit) => {
        pageSize = limit
        current = page
    }
})

const columns = [
    {
        title: '奖学金子项名称',
        dataIndex: 'scholarship_item_name',
        key: 'scholarship_item_name',
        ellipsis: true,
    },
    {
        title: '奖学金名称',
        dataIndex: 'scholarship_name',
        key: 'scholarship_name',
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        ellipsis: true,
    },
    {
        title: '截止时间',
        key: 'deadline',
        dataIndex: 'deadline',
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'action',
    },
];
</script>