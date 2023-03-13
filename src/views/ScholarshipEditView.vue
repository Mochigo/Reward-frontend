<template>
    <div class="body">
        <a-row>
            <a-col :span="12">
                <p :style="pStyle">子项列表</p>
            </a-col>
            <a-col :span="12">
                <a-popover title="新建子项" trigger="click" placement="bottomRight">
                    <template #content>
                        <a-form layout="inline" :model="addItemState">
                            <a-form-item name="price" label="子项名">
                                <a-input v-model:value="addItemState.name" />
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" @click="addItem">Submit</a-button>
                            </a-form-item>
                        </a-form>
                    </template>
                    <a-button type="primary" style="float: right">
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        New
                    </a-button>
                </a-popover>
            </a-col>
        </a-row>
        <a-list :data-source="scholarshipItems" bordered>
            <a-list-item v-for="(item, index) in scholarshipItems" :key="index" style="width:100%;">
                <template #actions>
                    <a-popconfirm title="Are you sure remove the item?" ok-text="Yes" cancel-text="No"
                        @confirm="deleteScholarshipItem(item.id)" @cancel="cancel">
                        <a-button danger>Remove</a-button>
                    </a-popconfirm>

                </template>
                <a-list-item-meta>
                    <template #title>
                        <a>{{ item.name }}</a>
                    </template>
                </a-list-item-meta>
            </a-list-item>
        </a-list>
        <a-divider />
        <p :style="pStyle">说明文件</p>
        <a-list :data-source="attachments" bordered>
            <a-list-item v-for="(item, index) in attachments" :key="index" style="width:100%;">
                <template #actions>
                    <a-popconfirm title="Are you sure remove the file?" ok-text="Yes" cancel-text="No"
                        @confirm="deleleAttachment(item.attachment_id)" @cancel="cancel">
                        <a-button danger>Remove</a-button>
                    </a-popconfirm>
                </template>
                <a-list-item-meta>
                    <template #title>
                        <a :href="item.url">{{ item.url.split('/').slice(-1)[0] }}</a>
                    </template>
                </a-list-item-meta>
            </a-list-item>
        </a-list>
        <div style="top: 10px;">
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
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRoute } from "vue-router";
import { getScholarshipItems, removeScholarshipItem, addScholarshipItem } from '../requests/scholarships';
import { getAttachments, addAttachment, removeAttachment } from '../requests/attachments';
import { PlusOutlined, UploadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const pStyle = {
    fontSize: '16px',
    color: 'rgba(0,0,0,0.85)',
    lineHeight: '24px',
    display: 'block',
    marginBottom: '16px',
};

const route = useRoute(); //route 和 router 有差别

const getScholarshipItemList = () => {
    getScholarshipItems(route.params.id)
        .then((resp) => {
            console.log(route.params.id)
            console.log("getScholarshipItems", resp)
            scholarshipItems.value = resp.data
        }).catch((error) => {
            console.log(error)
        })
}


let scholarshipItems = ref([]);
let attachments = ref([]);
const init = () => {
    getScholarshipItemList()

    getAttachments(route.params.id)
        .then((resp) => {
            console.log("getAttachments", resp)
            attachments.value = resp.data
        }).catch((error) => {
            console.log(error)
        })

}
init();

const deleteScholarshipItem = (id) => {
    console.log(id)
    removeScholarshipItem(id).then((resp) => {
        // location.reload()
    }).catch((error) => {
        console.log(error)
    })
}

const cancel = (e) => {
    console.log(e)
}

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
        addFile(info.file.response.data.urls[0])
    } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }

};

const deleteFile = () => {

}

const deleleAttachment = (id) => {
    console.log(id)
    removeAttachment(id).then((resp) => {
        // location.reload()
    }).catch((error) => {
        console.log(error)
    })
}


const addItemState = reactive({
    name: '',
})

const addItem = () => {
    let data = {}
    data["name"] = addItemState.name
    data["scholarship_id"] = parseInt(route.params.id) // route.params.id类型为string，需要转换为int
    addScholarshipItem(data).then((resp) => {
        console.log("addScholarshipItem", resp)
    }).catch((error) => {
        console.log(error);
    })
}

const addFile = (url) => {
    let data = {}
    data["url"] = url
    data["scholarship_id"] = parseInt(route.params.id) // route.params.id类型为string，需要转换为int
    addAttachment(data).then((resp) => {
        console.log("addAttachment", resp)
    }).catch((error) => {
        console.log(error);
    })
}
</script>


