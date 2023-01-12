import Vue from 'vue';
Vue.config.errorHandler = (err, vm, info) => {
    console.log('Logged in Vue global error handler', err, vm, info);
};
window.onunhandledrejection = (event) => {
    console.log('Logged in window.onunhandledrejection', event);
};