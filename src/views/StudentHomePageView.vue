<template>
    <Home>
        <template v-slot:sider>
            <a-layout-sider>
                <!-- <div class="logo" /> -->
                <a-menu theme="dark" :selectedKeys="[$route.path]" defaultSelectedKeys="/scholarships" @click="handleClick"
                    mode="inline">
                    <a-menu-item key="/scholarships">
                        <span>奖学金项目列表</span>
                    </a-menu-item>
                    <a-menu-item key="/applications">
                        <span>我的申请</span>
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>
        </template>
    </Home>
</template>

<script>
import Home from '@/components/Home.vue';

export default ({
    components: {
        Home,
    },
    setup() {
        const titleClick = e => {
            console.log('titleClick', e);
        };
        return {
            titleClick,
        };

    },
    methods: {
        handleClick(item) {
            if (item.key !== this.$route.path) {
                this.$router.push(item.key)
            }
        }
    },
})

</script>
