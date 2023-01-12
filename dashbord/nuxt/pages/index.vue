<template>
  <div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <div class="button-group mr-2" role="group" aria-label="First group">
            <h3 class="title is-4">Gleams: {{filtered_gleams.length}} ({{totalSubscriptions()}})</h3>
            <span class="is-size-6 has-text-grey-light">{{lastRefreshed?$moment(lastRefreshed).fromNow():"Refreshing..."}}</span>
          </div>
        </div>
      </div>
      <div class="level-right">
        
        <div class="level-item">
        <b-field>
                {{ sort_direction }}
            <b-switch v-model="sort_direction"
                false-value="Newest first"
             true-value="Expiring first"
                >
            </b-switch>
        </b-field>
      </div>
        <div class="level-item">
          <b-field>
                {{ query_mode }}
            <b-switch v-model="query_mode"
                false-value="Whitelist, Airdrop"
             true-value="All"
                >
            </b-switch>
        </b-field>
        </div>
          <div class="level-item">
          <!-- toggle finished\not finished -->
          <div class="field has-addons">
            <div class="control">
              <div class="select">
                <select v-model="filter">
                  <option value="all">All</option>
                  <option value="expired">Expired</option>
                  <option value="active">Active</option>
                </select>
              </div>
              </div>
            </div>
        </div>
      </div>
    </nav>

    <div class="card shadow mb-4 mt-4">
      <div class="card-content">
        <b-table
          :loading="loading"
          :data="filtered_gleams"
          backend-pagination
          :total="totalItems"
          :paginated="isPaginated"
          :per-page="perPage"
          :current-page.sync="currentPage"
          :pagination-simple="isPaginationSimple"
          :pagination-position="paginationPosition"
          :default-sort-direction="defaultSortDirection"
          :pagination-rounded="isPaginationRounded"
          :sort-icon="sortIcon"
          :sort-icon-size="sortIconSize"
          default-sort="time_added"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
          mobile-cards
          ref="gleamTable"
        >
        <b-table-column
            field="title"
            label="Title"
            searchable
            sortable
            v-slot="props"
          >
            {{ props.row.title }}
          </b-table-column> 

          <b-table-column
            field="url"
            label="Link"
            searchable
            v-slot="props"
          >
            <a :href="props.row.url" target="_blank">
              {{ props.row.url }}
            </a>
             <button
              @click="itemEdit(props.row)"
              class="tag is-danger is-light"
            >
              Edit
            </button>
          </b-table-column> 

          <b-table-column
            field="referral_url"
            label="Referral"
            sortable
            searchable
            v-slot="props"
          >
            <a :href="props.row.referral_url" target="_blank">
              {{ props.row.referral_url }}
            </a>
          </b-table-column> 

          <b-table-column
            field="results_url"
            label="Results"
            sortable
            searchable
            v-slot="props"
          >
            <a v-if="props.row.results_url" :href="props.row.results_url" target="_blank">
              {{ props.row.results_url.length > 20 ? props.row.results_url.substring(0, 20) + "..." : props.row.results_url }}
            </a>
          </b-table-column> 

          <b-table-column
            field="time_added"
            label="Date added"
            width="150"
            sortable
            v-slot="props"
          >
            <span :title="$moment.unix(props.row.time_added).format('MMMM Do YYYY, h:mm:ss a') ">
              <p class="">
                {{ $moment.unix(props.row.time_added).fromNow()}} 
              </p>
            </span>
          </b-table-column>
          <b-table-column
            field="time_end"
            label="Ends in"
            width="110"
            sortable
            v-slot="props"
          >
          <span v-if="$moment.unix(props.row.time_end) < $moment()">
            <p style="color:red">
              {{ $moment.unix(props.row.time_end).fromNow()}} 
            </p>
          </span>
          <span v-else>
            <p style="color:green">
              {{ $moment.unix(props.row.time_end).fromNow()}} 
            </p>
          </span>
          </b-table-column>
          <b-table-column
            field="twitter_followers"
            label="Twitter"
            width="50"
            sortable
            v-slot="props"
          >
            {{ props.row.twitter_followers }}
          </b-table-column>
          <b-table-column
            field="participants"
            label="participants"
            width="50"
            sortable
            v-slot="props"
          >
            {{ isNaN(parseInt(props.row.participants)) ? "" : parseInt(props.row.participants) }}
          </b-table-column>
          <b-table-column
            field="sent"
            label="Sent"
            width="50"
            sortable
            searchable
            v-slot="props"
          >
          <!-- values are true or false, display as tags -->
          <span v-if="props.row.sent == 'true'">
            <span class="tag is-success">
              <span class="icon">
                <i class="fas fa-check"></i>
              </span>
              <span class="">Sent</span>
            </span>
          </span>
          <span v-else>
            <span class="tag is-warning">
              <span class="icon">
                <i class="fas fa-clock"></i>
              </span>
              <span class="">Not yet</span>
            </span>
          </span>
          </b-table-column>

          <b-table-column
            field="tags"
            label="Tags"
            searchable
            sortable
            v-slot="props"
          >
          <!-- if tags is array - join it -->
          <span v-if="props.row.tags&&Array.isArray(props.row.tags)">
            <span v-for="tag in props.row.tags" :key="tag">
              <span v-if="tag !=''" class="tag is-lite">
                {{ tag }}
              </span>
            </span>
          </span>

                <!-- {{ props.row.tags&&Array.isArray(props.row.tags)? props.row.tags.join(' | ') : props.row.tags }} -->
                <!-- {{ props.row.tags }} -->
          </b-table-column> 

          <b-table-column
            field="subscribers"
            label="Subscribers"
            width="110"
            sortable
            v-slot="props"
          > <span v-if="props.row.subscribers>0" class="is-size-3">
            <p @click="sendToSubscribers(props.row)"
            style="cursor:pointer"
            >
                {{ props.row.subscribers }}
            </p>
          </span>
          </b-table-column>

          <b-table-column field="action" label="Action" v-slot="props">
            <section>
            <b-field>
            <b-radio-button v-model="props.row.good"
            @input="updateGood(props.row)"
                native-value="-"
                type="is-light is-outlined is-info"
                size="is-small">
                <span>???</span>
            </b-radio-button>

            <b-radio-button v-model="props.row.good"
            @input="updateGood(props.row)"
                native-value="false"
                type="is-warning is-light is-outlined"
                size="is-small">
                <span>bad</span>
            </b-radio-button>

            <b-radio-button v-model="props.row.good"
            @input="updateGood(props.row)"
                native-value="true"
                type="is-success is-light is-outlined"
                size="is-small">
                <span>good</span>
            </b-radio-button>

            </b-field>
            </section>
            <!-- <button
              @click="itemEdit(props.row)"
              class="tag is-light"
              :class="{ 'is-success': props.row.good == 'true', 'is-warning': props.row.good == 'false' }"
            >
              {{!props.row.good?"not checked":props.row.good=='true'?'good':'bad'}}
            </button> -->
           
          </b-table-column>
        </b-table>
        <!-- </div> -->
        <!-- <div v-else>
          <p>No gleams found!</p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
