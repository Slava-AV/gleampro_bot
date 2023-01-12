
<template>
  <form action="">
    <div class="modal-card" style="">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit User</p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <b-field label="Name">
          <b-input type="text" v-model="data.first_name" disabled> </b-input>
        </b-field>
        <b-field label="Username">
          <b-input type="url" v-model="data.username" disabled> </b-input>
        </b-field>
        <b-field label="Language">
          <b-input type="url" v-model="data.language_code" placeholder="" >
          </b-input>
        </b-field>
        <b-field label="Tags">
          <b-input type="text" v-model="data.tags" placeholder="" >
          </b-input>
        </b-field>       
      </section>
      <footer class="modal-card-foot">
        <b-button label="Close" @click="$emit('close')" />
        <b-button label="Save User" @click="saveUser()" :loading="loading" 
        type="is-success" />
        <b-button label="Delete User" @click="deleteUser()" disabled :loading="loading" 
        type="is-danger" />
      </footer>
    </div>
  </form>
</template>

<script>

export default {
    name: 'modalEditUser',
  props: ["user"],
  data() {
    return {
      referral_url: "",
        loading: false,
        data : {}
    };
  },
  created() {
    this.data = this.user;
    if (!this.data.referral_url) {
      this.data.referral_url = "";
    }
    if (!this.data.results_url) {
      this.data.results_url = "";
    }
    if (!this.data.tags) {
      this.data.tags = "";
    }
  },
  methods: {
    saveUser() {
      this.loading = true;
      //if tags is array make it string
      if (Array.isArray(this.data.tags)) {
        this.data.tags = this.data.tags.join(",");
      }
          return this.$axios.post("/update_user", this.data).then(
            (response) => {
               if (!response || !response.data) {
            this.$buefy.toast.open({
              message: "Wrong answer from API",
              type: "is-danger",
            });
            return;
          }
          this.$buefy.toast.open({
            message: "User updated",
            type: "is-success",
          });
          this.loading = false;
          this.$emit('close')
            }
          );
         
    },
    deleteUser() {
      this.loading = true;
          return this.$axios.post("/delete_user", this.data).then(
            (response) => {
               if (!response || !response.data) {
            this.$buefy.toast.open({
              message: "Wrong answer from API",
              type: "is-danger",
            });
            return;
          }
          this.$buefy.toast.open({
            message: "User deleted",
            type: "is-success",
          });
          this.loading = false;
            }
          );
         
    },
  },

};
</script>