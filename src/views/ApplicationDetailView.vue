<template>
    <a-row>
        <a-col :span="24">
            <a-typography-title :level="4">个人信息</a-typography-title>
        </a-col>
        <a-descriptions bordered>
            <a-descriptions-item label="学号">{{ studentInfo.uid }}</a-descriptions-item>
            <a-descriptions-item label="学分绩">{{ studentInfo.score }}</a-descriptions-item>
            <a-descriptions-item label="学院">{{ studentInfo.college }}</a-descriptions-item>
        </a-descriptions>
    </a-row>

    <a-row>
        <a-col :span="12">
            <a-typography-title :level="4">申报项</a-typography-title>
        </a-col>
    </a-row>
    <a-table :columns="columns" :data-source="certificates" :scroll="{ x: 1000 }">
        <template #bodyCell="{ column, record }">
            <!-- <template v-if="column.key === 'name'">
                </template> -->
            <template v-if="column.key === 'level'">
                <p>{{ PrizeName.get(record.level) }}</p>
            </template>
            <template v-if="column.key === 'status'">
                <a-badge v-if="record.status === StatusProcess" status="processing" :text="record.status" />
                <a-badge v-if="record.status === StatusApproved" status="success" :text="record.status" />
                <a-badge v-if="record.status === StatusRejected" status="error" :text="record.status" />
            </template>
            <template v-if="column.key === 'url'">
                <viewer v-if="isImage(record.url)">
                    <img :width="200" :src="record.url" />
                </viewer>
                <a v-if="!isImage(record.url)" :href="record.url"> {{ record.url.split('/').slice(-1)[0]
                }}</a>
            </template>
        </template>
    </a-table>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { getDeclarations } from '../requests/declaration';
import { getStudentInfo } from '../requests/student'

const levelNational = '03'
const levelSchool = '01'
const levelProvincial = '02'
const levelDeduction = '04'

let PrizeName = new Map([
    [levelNational, "国家级"],
    [levelProvincial, "省级"],
    [levelSchool, "校级"],
    [levelDeduction, "扣分项"],
])

const route = useRoute()
const applicationId = parseInt(route.params.id)

const certificates = ref([])
const getDeclarationList = () => {
    getDeclarations(applicationId).then((resp) => {
        console.log("getDeclarations调用成功", resp)
        certificates.value = resp.data
    }).catch((e) => {
        console.log("getDeclarations调用失败", e)
    })
}

const studentInfo = ref({})
const getStudent = () => {
    getStudentInfo().then((resp) => {
        console.log("getStudentInfo调用成功", resp)
        studentInfo.value = resp.data
        console.log(studentInfo)
    }).catch((e) => {
        console.log("getStudentInfo调用失败", e)
    })
}

const init = () => {
    getDeclarationList()
    getStudent()
}
init()

const StatusApproved = "APPROVE"
const StatusRejected = "REJECTED"
const StatusProcess = "PROCESS"


const isImage = (url) => {
    return (url.match(/\.(jpeg|jpg|gif|png|JPEG|JPG|GIF|PNG)$/) != null)
}

const columns = [
    {
        title: '申报项名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: '申报项类别',
        key: 'level',
        dataIndex: 'level',
        ellipsis: true,
    },
    {
        title: '审核状态',
        key: 'status',
        dataIndex: 'status',
        ellipsis: true,
    },
    {
        title: '文件',
        key: 'url',
        dataIndex: 'url',
        ellipsis: true,
    },
];
</script>
