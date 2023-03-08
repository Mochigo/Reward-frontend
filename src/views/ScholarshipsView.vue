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

    <a-affix :offset-bottom="80" style="position:absolute;bottom:80px; right: 80px;">
        <a-button @click="openModal" type="primary" size="large" style="float: right" shape="round">
            <template #icon>
                <PlusOutlined />
            </template>
            New
        </a-button>
    </a-affix>
    <a-modal v-model:visible="visible" width="1000px" :title="ModalTitle" @ok="handleOk">
        <RouterView />
    </a-modal>

    <a-modal v-model:visible="add_visible" title="新建奖学金项目" @ok="submit">

        <template #footer>
            <a-button key="submit" type="primary" :loading="loading" @click="submit">Submit</a-button>
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
                <MinusCircleOutlined @click="removeScholarshipItem(item)" />
            </a-space>

            <a-form-item>
                <a-button type="dashed" block @click="addScholarshipItem">
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

    <a-pagination v-model:current="current" v-model:pageSize="pageSize" :total="total" @change="handleChange" />
</template>

<script setup>
import { message } from 'ant-design-vue';
import { ref, reactive } from 'vue';
import { getScholarships, createScholarship } from '../requests/scholarships'
import router from '../router';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons-vue';
// 标题字体样式
const pStyle = {
    fontSize: '16px',
    color: 'rgba(0,0,0,0.85)',
    lineHeight: '24px',
    display: 'block',
    marginBottom: '16px',
};

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
        console.log(resp)
    }).catch((error) => {
        console.log(error);
    })


    setTimeout(() => {
        add_visible.value = false;
        loading.value = false;
    }, 2000)
};
const openModal = () => {
    add_visible.value = true;
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

// 奖学金子项列表
const scholarshipItemsForm = reactive({
    scholarshipItems: [],
});
const addScholarshipItem = () => {
    scholarshipItemsForm.scholarshipItems.push({
        name: '',
    })
}
const removeScholarshipItem = item => {
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