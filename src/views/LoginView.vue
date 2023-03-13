<template>
    <div class="login">
        <div id="login-box">
            <a-space>
                <div class="content-left">
                    <div class="logo">
                        <img src="../assets/ccnu.png" style="width:140px; margin-left:10px; margin-bottom: 10px;" />

                        <p>奖学金评定管理系统</p>
                    </div>
                </div>
                <div id="divide"></div>
                <div class="container">
                    <a-form :model="formState" name="login" class="login-form">
                        <a-form-item name="username" :rules="[{ required: true, message: 'Please input your uid!' }]">
                            <a-input v-model:value="formState.username" size="large" allow-clear placeholder="UID">
                                <template #prefix>
                                    <UserOutlined class="site-form-item-icon" />
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
                            <a-input-password v-model:value="formState.password" size="large" allow-clear
                                placeholder="Password">
                                <template #prefix>
                                    <LockOutlined class="site-form-item-icon" />
                                </template>
                            </a-input-password>
                        </a-form-item>
                        <a-form-item>
                            <a-form-item name="remember" no-style>
                                <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
                            </a-form-item>
                            <!-- <a class="login-form-forgot" href="">Forgot password</a> -->
                            <!-- TODO -->
                            <a-switch class="switch" v-model:checked="formState.IsStudent" checked-children="学生"
                                un-checked-children="教师" />
                        </a-form-item>
                        <a-form-item>
                            <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button"
                                size="large" @click="submit()">
                                Log in
                            </a-button>
                            <!-- Or
            <a href="">register now!</a> -->
                        </a-form-item>
                    </a-form>
                </div>
            </a-space>
        </div>
    </div>
</template>
<script setup>
import { reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { loginStudent, loginTeacher } from '../requests/login';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const submit = () => {
    let data = {};
    data['password'] = formState.password;
    data['uid'] = formState.username;

    if (formState.IsStudent) {
        loginStudent(data).then(res => {
            message.success("Login Success")

            window.localStorage.setItem('token', res.data.token);
            window.localStorage.setItem('role', "STUDENT");
            router.push({ path: '/home' });
        }).catch((error) => {
            message.error(error.response.data.message)
            console.log(error);
        })
    } else {
        loginTeacher(data).then(res => {
            message.success("Login Success")

            window.localStorage.setItem('token', res.data.token);
            window.localStorage.setItem('role', res.data.role);
            router.push({ path: '/home' });
        }).catch((error) => {
            message.error(error.response.data.message)
            console.log(error);
        })
    }
}

const formState = reactive({
    username: '',
    password: '',
    remember: true,
    IsStudent: true,
});

const disabled = computed(() => {
    return !(formState.username && formState.password);
});

</script>
<style scoped>
.login-form {
    max-width: 400px;
}

.login-form-forgot {
    float: right;
}

.login-form-button {
    width: 100%;
}

#login-box {
    /* display: flex; */
    /* padding: auto; */
    background-color: rgba(69, 152, 205, 0.8);
    width: 960px;
    height: 590px;
    border-radius: 10px;
    padding: 184px 90px 0;
    margin: 80px, auto;
}

.login {
    margin: auto;
}

.switch {
    float: right;
}


.logo {
    font-size: 24px;
    color: white;
    text-align: center;
    width: 312px;
    /* margin-left: 10px;
    margin-top: 40px; */
}

.container {
    margin-left: 65px;
    width: 399px;
    float: right;
}

#divide {
    width: 2px;
    height: 100px;
    background: #fff;
    margin-top: -38px;
    float: left;
}
</style>