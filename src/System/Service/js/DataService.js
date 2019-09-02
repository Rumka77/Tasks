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
    return parseInt(str.slice(0, 7));
  }

  static dateNowToStr() {
    return this.dateFormatted( String( (new Date()).getDate() ) ) +
           this.dateFormatted( String( (new Date()).getMonth() +1) ) +
           this.dateFormatted( String( (new Date()).getFullYear() ) );
  }

  static timeNowToStr() {
    return this.dateFormatted( String( (new Date()).getHours() ) ) +
           this.dateFormatted( String( (new Date()).getMinutes() ) ) +
           this.dateFormatted( String( (new Date()).getSeconds() ) );
  }

  static timeNowSec() {
    return ( (new Date()).getHours() )*60*60 +
           ( (new Date()).getMinutes() )*60 +
             (new Date()).getSeconds();
  }

}

export default DataService;
