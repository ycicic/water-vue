<template>
    <div class="login">
        <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
            <h3 class="title">{{ title }}</h3>
            <el-form-item prop="userName">
                <el-input v-model="loginForm.userName" type="text" size="large" auto-complete="off" placeholder="账号">
                    <template #prefix><el-icon class="el-input__icon input-icon">
                            <User />
                        </el-icon></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" placeholder="密码"
                    @keyup.enter="handleLogin">
                    <template #prefix><el-icon class="el-input__icon input-icon">
                            <Lock />
                        </el-icon></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaOnOff">
                <el-input v-model="loginForm.code" size="large" auto-complete="off" placeholder="验证码" style="width: 63%"
                    @keyup.enter="handleLogin">
                    <template #prefix><el-icon class="el-input__icon input-icon">
                            <MessageBox />
                        </el-icon></template>
                </el-input>
                <div class="login-code">
                    <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button :loading="loading" size="large" type="primary" style="width:100%;"
                    @click.prevent="handleLogin">
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
                <div style="float: right;" v-if="register">
                    <router-link class="link-type" :to="'/register'">立即注册</router-link>
                </div>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <div class="el-login-footer">
            <!-- <span>Copyright © 2018-2022 ycicic.cn All Rights Reserved.</span> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from '@/store/modules/user'

const title = import.meta.env.VITE_APP_TITLE;

const userStore = useUserStore()
const router = useRouter();
const { proxy } = getCurrentInstance() as any;

const loginForm = ref({
    userName: "",
    password: "",
    rememberMe: false,
    code: "",
    uuid: ""
});

const loginRules = {
    userName: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
    password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
    code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaOnOff = ref(true);
// 注册开关
const register = ref(false);
const redirect = ref();

function handleLogin() {
    proxy.$refs.loginRef.validate((valid: boolean) => {
        if (valid) {
            loading.value = true;
            
            // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
            if (loginForm.value.rememberMe) {
                Cookies.set("userName", loginForm.value.userName, { expires: 30 });
                Cookies.set("password", `${encrypt(loginForm.value.password)}`, { expires: 30 });
                Cookies.set("rememberMe", `${loginForm.value.rememberMe}`, { expires: 30 });
            } else {
                // 否则移除
                Cookies.remove("userName");
                Cookies.remove("password");
                Cookies.remove("rememberMe");
            }
            // 调用action的登录方法
            userStore.login(loginForm.value).then(() => {
                router.push({ path: redirect.value || "/" });
            }).catch(() => {
                loading.value = false;
                // 重新获取验证码
                if (captchaOnOff.value) {
                    getCode();
                }
            });
        }
    });
}

function getCode() {
    getCodeImg().then((res: any) => {
        codeUrl.value = "data:image/gif;base64," + res.img;
        loginForm.value.uuid = res.uuid;
    });
}

function getCookie() {
    const userName = Cookies.get("userName");
    const password = Cookies.get("password");
    const rememberMe = Cookies.get("rememberMe");
    loginForm.value = {
        userName: userName === undefined ? loginForm.value.userName : userName,
        password: `${password === undefined ? loginForm.value.password : decrypt(password)}`,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        code: "",
        uuid: ""
    };
}

getCode();
getCookie();
</script>

<style lang='scss' scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../assets/images/login-background.jpg");
    background-size: cover;
}

.title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #666666;
}

.login-form {
    border-radius: 6px;
    background: rgba(255, 255, 255, .65);
    width: 400px;
    padding: 25px 25px 5px 25px;

    .el-input {
        height: 40px;

        input {
            height: 40px;
        }
    }

    .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 0px;
    }
}

.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}

.login-code {
    width: 33%;
    height: 40px;
    float: right;

    img {
        cursor: pointer;
        vertical-align: middle;
    }
}

.el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
}

.login-code-img {
    height: 40px;
    padding-left: 12px;
}
</style>
