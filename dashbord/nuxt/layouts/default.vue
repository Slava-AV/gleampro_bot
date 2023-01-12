<template>
  <div id="wrapper is-centered">
    <div class="columns">
      <!-- Sidebar -->
      <!-- <div class="column p-0" style="max-width: 30px"> -->
        <!-- <Nav /> -->
      <!-- </div> -->
      <!-- End of Sidebar -->

      <!-- Content Wrapper -->
      <div class="column p-0">
        <div id="content-wrapper" class="d-flex flex-column">
          <!-- Main Content -->
          <div id="content">
            <!-- Topbar -->
            <Topbar />

            <!-- End of Topbar -->

            <!-- Begin Page Content -->
            <div
              class="is-fullheight"
              style="
                max-width: calc(100vw - 85px);
                padding: 3rem 1.5rem 1.5rem 0;
                margin-right: auto;
                margin-left: auto;
                }"
            >
              <Nuxt keep-alive />
              <!-- <RouterView /> -->
            </div>
            <!-- /.container-fluid -->
          </div>
          <!-- End of Main Content -->

          <!-- Footer -->
          <Footer />
          <!-- End of Footer -->
        </div>
      </div>
      <!-- End of Content Wrapper -->
    </div>
  </div>
</template>

<script>
// import Nav from "./partials/nav";
import Topbar from "./partials/Topbar";
import Footer from "./partials/Footer";
export default {
  head: {
    script: [
    ],
  },
  middleware: ["auth-guard"],
  components: {
    Topbar,
    Footer,
  },
};
</script>

<style>
/* #wrapper #content-wrapper {
  background-color: #262627;
} */
/* .container, .container-fluid {        min-width: 900px; } */
</style>
