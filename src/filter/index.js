export default {
  filters: {
    date(v) {
      var time = new Date(v);
      var timeStr =
        time.getFullYear() +
        "-" +
        (time.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        time
          .getDate()
          .toString()
          .padStart(2, "0") +
        " " +
        time
          .getHours()
          .toString()
          .padStart(2, "0") +
        ":" +
        time
          .getMinutes()
          .toString()
          .padStart(2, "0") +
        ":" +
        time
          .getSeconds()
          .toString()
          .padStart(2, "0");
      return timeStr;
    },
    img(v) {
      return "/ele/" + v;
    },
    currency(v, n = 2) {
      return "￥" + v.toFixed(n);
    }
  },
  install(Vue) {
    for (let key in this.filters) {
      Vue.filter(key, this.filters[key]);
    }
  }
};
