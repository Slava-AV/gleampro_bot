<template>
  <form action="">
    <div class="modal-card" style="">
      <header class="modal-card-head">
        <p class="modal-card-title">Message subscribers of {{gleam.title.substring(0,20)}}</p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <h3 v-if="loading">Checking subscribers...</h3>
        <h3 v-else>Found {{users.length}} subscribers</h3>
        <span v-for="user in users" :key="user._id">
          <code>{{user.chat_id}}</code>
        </span>
        <b-field label="Message">
          <b-input type="textarea" v-model="message" placeholder="" >
          </b-input>
        </b-field>   
        <b-field label="bot_select">
          <b-select v-model="bot_select" placeholder="Select bot">
            <option value="results">Results</option>
            <option value="main">Main</option>
          </b-select>
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
  props: ["gleam"],
  data() {
    return {
      referral_url: "",
        loading: true,
        data : {},
        message: "",
        users: [],
        bot_select: "results"
    };
  },
  async created() {
    this.message = `💰💰💰🤞🤞🤞
[Конкурс](${this.gleam.url}), в котором вы участвовали завершен - проверьте результаты. Желаем удачи! 
Прямая ссылка: 
`;
    //get list of subscribers
    let response = await this.$axios.post("query_result_subs", {
      gleam_url: this.gleam.url
    });
    this.loading = false;
    console.log(response);
    this.users = response.data;
   
  },
  methods: {
    sendMessageToSelectedUsers() {
      this.loading = true;
     return this.$axios.post('/send_message_to_selected_users', {
        msg: this.message,
        users: this.users,
        bot_select: this.bot_select
        // users: [{
        //   chat_id: "454589886",
        // }]
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