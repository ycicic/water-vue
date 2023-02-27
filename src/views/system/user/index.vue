<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="20" :xs="24">
                <el-form :model="queryParams" ref="queryRef" label-width="68px" :inline="true" v-show="showSearch">
                    <el-form-item label="用户账号" prop="userName">
                        <el-input v-model="queryParams.userName" placeholder="请输入用户账号" clearable style="width: 240px"
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickName">
                        <el-input v-model="queryParams.nickName" placeholder="请输入用户昵称" clearable style="width: 240px"
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="queryParams.phone" placeholder="请输入手机号码" clearable style="width: 240px"
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width: 240px">
                            <el-option v-for="item in userStatusEnum.enums" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间" style="width: 308px;font-weight: 700;">
                        <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange"
                            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button></el-col>
                    <el-col :span="1.5">
                        <el-button type="success" plain icon="Edit" :disabled="single"
                            @click="handleUpdate">修改</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="danger" plain icon="Delete" :disabled="multiple"
                            @click="handleDelete">删除</el-button>
                    </el-col>
                    <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"
                        :columns="columns"></right-toolbar>
                </el-row>

                <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column label="ID" align="center" width="150" key="id" prop="id"
                        v-if="columns[0].visible" />
                    <el-table-column label="用户头像" align="center" key="avatar" prop="avatar" v-if="columns[1].visible">
                        <template #default="scope">
                            <el-avatar :src="scope.row.avatar" fit="fill" />
                        </template>
                    </el-table-column>
                    <el-table-column label="用户账号" align="center" key="userName" prop="userName"
                        v-if="columns[2].visible" :show-overflow-tooltip="true" />
                    <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"
                        v-if="columns[3].visible" :show-overflow-tooltip="true" />
                    <el-table-column label="邮箱" align="center" key="email" prop="email" v-if="columns[4].visible"
                        :show-overflow-tooltip="true" />
                    <el-table-column label="手机号码" align="center" key="phone" prop="phone" v-if="columns[5].visible"
                        width="120" />
                    <el-table-column label="性别" align="center" key="gender" v-if="columns[6].visible">
                        <template #default="scope">
                            <el-tag :type="genderEnum.getItem(scope.row.gender).type">{{
                                genderEnum.getLabel(scope.row.gender)
                            }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center" key="status" v-if="columns[7].visible">
                        <template #default="scope">
                            <el-switch :model-value="scope.row.status" :active-value="0" :inactive-value="1"
                                @change="handleStatusChange(scope.row)"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible"
                        width="160">
                        <template #default="scope">
                            <span>{{ proxy.parseTime(scope.row.createTime) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
                        <template #default="scope">
                            <el-tooltip content="修改" placement="top" v-if="scope.row.id !== 1">
                                <el-button text type="primary" icon="Edit" style="padding: 8px 0px"
                                    @click="handleUpdate(scope.row)">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top" v-if="scope.row.id !== 1">
                                <el-button text type="primary" icon="Delete" style="padding: 8px 0px"
                                    @click="handleDelete(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="重置密码" placement="top" v-if="scope.row.id !== 1">
                                <el-button text type="primary" icon="Key" style="padding: 8px 0px"
                                    @click="handleResetPwd(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip content="分配角色" placement="top" v-if="scope.row.id !== 1">
                                <el-button text type="primary" icon="CircleCheck" style="padding: 8px 0px"
                                    @click="handleAuthRole(scope.row)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0" :total="total" v-model:page="queryParams.currentPage"
                    v-model:limit="queryParams.pageSize" @pagination="getList" />
            </el-col>
        </el-row>

        <el-dialog :title="dialogTitle" v-model="dialogOpen" width="600px" append-to-body>
            <el-form :model="saveParams" :rules="rules" ref="userRef" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户昵称" prop="nickName">
                            <el-input v-model="saveParams.nickName" placeholder="请输入用户昵称" maxlength="30" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户账号" prop="userName">
                            <el-input v-model="saveParams.userName" placeholder="请输入用户账号" maxlength="30"
                                :disabled="saveParams.id != undefined" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="saveParams.id == undefined" label="用户密码" prop="password">
                            <el-input v-model="saveParams.password" placeholder="请输入用户密码" type="password" maxlength="20"
                                show-password />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="phone">
                            <el-input v-model="saveParams.phone" placeholder="请输入手机号码" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="saveParams.email" placeholder="请输入邮箱" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户性别">
                            <el-select v-model="saveParams.gender" placeholder="请选择">
                                <el-option v-for="dict in genderEnum.enums" :key="dict.value" :label="dict.label"
                                    :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-radio-group v-model="saveParams.status">
                                <el-radio v-for="dict in userStatusEnum.enums" :key="dict.value" :label="dict.value">{{
                                    dict.label
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input v-model="saveParams.remark" type="textarea" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="dialogSubmit">确 定</el-button>
                    <el-button @click="dialogCancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>

    </div>
</template>

<script setup lang="ts">
import { userStatusEnum, genderEnum } from '@/utils/enums'
import { pageUser, changeUserStatus, resetUserPwd, saveUser, getUser, delUser } from '@/api/user'
import modal from '@/utils/modal'
import router from '@/router';

const { proxy } = getCurrentInstance() as any
const loading = ref(true)
const dateRange = ref(<any>[])
const userList = ref(<any>[])
const total = ref(0)
const showSearch = ref(true)
const ids = ref(<any>[])
const single = ref(true)
const multiple = ref(true)

const dialogTitle = ref('')
const dialogOpen = ref(false)

const columns = ref([
    { key: 0, label: `用户编号`, visible: true },
    { key: 1, label: `用户头像`, visible: true },
    { key: 2, label: `用户账号`, visible: true },
    { key: 3, label: `用户昵称`, visible: true },
    { key: 4, label: `邮箱`, visible: true },
    { key: 5, label: `手机号码`, visible: true },
    { key: 6, label: `性别`, visible: true },
    { key: 7, label: `状态`, visible: true },
    { key: 8, label: `创建时间`, visible: true }
])

const data = reactive({
    saveParams: {
        id: undefined,
        userName: undefined,
        nickName: undefined,
        email: undefined,
        phone: undefined,
        gender: undefined,
        avatar: undefined,
        password: undefined,
        status: 0,
        remark: undefined,
    },
    queryParams: {
        currentPage: 1,
        pageSize: 10,
        userName: undefined,
        nickName: undefined,
        phone: undefined,
        status: undefined
    },
    rules: {
        userName: [{ required: true, message: "用户账号不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户账号长度必须介于 2 和 20 之间", trigger: "blur" }],
        nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
        password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }, { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" }],
        email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
        phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
    }
})

const { queryParams, saveParams, rules } = toRefs(data)

function handleQuery() {
    queryParams.value.currentPage = 1
    getList()
}

function resetQuery() {
    dateRange.value = []
    proxy.resetForm("queryRef")
    handleQuery()
}

function resetUser() {
    saveParams.value = {
        id: undefined,
        userName: undefined,
        nickName: undefined,
        email: undefined,
        phone: undefined,
        gender: undefined,
        avatar: undefined,
        password: undefined,
        status: 0,
        remark: undefined,
    }
    proxy.resetForm("userRef")
}

function handleAdd() {
    resetUser()
    dialogOpen.value = true
    dialogTitle.value = "新增用户"
}

function handleUpdate(row: any) {
    resetUser()
    const id = row.id || ids.value
    getUser(id).then((res: any) => {
        for (const key in saveParams.value) {
            (saveParams.value as any)[key] = res[key]
        }
        dialogOpen.value = true
        dialogTitle.value = "修改用户"
    })
}

function handleDelete(row: any) {
    const userIds = row.id || ids.value
    modal.confirm('是否确认删除用户ID为"' + userIds + '"的数据项？').then(function () {
        return delUser(userIds)
    }).then(() => {
        getList();
        modal.msgSuccess("删除成功")
    })
}

function handleAuthRole(row: any) {
    const id = row.id
    // TODO  router.push("/system/user-auth/role/" + id)
}

/** 重置密码按钮操作 */
function handleResetPwd(row: any) {
    proxy.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
    }).then(({ value }: any) => {
        resetUserPwd(row.id, value).then(response => {
            proxy.$modal.msgSuccess("修改成功，新密码是：" + value)
        })
    }).catch(() => { })
}

function handleStatusChange(row: any) {
    let text = row.status == 1 ? "启用" : "停用";
    modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(async () => {

        row.status = row.status == 0 ? 1 : 0;
        await changeUserStatus(row.id, row.status);
        modal.msgSuccess(text + "成功");
    })
}

function handleSelectionChange(selection: any) {
    ids.value = selection.map((item: any) => item.id)
    single.value = selection.length != 1
    multiple.value = !selection.length
}

function getList() {
    loading.value = true
    pageUser(proxy.addDateRange(queryParams.value, dateRange.value, 'Create')).then((res: any) => {
        loading.value = false
        userList.value = res.records
        total.value = res.total
    }).catch(() => {
        loading.value = false
    })
}

function dialogSubmit() {
    proxy.$refs["userRef"].validate((valid: any) => {
        if (valid) {
            saveUser(saveParams.value).then(() => {
                modal.msgSuccess("保存成功")
                dialogOpen.value = false
                getList()
            })
        }
    })
}

function dialogCancel() {
    dialogOpen.value = false
    resetUser()
}

getList()

</script>