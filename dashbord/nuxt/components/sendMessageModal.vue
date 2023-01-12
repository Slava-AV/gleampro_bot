<template>
  <form action="">
    <div class="modal-card" style="">
      <header class="modal-card-head">
        <p class="modal-card-title">Send Message</p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <h3>Sending to {{users.length}} users</h3>
        <b-field label="Message">
          <b-input type="textarea" v-model="message" placeholder="" >
          </b-input>
        </b-field>       
      </section>
      <footer class="modal-card-foot">
        <b-button label="Close" @click="$emit('close')" />
        <b-button label="Send" @click="sendMessageToSelectedUsers()" :loading="loading" 
        type="is-success" />
      </footer>
    </div>
  </form>
</template>

<script>

export default {
    name: 'modalEditUser',
  props: ["users"],
  data() {
    return {
      referral_url: "",
        loading: false,
        data : {},
        message: ""
    };
  },
  created() {
   
  },
  methods: {
    sendMessageToSelectedUsers() {
      this.loading = true;
     return this.$axios.post('/send_message_to_selected_users', {
        msg: this.message,
        users: this.users
      }).then(response => {
        this.loading = false;
        this.$buefy.toast.open({
            message: "Message sent",
            type: "is-success",
          });
        this.$emit('close');
      }).catch(error => {
        this.loading = false;
        this.$buefy.toast.open({
            message: "Error sending message",
            type: "is-danger",
          });
      });
         
    },
  },
};
</script>