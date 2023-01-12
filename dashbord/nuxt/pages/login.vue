<template>
  <div style="height: 100vh; background: #212121">
    <div class="container h-100 has-text-centered" style="padding-top: 10%">
      <div class="justify-content-center h-100">
        <div class="user_card" style="margin-left: auto; margin-right: auto">
          <div class="justify-content-center" style="margin-bottom: 5rem">
            <div class="brand_logo_container">
              <img
                src="https://gleamprobot.s3.amazonaws.com/images/gpb_dark.png"
                class="brand_logo"
                alt="Logo"
              />
            </div>
          </div>
          <div class="text-center text-light mt-4">
            <h2 class="title is-3 has-text-white">ADMIN</h2>
            <div class="is-danger" v-if="errors.length">
              <div v-for="error in errors" v-bind:key="error.id">
                {{ error }}
              </div>
            </div>
          </div>
          <div class="my-4 mx-4">
            <div class="field">
              <p class="control has-icons-left">
                <input
                  type="email"
                  v-model="login.email"
                  value=""
                  class="input"
                  placeholder="Email"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <input
                  type="password"
                  v-model="login.password"
                  class="input"
                  value=""
                  placeholder="password"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
              </p>
            </div>
          </div>

          <div class="mt-4 text-center">
            <!-- <div v-if="loading"><button type="submit" class="button btn-secondary">Loading...</button></div> -->
            <div>
              <button
                @click="adminLogin(login)"
                :loading="loading"
                type="submit"
                class="button login_btn"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: "login",
  // middleware: ['auth-guard'],
  auth: true,
  data() {
    return {
      errors: [],
      login: {
        email: "",
        password: "",
        appId: "admin",
      },
      loading: false,
    };
  },
  beforeCreate() {
    return {
      loading: true,
    };
  },
  created() {
    return {
      loading: false,
    };
  },

  methods: {
    async adminLogin(login) {
      try {
        this.errors = [];
        if (!login.email) {
          this.errors.push("Email required");
        }
        if (!login.password) {
          this.errors.push("Password should not be empty");
        }

        if (!this.errors.length) {
          this.loading = true;
          let response = await this.$auth.loginWith("local", {
            data: login,
          });
          this.loading = false;
          this.$nuxt.$loading.start();

          //  if(response.status != 200) {
          // 	this.errors.push('Invalid credntials');
          // 	 console.log("error");
          // 	 return false;
          //  }
          this.$auth.$storage.setLocalStorage("user", login.email);
          this.$router.push("/");
        }
      } catch (e) {
        // if(e.restatus == 400) {
        // 	this.errors.push("Wrong email or passwprd.")
        // }
        console.log("error", e);

        this.errors.push(e);
        //e.preventDefault()
      }
    },
  },
};
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  /* height: 100vh; */
  /* background: #212121 !important; */
}

.user_card {
  height: 400px;
  width: 350px;
  margin-top: auto;
  margin-bottom: auto;
  background: #171615;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -moz-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
}

.brand_logo_container {
  position: absolute;
  height: 170px;
  width: 170px;
  top: -75px;
  border-radius: 50%;
  padding: 10px;
  text-align: center;
  left: 90px;
}

.brand_logo {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  border: 2px solid white;
}

.form_container {
  margin-top: 28px;
}

.login_btn {
  width: 50%;
  background: #fece16 !important;
  color: #171615 !important;
  text-transform: uppercase;
  font-weight: bold;
  border: none;
}

.login_btn:focus {
  box-shadow: none !important;
  outline: 0px !important;
}

.login_container {
  padding: 0 2rem;
}

.input-group-text {
  background: #fece16 !important;
  color: #171615 !important;
  border: 0 !important;
  border-radius: 0.25rem 0 0 0.25rem !important;
}

.input_user,
.input_pass:focus {
  box-shadow: none !important;
  outline: 0px !important;
}

.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
  background-color: #c0392b !important;
}

button {
  border: none;
}
.icon.is-small.is-left {
  color: #212121;
  background-color: #fece16;
  border-radius: 4px;
}

.control.has-icons-left .input,
.control.has-icons-left .select select {
  padding-left: 3rem;
}
</style>