const json_fields = {
  "Review ID": "_id",
  Review: "review",
  Rating: "rating",
  "Product title": "product.title",
  "Product desctiption": "product.description",
  "Product ID": "product._id",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};
import ModalEditGleam from '../components/modalEditGleam.vue';
import sendToSubscribersModal from '../components/sendToSubscribersModal.vue';


export default {
    components: {
    ModalEditGleam,
  },
  data() {
    return {
      json_fields: json_fields,
      loading: false,
      pageNumber: 1,
      totalItems: "",
      sensor: this.$store.state.sensor,
      limit: 1000,
      notification: "",
      isPaginated: false,
      isPaginationSimple: false,
      isPaginationRounded: false,
      paginationPosition: "top",
      defaultSortDirection: "asc",
      sortIcon: "arrow-down",
      sortIconSize: "is-small",
      currentPage: 1,
      perPage: 1000,
      gleams: [],
      filtered_gleams: [],
      polling: null,
      lastRefreshed: null,
      filter: "active",
      query_mode: "Whitelist, Airdrop",
      sort_direction: "Newest first",
    };
  },
  watch : {
    filter: function(val) {
      // filter glimes based on time_end
      this.filter_gleams(val);
    },
    query_mode: function(val) {
     this.getGleams();
    },
    sort_direction: function(val) {
      // this.$refs.gleamTable.sortBy('time_end',{//val == "Newest first"?'time_added':'time_end', {
      //   descending: true//val == "Newest first" ? true : false
      // });
     this.getGleams();
    },
  },

  async created() {
    this.getGleams();
    this.polling = setInterval(() => {
    this.getGleams();
    }, 30000);
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },

  methods: {
    getGleams() {
      // this.loading = true;
      this.lastRefreshed = null;
      this.$axios.post("/query_gleams", {filter: this.query_mode, sort_direction: this.sort_direction}
      ).then(response => {
      if (!response || !response.data || !response.data) {
        this.$buefy.toast.open({
          message: "Wrong answer from API",
          type: "is-danger",
        });
        return;
      }
      this.gleams = response.data;
      console.log("Got items:", this.gleams.length);
      this.gleams.map((el, i) => {
        el.id = i
        if (el.metadata) {
          // console.log(el);
          el.metadata = JSON.parse(el.metadata);
          el.total_tasks = el.metadata.entry_methods.length;
          el.twitter_followers = el.metadata.twitter_followers;
          el.participants = el.metadata.participants_count;
        }
        if (!el.good) el.good = "-";
        }); //insert row ids
      this.filter_gleams(this.filter);
      this.id = response.data.total;
      this.totalItems = +response.data.total;
      this.lastRefreshed = new Date();
      }).catch(error => {
        this.$buefy.toast.open({
          message: "Error getting gleams",
          type: "is-danger",
        });
        console.log("Error getting gleams", error);
      });
    },
    itemEdit(gleam) {
     //show modal window allowing to change row values and with save\cancel buttons
      this.$buefy.modal.open({
        parent: this,
        component: ModalEditGleam,
        hasModalCard: true,
        props: {
          gleam: gleam,
        },
      });

    },
    updateGood(item) {
      this.$axios.post("/update_gleam", item).then(res =>
       console.log("Updated item:", res.data)
      ).catch(error => {
        this.$buefy.toast.open({
          message: "Error updating gleam",
          type: "is-danger",
        });
        console.log("Error updating gleam", error);
      });
    },
    totalSubscriptions() {
      let total = 0;
      this.gleams.map(el => {
        if (el.subscribers) total += +el.subscribers;
      });
      return total;
    },
    filter_gleams(val) {
      if (val == "active") {
        this.filtered_gleams = this.gleams.filter(gleam => {
          return gleam.time_end > this.$moment().unix();
        });
      } else if (val == "expired") {
        this.filtered_gleams = this.gleams.filter(gleam => {
          return gleam.time_end < this.$moment().unix();
        });
      } else if (val == "all") {
        this.filtered_gleams = this.gleams.filter(gleam => {
          return true;
        });
      }
    },
    sendToSubscribers(gleam) {
      this.$buefy.modal.open({
        parent: this,
        component: sendToSubscribersModal,
        hasModalCard: true,
        props: {
          gleam: gleam,
        },
      });
    }
  },
};

</script>
<style scoped>
.c-date {
  width: 10%;
}
tr.text-deleted {
  background: #fde7e7;
}
tr.text-disabled {
  color: #bfc0c3 !important;
  background: #efefef;
  /* color: #e2e2e2; */
}
</style>