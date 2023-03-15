<template>
    <div class="uploader-container">
        <a-row>
            <a-col :span="24" :offset="12">
                <a-upload-dragger v-model:fileList="fileList" name="file" :multiple="true"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="handleChange" @drop="handleDrop">
                    <p class="ant-upload-drag-icon">
                        <inbox-outlined></inbox-outlined>
                    </p>
                    <p class="ant-upload-text">Click or drag file to this area to upload</p>
                    <p class="ant-upload-hint">
                        上传csv格式文件以解析
                    </p>
                </a-upload-dragger>
            </a-col>
        </a-row>
    </div>
</template>
<script setup>
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
const fileList = ref([])
const handleChange = info => {
    const status = info.file.status;
    if (status !== 'uploading') {
        console.log(info.file, info.fileList);
    }
    if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }
};

const handleDrop = e => {
    console.log(e);
}

</script>

<style scoped>
.uploader-container {
    width: 50%;
    margin-top: 200px;
}
</style>