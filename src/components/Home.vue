<template>
    <div class="left-list">
        <a-layout-header>
            <p style="color:#fff">奖学金评定管理系统</p>
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

<script>
export default ({
    name: "Home",
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
});
</script>