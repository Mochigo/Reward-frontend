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
            <a-typography-title :level="4">荣誉列表</a-typography-title>
        </a-col>
        <a-col :span="12">
            <a-button type="primary" style="float: right;" @click="openDrawer">
                <template #icon>
                    <PlusOutlined />
                </template>
                New
            </a-button>
        </a-col>
        <a-descriptions v-for="certificate in certificates" bordered>
            <a-descriptions-item label="荣誉名称">{{ certificate.name }}</a-descriptions-item>
            <a-descriptions-item label="荣誉级别">{{ PrizeName.get(certificate.level) }}</a-descriptions-item>
            <a-descriptions-item label="审核状态">
                <a-badge v-if="certificate.status === StatusProcess" status="processing" :text="certificate.status" />
                <a-badge v-if="certificate.status === StatusApproved" status="success" :text="certificate.status" />
                <a-badge v-if="certificate.status === StatusRejected" status="error" :text="certificate.status" />
            </a-descriptions-item>
            <a-descriptions-item label="文件">
                <a-image v-if="isImage(certificate.url)" :width="200" :src="certificate.url" />
                <a v-if="!isImage(certificate.url)" :href="certificate.url"> {{ certificate.url.split('/').slice(-1)[0]
                }}</a>
            </a-descriptions-item>
        </a-descriptions>
    </a-row>

    <a-drawer v-model:visible="visible" title="新建荣誉" width="600" :closable="false" :footer-style="{ textAlign: 'right' }">
        <template #footer>
            <a-button type="primary" @click="submit()">
                Submit
            </a-button>
        </template>
        <a-form :model="certificateForm" layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-form-item label="荣誉名称" :rules="[{ required: true }]">
                <a-input v-model:value="certificateForm.name" />
            </a-form-item>
            <a-form-item label="荣誉级别" :rules="[{ required: true }]">
                <a-radio-group v-model:value="certificateForm.level" name="radioGroup">
                    <a-radio :value="levelSchool">{{ PrizeName.get(levelSchool) }}</a-radio>
                    <a-radio :value="levelProvincial">{{ PrizeName.get(levelProvincial) }}</a-radio>
                    <a-radio :value="levelNational">{{ PrizeName.get(levelNational) }}</a-radio>
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
import { addCertificate, getCertificates } from '../requests/certificate';
import { getStudentInfo } from '../requests/student'

const reload = inject('reload')

const levelNational = '03'
const levelSchool = '01'
const levelProvincial = '02'

let PrizeName = new Map([[levelNational, "国家级"], [levelProvincial, "省级"], [levelSchool, "校级"]])

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
    addCertificate(data).then((resp) => {
        console.log("addCertificate调用成功", resp)
        message.success("添加成功")
    }).catch((error) => {
        console.log("addCertificate调用失败", error)
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
const getCertificateList = () => {
    getCertificates(applicationId).then((resp) => {
        console.log("getCertificates调用成功", resp)
        certificates.value = resp.data
    }).catch((e) => {
        console.log("getCertificates调用失败", e)
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
    getCertificateList()
    getStudent()
}
init()

const StatusApproved = "APPROVED"
const StatusRejected = "REJECTED"
const StatusProcess = "PROCESS"


const isImage = (url) => {
    return (url.match(/\.(jpeg|jpg|gif|png|JPEG|JPG|GIF|PNG)$/) != null)
}
</script>
