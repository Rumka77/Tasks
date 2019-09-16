class  DataService {

  static dateFormatted(data) {
    return  data < 10 ? ("0"+data) : data;
  }

  static idToTimeSec(str) {
    return parseInt(str.substr(8, 2))*60*60 +
           parseInt(str.substr(10, 2))*60 +
           parseInt(str.substr(12, 2));
  }

  static idToDateStr(str) {
    return str.slice(0, 8);
  }

  static dateNowToStr() {
    return this.dateFormatted( String( (new Date()).getDate() ) ) +
           this.dateFormatted( String( (new Date()).getMonth() +1) ) +
           this.dateFormatted( String( (new Date()).getFullYear() ) );
  }

  static timeNowToStr() {
    return this.dateFormatted( String( (new Date()).getHours() ) ) +
           this.dateFormatted( String( (new Date()).getMinutes() ) ) +
           this.dateFormatted( String( (new Date()).getSeconds() ) ) +
           this.dateFormatted( String( (new Date()).getMilliseconds() ) );
  }

  static timeNowSec() {
    return ( (new Date()).getHours() )*60*60 +
           ( (new Date()).getMinutes() )*60 +
             (new Date()).getSeconds();
  }

}

export default DataService;
