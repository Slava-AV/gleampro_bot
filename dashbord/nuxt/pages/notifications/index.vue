<template>
  <div>
    <div
      v-if="notification"
      class="alert alert-warning alert-dismissible fade show"
      role="alert"
    >
      {{ notification }}
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="row">
      <div class="card border-left-primary shadow h-100 py-2 m-4 w-100">
        <div class="card-content">
          <div class="row no-gutters">
            <div class="col mr-2">
              <div class="w-500">
                <h3 class="title is-5">
                  Make an announcement to the GleamPro Network:
                </h3>

                <div class="field">
                  <input
                    v-model="title"
                    type="text"
                    class="input"
                    placeholder="Title"
                  /><br />
                </div>
                <div class="field">
                  <textarea
                    v-model="message"
                    placeholder="Type the message"
                    class="textarea"
                    name=""
                    id=""
                    cols="10"
                    rows="5"
                  ></textarea
                  ><br />
                </div>
                <button @click="sendNotification()" class="button is-success">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="card border-left-primary shadow h-100 py-2 m-4 w-100">
        <div class="card-content">
          <div class="row no-gutters">
            <div class="col mr-2">
              <div class="">
                <h3 class="title is-5">Announcement Log</h3>
                <hr />
                <div class="">
                  <div v-for="(log, i) in logs" :key="log.id" class="columns">
                    <div class="column is-narrow">
                      {{ i + 1 }}
                    </div>
                    <div class="column is-narrow">
                      {{ $dateFns.format(log.createdAt) }}
                    </div>
                    <div class="column is-3">
                      {{ log.title }}
                    </div>
                    <div class="column">
                      {{ log.message }}
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "",
      title: "",
      notification: "",
    };
  },
  async asyncData({ $axios, $auth, $dateFns }) {
    let response = await $axios.get("/admin/notification/log");
    console.log(response.data);
    return {
      logs: response.data.data,
    };
  },

  methods: {
    async sendNotification() {
      try {
        this.$axios.setToken(this.$auth.getToken("local"), "Bearer");
        await this.$axios.post("/admin/notification", {
          title: this.title,
          message: this.message,
        });

        this.notification = "Notification sent successfully!";
      } catch (error) {
        console.log(error);
        this.notification = "Error accured!";
      }
    },
  },
};
</script>

<style scoped>
.w-500 {
  width: 500px;
}
</style>
