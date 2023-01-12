
<template>
  <form action="">
    <div class="modal-card" style="">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Gleam</p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <b-field label="Title">
          <b-input type="text" v-model="data.title" disabled> </b-input>
        </b-field>
        <b-field label="Url">
          <b-input type="url" v-model="data.url" disabled> </b-input>
        </b-field>
        <b-field label="Referral link">
          <b-input type="url" v-model="data.referral_url" placeholder="" >
          </b-input>
        </b-field>
        <b-field label="Results link">
          <b-input type="url" v-model="data.results_url" placeholder="" >
          </b-input>
        </b-field>
        <b-field label="Sent">
          <b-select v-model="data.sent" placeholder="">
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>  
          </b-select>       
        </b-field>
        <b-field label="Tags">
          <b-input type="text" v-model="data.tags" placeholder="" >
          </b-input>
          <a
              @click="addFireTag()"
              class="tag is-light"
              href="#"
            >
              🔥🔥🔥
            </a>

        </b-field>

       
      </section>
      <footer class="modal-card-foot">
        <b-button label="Close" @click="$emit('close')" />
        <b-button label="Save Gleam" @click="saveGleam()" :loading="loading" 
        type="is-success" />
      </footer>
    </div>
  </form>
</template>

<script>

export default {
    name: 'modalEditGleam',
  props: ["gleam"],
  data() {
    return {
      referral_url: "",
        loading: false,
        data : {}
    };
  },
  created() {
    this.data = this.gleam;
    if (!this.data.referral_url) {
      this.data.referral_url = "";
    }
    if (!this.data.results_url) {
      this.data.results_url = "";
    }
    if (!this.data.tags) {
      this.data.tags = "";
    }
    else
    if (Array.isArray(this.data.tags))
      this.data.tags = this.data.tags.join(',');
  },
  methods: {
    saveGleam() {
      this.loading = true;
      //if tags is array make it string
      if (Array.isArray(this.data.tags)) {
        this.data.tags = this.data.tags.join(",");
      }
          return this.$axios.post("/update_gleam", this.data).then(
            (response) => {
               if (!response || !response.data) {
            this.$buefy.toast.open({
              message: "Wrong answer from API",
              type: "is-danger",
            });
            return;
          }
          this.$buefy.toast.open({
            message: "Gleam updated",
            type: "is-success",
          });
          this.loading = false;
          this.$emit('close');
            }
          );
         
    },
    addFireTag() {
      //add fire tag to tags if not exists otherwise remove it
      if (this.data.tags.indexOf("🔥🔥🔥") == -1) {
        this.data.tags = "🔥🔥🔥," + this.data.tags;
      } else {
        this.data.tags = this.data.tags.replace("🔥🔥🔥,", "");
      }
    }
  },

};
</script>