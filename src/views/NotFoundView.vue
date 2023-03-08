<template>
    <div class="error">
        <div class="container-floud">
            <div style="text-align: center">
                <div class="container-error-404">
                    <a-space size="large">
                        <div class="msg">
                            <span class="triangle"></span>
                            <p>OH!</p>
                        </div>
                        <a-space>
                            <ScrollNum :key="1" as="li" :i="4" :delay="0.5" class="digit" />
                            <ScrollNum :key="1" as="li" :i="0" :delay="1.5" class="digit" />
                            <ScrollNum :key="1" as="li" :i="4" :delay="2.5" class="digit" />
                        </a-space>
                    </a-space>
                </div>
                <h2 class="h1">很抱歉，你访问的页面找不到了</h2>
            </div>
        </div>
    </div>
</template>

<script>
import ScrollNum from '../components/CountTo.vue';
import { ref } from 'vue';

export default {
    components: { ScrollNum },

    setup() {
        const num = ref('404');
    }
}
</script>

<style scoped>
.container-error-404 {
    top: 50%;
    margin-top: 250px;
    position: relative;
    height: 250px;
    padding-top: 40px;
}

.digit {
    position: relative;
    top: 8%;
    color: white;
    background: #1E9FFF;
    border-radius: 50%;
    display: inline-block;
    /* transform: skew(45deg); */
    width: 150px;
    height: 150px;
    line-height: 150px;
    font-size: 120px;
    font-weight: bold;
    --witdh: 150px;
}

.msg {
    position: relative;
    z-index: 9999;
    display: block;
    background: #535353;
    color: #A2A2A2;
    border-radius: 50%;
    font-style: italic;

    margin: -73px;
    width: 80px;
    height: 80px;
    line-height: 80px;
    font-size: 32px;
}

.triangle {
    top: 70%;
    right: 0%;
    border-left: 20px solid #535353;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;

    position: absolute;
    z-index: 999;
    transform: rotate(45deg);
    content: "";
    width: 0;
    height: 0;
}

h2 {
    font-size: 24px;
    color: #A2A2A2;
    font-weight: bold;
    padding-bottom: 20px;
}

@media(max-width: 767px) {
    .container-error-404 {
        height: 150px;
    }

    .digit {
        width: 80px;
        height: 80px;
        line-height: 80px;
        font-size: 52px;
    }

    .msg {
        margin: -73px;
        left: 15%;
        width: 40px;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
    }

    .triangle {
        top: 70%;
        right: -3%;
        border-left: 10px solid #535353;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
    }

    h2 {
        font-size: 18px;
    }
}
</style>