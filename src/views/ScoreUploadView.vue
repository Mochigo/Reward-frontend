<template>
    <div class="uploader-container">
        <a-row>
            <a-col :span="12" :offset="6">
                <a-upload-dragger v-model:fileList="fileList" name="file" :max-count="1" action="/api/upload/score"
                    :headers="headers" @change="handleChange">
                    <p class="ant-upload-drag-icon">
                        <inbox-outlined></inbox-outlined>
                    </p>
                    <p class="ant-upload-text">Click or drag file to this area to upload</p>
                    <p class="ant-upload-hint">
                        限制一个文件，上传xlsx格式文件以解析
                    </p>
                </a-upload-dragger>
            </a-col>
        </a-row>
        <a-row justify="end">
            <a-col :pull="6">
                <a-tooltip>
                    <template #title>xlsx文件的上传请参考模板，仅对值进行填充，请勿改动文件其他内容</template>
                    <a href="http://localhost:4096/statics/学分绩上传模板.xlsx">
                        学分绩上传模板.xlsx </a>
                </a-tooltip>
            </a-col>
        </a-row>
    </div>
</template>
<script setup>
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
const fileList = ref([])
const headers = ref({
    authorization: localStorage.getItem('token'),
})
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
</script>

<style scoped>
.uploader-container {

    margin-top: 200px;
    padding: 10%;
}
</style>