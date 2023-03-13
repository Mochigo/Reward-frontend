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
            <slot name="sider"></slot>
            <a-layout>
                <!-- <a-layout-header style="background: #fff; padding: 0" /> -->
                <a-layout-content>
                    <slot name="content-top"></slot>
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
import { useRouter } from 'vue-router'
const router = useRouter()

const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    router.push('/login')
}
</script>