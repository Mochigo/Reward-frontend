<template>
    <div class="left-list">
        <a-layout-header>
            <a-row>
                <a-col :span="12">
                    <p style="color:#fff">奖学金评定管理系统</p>
                </a-col>
                <a-col :span="12">
                    <a style="color: white; float: right" @click="logout()">Logout</a>
                </a-col>
            </a-row>
        </a-layout-header>
        <a-layout style="min-height: 100vh">

            <a-layout-sider>
                <!-- <div class="logo" /> -->
                <a-menu theme="dark" v-if="role === 'STUDENT'" v-model:selectedKeys="selectedKeys"
                    defaultSelectedKeys="/scholarships" @click="handleClick" mode="inline">
                    <a-menu-item key="/scholarships">
                        <span>奖学金项目列表</span>
                    </a-menu-item>
                    <a-menu-item key="/applications">
                        <span>我的申请</span>
                    </a-menu-item>
                </a-menu>
                <a-menu theme="dark" v-if="role === 'SECRETARY'" v-model:selectedKeys="selectedKeys"
                    v-model:openKeys="openKeys" defaultSelectedKeys="/scholarships" mode="inline" @click="handleClick">
                    <a-menu-item key="/scholarships">
                        <span>奖学金项目列表</span>
                    </a-menu-item>
                    <a-sub-menu key="学务管理" @titleClick="titleClick">
                        <template #title>学务管理</template>
                        <a-menu-item key="/score">上传学分绩</a-menu-item>
                        <!-- <a-menu-item key="/punishment">上传处分</a-menu-item> -->
                    </a-sub-menu>
                </a-menu>
            </a-layout-sider>

            <a-layout>
                <!-- <a-layout-header style="background: #fff; padding: 0" /> -->
                <a-layout-content>
                    <router-view></router-view>
                </a-layout-content>
                <a-layout-footer style="text-align: center">
                    Presented by Mochigo
                </a-layout-footer>
            </a-layout>
        </a-layout>
    </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';

const openKeys = ref(['/applications']);
const selectedKeys = ref(["/scholarships"]);

const router = useRouter();
const route = useRoute();

const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    router.push('/login')
}

const role = localStorage.getItem('role')

const titleClick = () => {
    console.log(selectedKeys.value)
    console.log(openKeys.value)
}

const handleClick = item => {
    if (item.key !== route.path) {
        router.push(item.key);
    }
}
</script>
