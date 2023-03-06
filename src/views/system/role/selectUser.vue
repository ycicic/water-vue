<template>
    <!-- 授权用户 -->
    <el-dialog title="选择用户" v-model="visible" width="800px" top="5vh" append-to-body>
        <el-form :model="queryParams" ref="queryRef" :inline="true">
            <el-form-item label="用户名称" prop="userName">
                <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="queryParams.phone" placeholder="请输入手机号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row>
            <el-table @row-click="clickRow" ref="refTable" :data="userList" @selection-change="handleSelectionChange"
                height="260px">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" />
                <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true" />
                <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" />
                <el-table-column label="手机" prop="phone" :show-overflow-tooltip="true" />
                <el-table-column label="状态" align="center" prop="status">
                    <template #default="scope">
                        <el-tag :type="userStatusEnum.getItem(scope.row.status).type">{{
                            userStatusEnum.getLabel(scope.row.status)
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template #default="scope">
                        <span>{{ proxy.parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.currentPage"
                v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-row>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleSelectUser">确 定</el-button>
                <el-button @click="visible = false">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>
 
<script setup name="SelectUser" lang="ts">
import { pageUnallocatedUser, updateAuthUser } from '@/api/role';
import { userStatusEnum } from '@/utils/enums'
import modal from '@/utils/modal';

const emit = defineEmits(["ok"]);

const { proxy } = getCurrentInstance() as any
const userList = ref(<any>[])
const total = ref(0)
const visible = ref(false)
const ids = ref(<any>[])

const props = defineProps({
    roleId: {
        type: [Number, String]
    }
});

const queryParams = reactive({
    currentPage: 1,
    pageSize: 10,
    roleId: undefined as any,
    userName: undefined,
    phone: undefined
})

function show() {
    queryParams.roleId = props.roleId
    getList()
    visible.value = true
}

function getList() {
    pageUnallocatedUser(queryParams).then((res: any) => {
        userList.value = res.data.records
        total.value = res.data.total
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

function clickRow(row: any) {
    proxy.$refs["refTable"].toggleRowSelection(row)
}

function handleSelectionChange(selection: any) {
    ids.value = selection.map((item: any) => item.id)
}

function handleSelectUser() {
    const roleId = queryParams.roleId
    const uIds = ids.value.join(",")
    const userIds = uIds.split(",")

    if (userIds.length === 0) {
        modal.msgError("请选择要分配的用户")
        return
    }

    updateAuthUser({ roleId: roleId, userIds: userIds }).then((res: any) => {
        modal.msgSuccess(res.msg)
        visible.value = false
        emit("ok")
    })
}

defineExpose({
    show,
})

</script>