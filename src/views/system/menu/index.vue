<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
            <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
                    <el-option v-for="dict in menuStatusEnum.enums" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
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
                <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-if="refreshTable" v-loading="loading" :data="menuList" row-key="id" :default-expand-all="isExpandAll"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
            <el-table-column prop="icon" label="图标" align="center" width="100">
                <template #default="scope">
                    <component v-if="scope.row.icon !== '#'" :is="scope.row.icon"
                        style="width: 1em; height: 1em; margin-right: 8px" class="svg-icon"></component>
                    <div v-else></div>
                </template>
            </el-table-column>
            <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
            <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="status" label="状态" width="80">
                <template #default="scope">
                    <el-tag :type="menuStatusEnum.getItem(scope.row.status).type">{{
                        menuStatusEnum.getLabel(scope.row.status)
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime">
                <template #default="scope">
                    <span>{{ proxy.parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-tooltip content="修改" placement="top">
                        <el-button text type="primary" style="padding: 8px 0px" icon="Edit"
                            @click="handleUpdate(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="新增" placement="top">
                        <el-button text type="primary" style="padding: 8px 0px" icon="Plus"
                            @click="handleAdd(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button text type="primary" style="padding: 8px 0px" icon="Delete"
                            @click="handleDelete(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改菜单对话框 -->
        <el-dialog :title="title" v-model="open" width="680px" append-to-body>
            <el-form ref="saveRef" :model="saveParams" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上级菜单">
                            <el-tree-select v-model="saveParams.parentId" :data="menuOptions"
                                :props="{ value: 'id', label: 'menuName', children: 'children' }" value-key="id"
                                placeholder="选择上级菜单" check-strictly />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="菜单类型" prop="menuType">
                            <el-radio-group v-model="saveParams.menuType">
                                <el-radio label="M">目录</el-radio>
                                <el-radio label="C">菜单</el-radio>
                                <el-radio label="F">按钮</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="saveParams.menuType != 'F'">
                        <el-form-item label="菜单图标" prop="icon" style="font-weight: 700;">
                            <el-icon-picker v-model="saveParams.icon"></el-icon-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="菜单名称" prop="menuName">
                            <el-input v-model="saveParams.menuName" placeholder="请输入菜单名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示排序" prop="orderNum">
                            <el-input-number v-model="saveParams.orderNum" controls-position="right" :min="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="saveParams.menuType != 'F'">
                        <el-form-item>
                            <template #label>
                                <span>
                                    <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                                        <el-icon>
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>是否外链
                                </span>
                            </template>
                            <el-radio-group v-model="saveParams.isFrame">
                                <el-radio v-for="dict in menuFrameEnum.enums" :key="dict.value" :label="dict.value">{{
                                    dict.label
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="saveParams.menuType != 'F'">
                        <el-form-item prop="path">
                            <template #label>
                                <span>
                                    <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                                        <el-icon>
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                    路由地址
                                </span>
                            </template>
                            <el-input v-model="saveParams.path" placeholder="请输入路由地址" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="saveParams.menuType == 'C'">
                        <el-form-item prop="component">
                            <template #label>
                                <span>
                                    <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                                        <el-icon>
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                    组件路径
                                </span>
                            </template>
                            <el-input v-model="saveParams.component" placeholder="请输入组件路径" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="saveParams.menuType != 'M'">
                        <el-form-item>
                            <el-input v-model="saveParams.perms" placeholder="请输入权限标识" maxlength="100" />
                            <template #label>
                                <span>
                                    <el-tooltip content="定义权限字符" placement="top">
                                        <el-icon>
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                    权限字符
                                </span>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="saveParams.menuType == 'C'">
                        <el-form-item>
                            <el-input v-model="saveParams.query" placeholder="请输入路由参数" maxlength="255" />
                            <template #label>
                                <span>
                                    <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                                        <el-icon>
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                    路由参数
                                </span>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="saveParams.menuType == 'C'">
                        <el-form-item>
                            <template #label>
                                <span>
                                    <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                                        <el-icon>
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                    是否缓存
                                </span>
                            </template>
                            <el-radio-group v-model="saveParams.isCache">
                                <el-radio v-for="dict in menuCacheEnum.enums" :key="dict.value" :label="dict.value">{{
                                    dict.label
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="saveParams.menuType != 'F'">
                        <el-form-item>
                            <template #label>
                                <span>
                                    <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                                        <el-icon>
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                    显示状态
                                </span>
                            </template>
                            <el-radio-group v-model="saveParams.visible">
                                <el-radio v-for="dict in menuVisibleEnum.enums" :key="dict.value" :label="dict.value">{{
                                    dict.label
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="saveParams.menuType != 'F'">
                        <el-form-item>
                            <template #label>
                                <span>
                                    <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                                        <el-icon>
                                            <QuestionFilled />
                                        </el-icon>
                                    </el-tooltip>
                                    菜单状态
                                </span>
                            </template>
                            <el-radio-group v-model="saveParams.status">
                                <el-radio v-for="dict in menuStatusEnum.enums" :key="dict.value" :label="dict.value">{{
                                    dict.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input v-model="saveParams.remark" type="textarea" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
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

import { delMenu, getMenu, queryMenu, saveMenu } from '@/api/menu';
import { menuStatusEnum, menuVisibleEnum, menuCacheEnum, menuFrameEnum } from '@/utils/enums'
import modal from '@/utils/modal'
import { handleTree } from '@/utils/water';

const { proxy } = getCurrentInstance() as any
const loading = ref(true)
const showSearch = ref(true)
const menuList = ref(<any>[])
const refreshTable = ref(true)
const isExpandAll = ref(false)

const title = ref("")
const open = ref(false)
const menuOptions = ref(<any>[])

const data = reactive({
    saveParams: {
        id: undefined,
        parentId: '0',
        menuType: "M",
        icon: undefined,
        menuName: undefined,
        orderNum: 0,
        isFrame: 1,
        path: undefined,
        component: undefined,
        perms: undefined,
        query: undefined,
        isCache: 0,
        visible: 0,
        status: 0,
        remark: undefined
    },
    queryParams: {
        menuName: undefined,
        status: undefined
    },
    rules: {
        menuName: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
        orderNum: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
        path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
    }
})

const { queryParams, saveParams, rules } = toRefs(data)

function getList() {
    loading.value = true
    queryMenu(queryParams.value).then((res: any) => {
        menuList.value = handleTree(res.data)
        loading.value = false
    }).catch(() => {
        loading.value = false
    })
}

function handleQuery() {
    getList()
}

function resetQuery() {
    proxy.resetForm("queryRef")
    handleQuery()
}

function toggleExpandAll() {
    refreshTable.value = false
    isExpandAll.value = !isExpandAll.value
    nextTick(() => {
        refreshTable.value = true
    })
}

async function getMenuSelect() {
    menuOptions.value = []
    await queryMenu().then((res: any) => {
        const menu = { id: '0', menuName: "主类目", children: [] }
        menu.children = res.data
        menuOptions.value.push(menu)
        console.log(menuOptions);
        
    })
}

function reset() {
    saveParams.value = {
        id: undefined,
        parentId: '0',
        menuType: "M",
        icon: undefined,
        menuName: undefined,
        orderNum: 0,
        isFrame: 1,
        path: undefined,
        component: undefined,
        perms: undefined,
        query: undefined,
        isCache: 0,
        visible: 0,
        status: 0,
        remark: undefined
    };
    proxy.resetForm("saveRef");
}

async function handleAdd(row: any) {
    reset();
    await getMenuSelect()

    if (row != null && row.id) {
        saveParams.value.parentId = row.id
    } else {
        saveParams.value.parentId = '0'
    }
    open.value = true
    title.value = "添加菜单"
}

async function handleUpdate(row: any) {
    reset()
    await getMenuSelect()
    getMenu(row.id).then((res: any) => {
        for (const key in saveParams.value) {
            (saveParams.value as any)[key] = res.data[key]
        }
        open.value = true
        title.value = "修改菜单"
    })
}

function saveSubmit() {
    proxy.$refs["saveRef"].validate((valid: any) => {
        if (valid) {
            saveMenu(saveParams.value).then(res => {
                modal.msgSuccess("保存成功")
                open.value = false
                getList()
            })
        }
    })
}

function saveCancel() {
    reset()
    open.value = false
}

function handleDelete(row: any) {
    modal.confirm('是否确认删除名称为"' + row.menuName + '"的数据项?').then(function () {
        return delMenu(row.id)
    }).then(() => {
        getList();
        modal.msgSuccess("删除成功")
    }).catch(() => { })
}

getList()

</script>