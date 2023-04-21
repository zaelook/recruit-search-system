import moment from "moment"; // 현재시간 받아오는데 필요한 모듈
import MomentTimezone from "moment-timezone"; // 현재시간 받아오는데 필요한 모듈
moment.tz.setDefault("Asia/Seoul");
const now = moment().format("YYYY-MM-DD/HH:mm:ss");
console.log(now);

function radius() {
  $(".mapcontent").parent().parent().css("border-radius", "20px");
}
