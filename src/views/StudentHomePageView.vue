<template>
    <Home>
        <template v-slot:sider>
            <a-layout-sider>
                <!-- <div class="logo" /> -->
                <a-menu theme="dark" v-if="role === 'STUDENT'" :selectedKeys="[$route.path]"
                    defaultSelectedKeys="/scholarships" @click="handleClick" mode="inline">
                    <a-menu-item key="/scholarships">
                        <span>奖学金项目列表</span>
                    </a-menu-item>
                    <a-menu-item key="/applications">
                        <span>我的申请</span>
                    </a-menu-item>
                </a-menu>
                <a-menu theme="dark" v-if="role === 'SECRETARY'" :selectedKeys="[$route.path]"
                    defaultSelectedKeys="/scholarships" @click="handleClick" mode="inline">
                    <a-menu-item key="/scholarships">
                        <span>奖学金项目列表</span>
                    </a-menu-item>
                    <!-- <a-menu-item key="/applications">
                        <span>我的申请</span>
                    </a-menu-item> -->
                </a-menu>
                <!-- <a-menu theme="dark" v-if="role === 'TEACHER'" :selectedKeys="[$route.path]"
                    defaultSelectedKeys="/scholarships" @click="handleClick" mode="inline">
                    <a-menu-item key="/scholarships">
                        <span>奖学金项目列表</span>
                    </a-menu-item>
                    <a-menu-item key="/applications">
                        <span>我的申请</span>
                    </a-menu-item>
                </a-menu> -->
            </a-layout-sider>
        </template>
    </Home>
</template>
<script setup>
import Home from '@/components/Home.vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const role = localStorage.getItem('role')

const handleClick = item => {
    if (item.key !== route.path) {
        router.push(item.key);
    }
}
</script>
