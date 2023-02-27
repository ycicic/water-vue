<template>
  <div class="has-logo"
    :style="{ backgroundColor: theme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
    <logo :collapse="isCollapse" />
    <el-scrollbar :class="theme" wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse"
        :background-color="theme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
        :text-color="theme === 'theme-dark' ? variables.menuColor : variables.menuLightColor" :unique-opened="true"
        :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="(route, index) in sidebarRouters" :key="route.path + index" :item="route"
          :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/assets/styles/variables.module.scss'
import useAppStore from '@/store/modules/app'
import useThemeStore from '@/store/modules/theme'
import usePermissionStore from '@/store/modules/permission'

const route = useRoute();
const appStore = useAppStore()
const themeStore = useThemeStore()
const permissionStore = usePermissionStore()

const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const theme = computed(() => themeStore.theme);
const isCollapse = computed(() => !appStore.sidebar.opened);

const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
})

</script>
