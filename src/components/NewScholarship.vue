<template>
    <a-affix :offset-bottom="80" style="position:absolute;bottom:80px; right: 80px;">
        <a-button @click="openModal" type="primary" size="large" style="float: right" shape="round">
            <template #icon>
                <PlusOutlined />
            </template>
            New
        </a-button>
    </a-affix>

    <a-modal v-model:visible="add_visible" title="新建奖学金项目" @ok="submit">

        <template #footer>
            <a-button key="submit" type="primary" :loading="loading" @click="submit()">Submit</a-button>
        </template>

        <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="奖学金名称" :rules="[{ required: true }]">
                <a-input v-model:value="formState.name" />
            </a-form-item>

            <a-form-item label="起止时间" v-bind="rangeConfig">
                <a-range-picker v-model:value="formState['period']" show-time format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss" />
            </a-form-item>

            <a-divider />
            <p :style="pStyle">奖学金子项</p>
            <a-space v-for="(item, index) in scholarshipItemsForm.scholarshipItems" :key="item.id"
                style="margin-bottom: 8px;" align="baseline">
                <a-form-item :rules="{
                    // required: true,
                    message: 'Missing item name',
                }" :label="'子项' + (index + 1)">
                    <a-input v-model:value="item.name" placeholder="ScholarshipItem Name" />
                </a-form-item>
                <MinusCircleOutlined @click="removeItem(item)" />
            </a-space>

            <a-form-item>
                <a-button type="dashed" block @click="addItem">
                    <PlusOutlined />
                    新增子项
                </a-button>
            </a-form-item>

            <a-divider />
            <p :style="pStyle">相关文件上传</p>
            <a-upload name="files" v-model:file-list="fileList" action="/api/upload" :headers="headers"
                :show-upload-list="{ showDownloadIcon: true, showRemoveIcon: true }" @change="uploadChange">
                <a-button>
                    <upload-outlined></upload-outlined>
                    Upload
                </a-button>
                <template #downloadIcon>
                    <download-outlined />
                </template>
                <template #removeIcon>
                    <delete-outlined @click="deleteFile" />
                </template>
            </a-upload>
        </a-form>
    </a-modal>
</template>

<script setup>
// import NewScholarship from '@/components/NewScholarship.vue'; // import 自身完成局部注册
import { PlusOutlined, MinusCircleOutlined, UploadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { ref, reactive } from 'vue';
import { addAttachment } from '../requests/attachments';
import { createScholarship, addScholarshipItem } from '../requests/scholarships'
import { message } from 'ant-design-vue';
// 标题字体样式
const pStyle = {
    fontSize: '16px',
    color: 'rgba(0,0,0,0.85)',
    lineHeight: '24px',
    display: 'block',
    marginBottom: '16px',
};

// 奖学金的属性
const formState = reactive({
    name: '',
    period: [], //返回的是一个[]string index0是starttime, index1是endtime
});
const rangeConfig = {
    rules: [{
        type: 'array',
        required: true,
        message: 'Please select time!',
    }],
};

// 添加新奖学金modal
const add_visible = ref(false);

// 上传的逻辑：
// 在upload的部分上传获得文件地址，这部分无事，哪怕没有和具体奖学金绑定也可以在本地暂存
// 新建奖学金项目并获取新建的奖学金项目的id
// 再根据奖学金项目id和子项名称创建子项
const loading = ref(false)
const submit = () => {
    loading.value = true;
    let data = {}
    data["name"] = formState.name;
    data["start_time"] = formState.period[0];
    data["end_time"] = formState.period[1];

    createScholarship(data).then((resp) => {
        console.log("createScholarship", resp)
        let sid = resp.data.scholarship_id
        scholarshipItemsForm.scholarshipItems.forEach((v, i) => {
            let data = {}
            data["name"] = v.name
            data["scholarship_id"] = sid
            addScholarshipItem(data).then((resp) => {
                console.log("addScholarshipItem", resp)
            }).catch((error) => {
                console.log(error);
            })
        })

        fileList._rawValue.forEach((v, i) => {
            let data = {}
            data["url"] = v.response.data.urls[0]
            data["scholarship_id"] = sid
            addAttachment(data).then((resp) => {
                console.log("addAttachment", resp)
            }).catch((error) => {
                console.log(error);
            })
        })
    }).catch((error) => {
        console.log(error);
    })


    add_visible.value = false;
    loading.value = false;
    setTimeout(() => {
        location.reload()
    }, 1000);
};

const openModal = () => {
    add_visible.value = true;
};

// 奖学金子项列表
const scholarshipItemsForm = reactive({
    scholarshipItems: [],
});
const addItem = () => {
    scholarshipItemsForm.scholarshipItems.push({
        name: '',
    })
}
const removeItem = item => {
    let index = scholarshipItemsForm.scholarshipItems.indexOf(item);
    if (index !== -1) {
        scholarshipItemsForm.scholarshipItems.splice(index, 1);
    }
}

// 上传文件
const fileList = ref([])
const headers = ref({
    authorization: localStorage.getItem('token'),
})

const uploadChange = info => {
    if (info.file.status !== 'uploading') {
        console.log("当前文件:", info.file);
        console.log("文件列表:", info.fileList);
        console.log("filelist", fileList);
    }
    if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }

};

const deleteFile = () => {

}
</script>