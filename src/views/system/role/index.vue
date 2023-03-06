<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" clearable style="width: 240px"
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="角色状态" clearable style="width: 240px">
                    <el-option v-for="dict in roleStatusEnum.enums" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间" style="width: 308px;font-weight: 700;">
                <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
                    start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <!-- 表格数据 -->
        <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="ID" align="center" prop="id" width="150" />
            <el-table-column label="角色名称" align="center" prop="roleName" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="显示顺序" align="center" prop="roleSort" width="100" />
            <el-table-column label="状态" align="center" key="stats" width="100">
                <template #default="scope">
                    <el-switch :model-value="scope.row.status" :active-value="0" :inactive-value="1"
                        @change="handleStatusChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime">
                <template #default="scope">
                    <span>{{ proxy.parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-tooltip content="修改" placement="top" v-if="scope.row.id !== 1">
                        <el-button text type="primary" icon="Edit" style="padding: 8px 0px"
                            @click="handleUpdate(scope.row)">
                        </el-button> </el-tooltip>
                    <el-tooltip content="删除" placement="top" v-if="scope.row.id !== 1">
                        <el-button text type="primary" icon="Delete" style="padding: 8px 0px"
                            @click="handleDelete(scope.row)"></el-button> </el-tooltip>
                    <el-tooltip content="分配用户" placement="top" v-if="scope.row.id !== 1">
                        <el-button text type="primary" icon="User" style="padding: 8px 0px"
                            @click="handleAuthUser(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.currentPage"
            v-model:limit="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="saveTitle" v-model="saveOpen" width="500px" append-to-body>
            <el-form ref="saveRef" :model="saveParams" :rules="rules" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="saveParams.roleName" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="角色顺序" prop="roleSort">
                    <el-input-number v-model="saveParams.roleSort" controls-position="right" :min="0" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="saveParams.status">
                        <el-radio v-for="dict in roleStatusEnum.enums" :key="dict.value" :label="dict.value">
                            {{ dict.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单权限">
                    <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
                    <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
                    <el-tree class="tree-border" :data="menuOptions" show-checkbox ref="menuRef" node-key="id"
                        empty-text="加载中，请稍候" :props="{ label: 'label', children: 'children' }"></el-tree>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="saveParams.remark" type="textarea" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="saveSubmit">确 定</el-button>
                    <el-button @click="saveCancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
 
<script setup lang="ts">
import { roleStatusEnum } from '@/utils/enums'
import { changeRoleStatus, delRole, getRole, pageRole, saveRole } from '@/api/role'
import { treeMyMenu, queryIdByRoleId } from '@/api/menu'
import modal from '@/utils/modal'
import router from '@/router'

const { proxy } = getCurrentInstance() as any
const loading = ref(true)
const dateRange = ref(<any>[])
const roleList = ref(<any>[])
const total = ref(0)
const showSearch = ref(true)
const ids = ref(<any>[])
const single = ref(true)
const multiple = ref(true)

const saveTitle = ref('')
const saveOpen = ref(false)

const menuOptions = ref(<any>[])
const menuExpand = ref(false)
const menuNodeAll = ref(false)
const menuRef = ref()

const data = reactive({
    saveParams: {
        id: undefined,
        roleName: undefined,
        roleSort: 0,
        status: 0,
        menuIds: <any>[],
        remark: undefined,
    },
    queryParams: {
        currentPage: 1,
        pageSize: 10,
        roleName: undefined,
        status: undefined
    },
    rules: {
        roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
        roleSort: [{ required: true, message: "角色顺序不能为空", trigger: "blur" }]
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

function getList() {
    loading.value = true
    pageRole(proxy.addDateRange(queryParams.value, dateRange.value, 'Create')).then((res: any) => {
        loading.value = false
        roleList.value = res.data.records
        total.value = res.data.total
    }).catch(() => {
        loading.value = false
    })
}

function handleSelectionChange(selection: any) {
    ids.value = selection.map((item: any) => item.id)
    single.value = selection.length != 1
    multiple.value = !selection.length
}

function resetSave() {
    saveParams.value = {
        id: undefined,
        roleName: undefined,
        roleSort: 0,
        status: 0,
        menuIds: <any>[],
        remark: undefined,
    }
    proxy.resetForm("saveRef")
}

function handleAdd() {
    resetSave()
    saveOpen.value = true
    saveTitle.value = "新增用户"
}

function handleUpdate(row: any) {
    resetSave()
    const id = row.id || ids.value

    treeMyMenu().then((res: any) => {
        menuOptions.value = res.data
    })

    getRole(id).then((r: any) => {
        const res = r.data
        for (const key in saveParams.value) {
            (saveParams.value as any)[key] = res[key]
        }
        saveOpen.value = true
        saveTitle.value = "修改角色"

        nextTick(() => {
            queryIdByRoleId(id).then((res: any) => {
                res.data.forEach((v: any) => {
                    nextTick(() => {
                        menuRef.value.setChecked(v, true, false)
                    })
                })
            })
        })

    })
}

function handleDelete(row: any) {
    const roleIds = row.id || ids.value
    modal.confirm('是否确认删除角色ID为"' + roleIds + '"的数据项？').then(function () {
        return delRole(roleIds)
    }).then(() => {
        getList()
        modal.msgSuccess("删除成功")
    })
}

function handleStatusChange(row: any) {
    let text = row.status == 1 ? "启用" : "停用"
    modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗?').then(async () => {

        row.status = row.status == 0 ? 1 : 0
        await changeRoleStatus(row.id, row.status)
        modal.msgSuccess(text + "成功")
    })
}

function handleAuthUser(row: any) {
    router.push("/system/role/auth/user/" + row.id)
}

function saveSubmit() {
    proxy.$refs["saveRef"].validate((valid: any) => {
        if (valid) {
            // 目前被选中的菜单节点
            let checkedKeys = menuRef.value.getCheckedKeys();
            // 半选中的菜单节点
            let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
            checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
            
            saveParams.value.menuIds = checkedKeys

            saveRole(saveParams.value).then(() => {
                modal.msgSuccess("保存成功")
                saveOpen.value = false
                getList()
            })
        }
    })
}

function saveCancel() {
    saveOpen.value = false
    resetSave()
}

function handleCheckedTreeExpand(value: boolean) {
    let treeList = menuOptions.value
    treeExpand(treeList, value)
}

function treeExpand(treeList: any[], value: boolean) {
    for (let i = 0; i < treeList.length; i++) {
        menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
        let children = treeList[i].children
        if (children) {
            treeExpand(children, value)
        }
    }
}

function handleCheckedTreeNodeAll(value: any) {
    menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
}

getList()

</script>