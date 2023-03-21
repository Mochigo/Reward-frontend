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
        <a-col :span="12">
            <a-button type="primary" style="float: right;" @click="openDrawer">
                <template #icon>
                    <PlusOutlined />
                </template>
                New
            </a-button>
        </a-col>

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
    </a-row>

    <a-drawer v-model:visible="visible" title="新建荣誉" width="600" :closable="false" :footer-style="{ textAlign: 'right' }">
        <template #footer>
            <a-button type="primary" @click="submit()">
                Submit
            </a-button>
        </template>
        <a-form :model="certificateForm" layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-form-item label="申报项名称" :rules="[{ required: true }]">
                <a-input v-model:value="certificateForm.name" />
            </a-form-item>
            <a-form-item label="申报项类别" :rules="[{ required: true }]">
                <a-radio-group v-model:value="certificateForm.level" name="radioGroup">
                    <a-radio :value="levelSchool">{{ PrizeName.get(levelSchool) }}</a-radio>
                    <a-radio :value="levelProvincial">{{ PrizeName.get(levelProvincial) }}</a-radio>
                    <a-radio :value="levelNational">{{ PrizeName.get(levelNational) }}</a-radio>
                    <a-radio :value="levelDeduction">{{ PrizeName.get(levelDeduction) }}</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="上传文件" :rules="[{ required: true }]">
                <a-upload name="files" v-model:file-list="certificateForm.fileList" list-type="picture" :max-count="1"
                    action="/api/upload" :headers="headers" @change="uploadChange">
                    <a-button>
                        <template #icon>
                            <UploadOutlined />
                        </template>
                        Click to upload
                    </a-button>
                </a-upload>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { reactive, ref, inject } from 'vue';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { addDeclaration, getDeclarations } from '../requests/declaration';
import { getStudentInfo } from '../requests/student'

const reload = inject('reload')

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

const certificateForm = reactive({
    level: '',
    name: '',
    fileList: [],
});

const visible = ref(false)
const openDrawer = () => {
    visible.value = true
}

const submit = () => {
    console.log(certificateForm)
    let data = {}
    data['name'] = certificateForm.name
    data['level'] = certificateForm.level
    data['url'] = certificateForm.fileList[0].response.data.urls[0]
    data['application_id'] = applicationId
    addDeclaration(data).then((resp) => {
        console.log("addDeclaration调用成功", resp)
        message.success("添加成功")
    }).catch((error) => {
        console.log("addDeclaration调用失败", error)
        message.error("添加失败")
    })
    visible.value = false
}

const headers = ref({
    authorization: localStorage.getItem('token'),
})

const uploadChange = info => {
    if (info.file.status !== 'uploading') {
        console.log("当前文件:", info.file);
        console.log("文件列表:", info.fileList);
        console.log(certificateForm.fileList);
    }
    if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }
};

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
