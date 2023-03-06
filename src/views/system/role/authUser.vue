
<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" label-width="68px" :inline="true" v-show="showSearch">
            <el-form-item label="用户账号" prop="userName">
                <el-input v-model="queryParams.userName" placeholder="请输入用户账号" clearable style="width: 240px"
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="queryParams.phone" placeholder="请输入手机号码" clearable style="width: 240px"
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="Plus" @click="openSelectUser">添加用户</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="CircleClose" :disabled="multiple"
                    @click="cancelAuthBatch">批量取消授权</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="Close" @click="handleClose">关闭</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="ID" align="center" width="150" key="id" prop="id" />
            <el-table-column label="用户账号" align="center" key="userName" prop="userName" :show-overflow-tooltip="true" />
            <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
            <el-table-column label="邮箱" align="center" key="email" prop="email" :show-overflow-tooltip="true" />
            <el-table-column label="手机号码" align="center" key="phone" prop="phone" />
            <el-table-column label="性别" align="center" key="gender">
                <template #default="scope">
                    <el-tag :type="genderEnum.getItem(scope.row.gender).type">{{
                        genderEnum.getLabel(scope.row.gender)
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" key="status">
                <template #default="scope">
                    <el-tag :type="userStatusEnum.getItem(scope.row.status).type">{{
                        userStatusEnum.getLabel(scope.row.status)
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime">
                <template #default="scope">
                    <span>{{ proxy.parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button style="padding: 8px 0px" text type="primary" icon="CircleClose"
                        @click="cancelAuthBatch(scope.row)">取消授权</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.currentPage"
            v-model:limit="queryParams.pageSize" @pagination="getList" />
        <select-user ref="selectUserRef" :roleId="queryParams.roleId" @ok="handleQuery" />
    </div>
</template>

<script setup name="AuthUser" lang="ts">
import selectUser from "./selectUser.vue";
import { cancelAuthUser, pageAllocatedUser } from '@/api/role'
import { genderEnum, userStatusEnum } from '@/utils/enums'
import modal from '@/utils/modal'

const route = useRoute()
const { proxy } = getCurrentInstance() as any
const loading = ref(true)
const userList = ref(<any>[])
const total = ref(0)
const showSearch = ref(true)
const multiple = ref(true)
const ids = ref(<any>[])

const queryParams = reactive({
    currentPage: 1,
    pageSize: 10,
    roleId: route.params.roleId as any,
    userName: undefined,
    phone: undefined
})

function getList() {
    loading.value = true
    pageAllocatedUser(queryParams).then((res: any) => {
        loading.value = false
        userList.value = res.data.records
        total.value = res.data.total
    }).catch(() => {
        loading.value = false
    })
}

function handleQuery() {
    queryParams.currentPage = 1
    getList()
}

function resetQuery() {
    proxy.resetForm("queryRef")
    handleQuery()
}

function openSelectUser() {
    proxy.$refs["selectUserRef"].show()
}

function cancelAuthBatch(row: any) {
    const roleId = queryParams.roleId;

    const uIds = row.id || ids.value.join(",")
    const userIds = uIds.split(",")

    modal.confirm("是否取消选中用户授权数据项?").then(function () {
        return cancelAuthUser({ roleId: roleId, userIds: userIds });
    }).then(() => {
        getList();
        modal.msgSuccess("取消授权成功");
    }).catch(() => { });
}

function handleSelectionChange(selection: any) {
    ids.value = selection.map((item: any) => item.id);
    multiple.value = !selection.length;
}

function handleClose() {
    const obj = { path: "/system/role" };
    proxy.$tab.closeOpenPage(obj);
}

getList()

</script>
