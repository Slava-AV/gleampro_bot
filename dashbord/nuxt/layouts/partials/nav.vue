<template>
  <aside
    class="is-fullheight section"
    style="padding-right: 0; padding-left: 0"
  >
    <ul
      class="navbar-nav sidebar accordion"
      style="padding-left: 10px"
      id="accordionSidebar"
    >
      <!-- Sidebar - Brand -->
      <NuxtLink
        class="sidebar-brand d-flex align-items-center justify-content-center"
        to="/"
      >
        <div class="sidebar-brand-text pl-4">
          <img
            width="160"
            src="~/assets/images/left_trans.png"
            style="margin-top: -16px"
          />
        </div>
      </NuxtLink>

      <hr class="sidebar-divider d-none d-md-block" />

      <!-- Nav Item - Dashboard -->
      <li :class="['nav-item', activeClass('/notifications')]">
        <NuxtLink class="nav-link" to="/notifications">
          <i class="fas fa-fw fa-bolt"></i>
          <span>Announcement</span></NuxtLink
        >
      </li>
      <li :class="['nav-item', activeClass('/categories')]">
        <NuxtLink class="nav-link" to="/categories">
          <i class="fas fa-fw fa-list"></i>
          <span>Categories</span></NuxtLink
        >
      </li>
      <li :class="['nav-item', activeClass('/comments')]">
        <NuxtLink class="nav-link" to="/comments">
          <i class="fas fa-fw fa-comments"></i>
          <span>Comments</span></NuxtLink
        >
      </li>
      <li :class="['nav-item', activeClass('/flags')]">
        <NuxtLink class="nav-link" to="/flags">
          <i class="fas fa-fw fa-flag"></i>
          <span>Flags</span></NuxtLink
        >
      </li>
      <li :class="['nav-item', activeClass('/')]">
        <NuxtLink class="nav-link" to="/">
          <i class="fas fa-fw fa-chart-bar"></i>
          <span>Overview</span></NuxtLink
        >
      </li>
      <li :class="['nav-item', activeClass('/products')]">
        <NuxtLink class="nav-link" to="/products">
          <i class="fas fa-fw fa-cube"></i>
          <span>Products</span></NuxtLink
        >
      </li>
      <li :class="['nav-item', activeClass('/reviews')]">
        <NuxtLink class="nav-link" to="/reviews">
          <i class="fas fa-fw fa-star"></i>
          <span>Reviews</span></NuxtLink
        >
      </li>
      <li :class="['nav-item', activeClass('/summary')]">
        <NuxtLink class="nav-link" to="/summary">
          <i class="fas fa-fw fa-sitemap"></i>
          <span>Summary</span></NuxtLink
        >
      </li>
      <li :class="['nav-item', activeClass('/Transfers')]">
        <NuxtLink class="nav-link" to="/transactions">
          <i class="fas fa-fw fa-sitemap"></i>
          <span>Transfers</span></NuxtLink
        >
      </li>

      <li :class="['nav-item', activeClass('/users')]">
        <NuxtLink class="nav-link" to="/users">
          <i class="fas fa-fw fa-users"></i>
          <span>Users</span></NuxtLink
        >
      </li>
      <li :class="['nav-item', activeClass('/settings')]">
        <NuxtLink class="nav-link" to="/settings">
          <i class="fas fa-fw fa-cog"></i>
          <span>Update/Notice</span></NuxtLink
        >
      </li>

      <li :class="['nav-item', activeClass('/waitinglist')]">
        <NuxtLink class="nav-link" to="/waitinglist">
          <i class="fas fa-fw fa-user-clock"></i>
          <span>User Request</span></NuxtLink
        >
      </li>

      <li :class="['nav-item', activeClass('/summary/users/')]">
        <NuxtLink class="nav-link" to="/summary/users/">
          <i class="fas fa-fw fa-sitemap"></i>
          <span>User Activity</span></NuxtLink
        >
      </li>

      <!-- Divider -->
      <hr class="sidebar-divider d-none d-md-block" />
      <a @click="logout" class="dropdown-item" href="#">
        <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
        Logout
      </a>
      <!-- Sidebar Toggler (Sidebar) -->
      <!-- <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle"></button>
      </div> -->
    </ul>
  </aside>
</template>
<script>
export default {
  methods: {
    activeClass(path) {
      if (this.$route.path == path) {
        return "active";
      }
    },
    async logout() {
      await this.$auth.logout();
      this.$auth.$storage.removeUniversal("user");
      window.location.replace("/");
    },
  },
};
</script>
<style lang="scss" scoped>
.sidebar .sidebar-brand {
  font-size: 3rem;
  font-weight: normal;
  color: #eee;
}
li.nav-item.active,
li.nav-item:hover,
.sidebar #sidebarToggle {
  background: #dfdfdf;
}
.sidebar .nav-item .nav-link span {
  font-size: 15px;
  display: inline;
  color: #303031;
  font-weight: bold;
}
.sidebar .nav-item .nav-link {
  color: #303031 !important;
}
li.nav-item.active {
  background: #dfdfdf;
}

aside .fas.fa-fw {
  color: #fece16;
  margin-right: 6px;
}
</style>