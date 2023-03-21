<template>
    <a-table :columns="columns" :data-source="declarations" :pagination="pagination" :loading="loading"
        @change="handleTableChange()">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key == 'status'">
                <a-badge v-if="record.status === 'PROCESS'" status="processing" :text="record.status" />
                <a-badge v-if="record.status === 'APPROVED'" status="success" :text="record.status" />
            </template>
            <template v-if="column.key === 'action'">
                <a-space>
                    <a-button type="primary" @click="approve(record.id)">通过</a-button>
                    <a-popover placement="bottomRight" trigger="click" v-model:visible="popoverVisible">
                        <template #content>
                            <a-textarea style="margin-bottom: 10px;" v-model:value="rejectReason" placeholder="驳回理由"
                                :rows="3" :maxlength="255" />
                            <a-row justify="end">
                                <a-space>
                                    <a-button @click="(id) => { popoverVisible = false }">取消</a-button>
                                    <a-button type="primary" danger @click="reject(record.id)">确认</a-button>
                                </a-space>
                            </a-row>
                        </template>
                        <a-button type="primary" danger>驳回</a-button>
                    </a-popover>
                </a-space>
            </template>
            <template v-if="column.key === 'level'">
                <p>{{ PrizeName.get(record.level) }}</p>
            </template>
            <template v-if="column.key === 'url'">
                <viewer v-if="isImage(record.url)">
                    <img :width="200" :src="record.url" />
                </viewer>
                <!-- <a-image v-if="isImage(record.url)" :width="200" :src="record.url" :preview="true" /> -->
                <a v-if="!isImage(record.url)" :href="record.url"> {{ record.url.split('/').slice(-1)[0] }}</a>
            </template>
        </template>
    </a-table>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { getStudentsDeclarations } from '../requests/teacher'
import { auditDelaration } from '../requests/declaration'
import { message } from 'ant-design-vue';


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

let declarations = ref([]);
let pageSize = 10;
let current = 1;
const loading = ref(false);
const rejectReason = ref('');
const popoverVisible = ref(false)

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

const handleTableChange = () => {
    getDeclarations()
}

const getDeclarations = () => {
    loading.value = true
    getStudentsDeclarations(current, pageSize).then((resp) => {
        console.log(resp);
        declarations.value = resp.data.declarations;
        pagination.total = resp.data.total;
    }
    ).catch(error => {
        console.log(error)
    })
    loading.value = false;
}

getDeclarations()

const columns = [
    {
        title: '申报项名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: '申报项级别',
        dataIndex: 'level',
        key: 'level',
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        ellipsis: true,
    },
    {
        title: '文件',
        key: 'url',
        dataIndex: 'url',
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'action',
    },
];

const isImage = (url) => {
    return (url.match(/\.(jpeg|jpg|gif|png|JPEG|JPG|GIF|PNG)$/) != null)
}

const OperationApprove = "APPROVE"
const OperationReject = "REJECT"


const reject = (id) => {
    popoverVisible.value = false
    let data = {}
    data["declaration_id"] = id
    data["rejected_reason"] = rejectReason.value
    data["operation"] = OperationReject

    auditDelaration(data).then((resp) => {
        console.log("auditDelaration调用成功", resp)
        message.success("Success")
    }).catch(e => {
        console.log("auditDelaration调用失败", e)
        message.error("Fail to reject")
    })
}
const approve = (id) => {
    let data = {}
    data["declaration_id"] = id
    data["operation"] = OperationApprove

    auditDelaration(data).then((resp) => {
        console.log("auditDelaration调用成功", resp)
        message.success("Success")
    }).catch(e => {
        console.log("auditDelaration调用失败", e)
        message.error("Fail to approve")
    })
}
</script>