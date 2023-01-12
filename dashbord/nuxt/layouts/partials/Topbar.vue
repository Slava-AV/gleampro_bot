<template>
  <nav
    class="navbar bg-white topbar mb-4 static-top"
    style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08)"
  >
    <!-- Topbar Navbar -->
    <div class="navbar-start">
      <!-- <div class="navbar-item">
        <ul class="navbar-item">
           <li :class="['nav-item', activeClass('/')]">
        <NuxtLink class="nav-link mr-2" to="/">
          <span>Gleams</span></NuxtLink
        >
        </li>
           <li :class="['nav-item', activeClass('/users')]">
        <NuxtLink class="nav-link" to="/users">
          <span>Users</span></NuxtLink
        >
          </li>
        </ul>
      </div> -->
      <div class="tabs is-medium is-toggle">
        <ul>
          <li :class="['nav-item', activeClass('/')]">
            <NuxtLink class="nav-link" to="/">
              <span>Gleams</span></NuxtLink
            >
          </li>
          <li :class="['nav-item', activeClass('/users')]">
            <NuxtLink class="nav-link" to="/users">
              <span>Users</span></NuxtLink
            >
          </li>
        </ul>


      </div>
           
    </div>
    <!-- <div class="navbar-end">
      <div class="navbar-item">
        <ul class="">
          <li class="">
            <button
              class="tag px-4 is-info is-light"
              style="margin-right: 3rem"
              :loading="isLoading"
              @click="loadGleams()"
            >
              <span class="icon">
                <i class="fas fa-sync-alt"></i>
              </span>
              <span>Load new gleams</span>
            </button>
          </li>
        </ul>
      </div>
    </div> -->
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    loadGleams() {
      this.$axios.post('/findGleams').then(response => {
        this.$toast.open({
          message: response.data,
          type: 'is-success',
          duration: 3000,
        });
      });
    },
    activeClass(path) {
      if (this.$route.path == path) {
        return "is-active";
      }
    }
  },
};
</script>
<style scoped>
.topbar {
    height: 52px;
    margin-top: 12px;
}
/* li.nav-item {
    font-size: 22px;
    color: grey;
}
.nav-item .nav-link.active,
.nav-item .nav-link:hover,
.active .nuxt-link-active
{
  color: rgb(46, 201, 240);
}
.sidebar .nav-item .nav-link span {
  font-size: 15px;
  display: inline;
  color: #303031;
  font-weight: bold;
}
.nav-link {
  color: darkgray;
} */

</style>