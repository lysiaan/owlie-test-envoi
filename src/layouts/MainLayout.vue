<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="header">
      <!-- Topbar -->
      <q-toolbar class="toolbar q-pt-md">
        <q-btn
          class="self-start"
          flat
          dense
          round
          icon="fas fa-bars"
          aria-label="Menu"
          @click="side_menu_open = !side_menu_open"
        />
        <q-toolbar-title class="self-end q-pb-md q-pl-xl">
          Owlie Todolist
        </q-toolbar-title>
        <div class="self-start">
          <q-icon class="q-mr-lg clickable" size="xs" name="fas fa-bell" />
          <q-icon class="q-mr-lg clickable" size="xs" name="fas fa-project-diagram" />
          <q-icon class="q-mr-xs clickable" size="xs" name="fas fa-search" />
        </div>
      </q-toolbar>
    </q-header>
    <!-- SideMenu -->
    <q-drawer
      v-model="side_menu_open"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <SideBar />
    </q-drawer>
    <!-- Pages content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import SideBar from 'components/SideBar.vue'

export default {
  name: 'MainLayout',
  components: { SideBar },
  data () {
    return {
      side_menu_open: false // Is sidemenu currently open ?
    }
  },
  methods: {
    // Save the new status of side menu (open / close) in Store
    saveSideMenuPositionInStore () {
      this.$store.commit('setSideMenuOpen', this.side_menu_open)
    }
  },
  computed: {
    // Get the status of side menu (open / close) from Store
    store_is_side_menu_open: function () {
      return this.$store.getters.getIsSideMenuOpen
    }
  },
  watch: {
    // Given that <q-drawer> need local data variable for open / close mechanism,
    // let's assign this local variable from value saved in Store
    store_is_side_menu_open () {
      this.side_menu_open = this.store_is_side_menu_open
    },
    // Changes status of side menu (open / close) in Store everytime local data variable changes
    side_menu_open () {
      this.saveSideMenuPositionInStore()
    }
  }
}
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}
.toolbar {
  height: 130px;
}
.header {
  z-index: 90;
}
</style>
