// SERVER INFO
const IPADDRESS = '192.168.225.226';
const HTTPS = 'http';
const PORT = '9876';
const FEEDBACK_SERVER_ENDPOINT = 'https://mieupro.pythonanywhere.com/feedback';

// OS types
const ANDROID = 'android';
const IOS = 'ios';
// FEEDBACK INTERVAL TIME in ms
//const INITIAL_FEEDBACK_INTERVAL = 10800000;
//const ROUTINE_FEEDBACK_INTERVAL = 86400000;
//const INTERVAL_BETWEEN_SENDING_FEEDBACK_DATA = 300000;

// POLLING INTERVAL FOR REST CALL in ms
const HTTP_POLLING_INTERVAL = 4000;
const SPLASHSCREEN_VISIBLE_TIME = 2000;

// Dispense timeout in sec
const timeoutForDispense = 30;

// FEEDBACK INTERVAL TIME in ms
const INITIAL_FEEDBACK_INTERVAL = 60000;
const ROUTINE_FEEDBACK_INTERVAL = 60000;
const INTERVAL_BETWEEN_SENDING_FEEDBACK_DATA = 5000;

// ORDER POSITIVE STATUS CODE
const BEFORE_PLACING_ORDER = 0;
const PLEASE_WAIT = 1;
const ORDER_PLACED_AND_RECEIVED_BY_THE_MACHINE = 2;
const PLACE_THE_CUP = 3;
const DISPENSING = 4;
const ORDER_DISPENSED = 5;

// ORDER ERROR STATUS CODE
const SOMETHING_WENT_WRONG = 6;
const TIMEOUT_EXPIRED = 7;
const MACHINE_NOT_READY = 8;
const FOAMER_OFF = 9;
const RINSING = 10;
const MILK_NOT_READY = 11;

const orderStatus = {
  0: 'Order your Beverage',
  1: 'Please wait !',
  2: 'Order received\n  Please wait !',
  3: 'Please place the cup and\n         Press Dispense',
  4: 'Dispensing !',
  5: 'Beverage dispensed\nEnjoy your Beverage !',
  6: '     Something went wrong\nPlease check the connection',
  7: 'Timeout Expired',
  8: '     Machine is not ready\nPlease try after sometime',
  9: 'Please turn on the Foamer',
  10: 'Rinsing',
  11: '         Milk is not ready\nPlease try after sometime',
};

const productList = [
  {
    productName: 'Cappuccino',
    src: require('../assets/Cappuccino_or_Macchiato.jpg'),
  },
  {
    productName: 'Espresso',
    src: require('../assets/Espresso_or_Black_Coffee.jpg'),
  },
  {
    productName: 'Hot Milk',
    src: require('../assets/Hot_Milk.jpg'),
  },
  {
    productName: 'South Indian Coffee Light',
    src: require('../assets/South_Indian_Coffee_Light.jpg'),
  },
  {
    productName: 'South Indian Coffee Strong',
    src: require('../assets/South_Indian_Coffee_Strong.jpg'),
  },
  {
    productName: 'Tea Milk',
    src: require('../assets/Tea_Milk.jpg'),
  },
  {
    productName: 'Tea Water',
    src: require('../assets/Tea_Water.jpg'),
  },
  {
    productName: 'Lemon Tea',
    src: require('../assets/Lemon_Tea.jpg'),
  },
  {
    productName: 'Ristretto',
    src: require('../assets/Ristretto.jpg'),
  },
  {
    productName: 'Macchiato',
    src: require('../assets/Cappuccino_or_Macchiato.jpg'),
  },
  {
    productName: 'Hot Water',
    src: require('../assets/Hot_Water.jpg'),
  },
  {
    productName: 'Hot Chocolate',
    src: require('../assets/Hot_Chocolate.jpg'),
  },
  {
    productName: 'Horlicks',
    src: require('../assets/Horlicks.jpg'),
  },
  {
    productName: 'Green Tea',
    src: require('../assets/Green_Tea.jpg'),
  },
  {
    productName: 'Caffe Latte',
    src: require('../assets/Caffe_Latte.jpg'),
  },
  {
    productName: 'Black Tea',
    src: require('../assets/Black_Tea_or_Boiled_Tea.jpg'),
  },
  {
    productName: 'Boiled Tea',
    src: require('../assets/Black_Tea_or_Boiled_Tea.jpg'),
  },
  {
    productName: 'Black Coffee',
    src: require('../assets/Espresso_or_Black_Coffee.jpg'),
  },
  {
    productName: 'Badam Milk',
    src: require('../assets/Badam_Milk.jpg'),
  },
  {
    productName: 'Corn Flakes',
    src: require('../assets/Corn_Flakes.jpg'),
  },
  {
    productName: 'Cup Noodles',
    src: require('../assets/Cup_Noodles.jpg'),
  },
  {
    productName: 'Filter Coffee',
    src: require('../assets/Filter_Coffee.jpg'),
  },
  {
    productName: 'Mug Smoodle',
    src: require('../assets/Mug_Smoodle.jpg'),
  },
  {
    productName: 'Steam',
    src: require('../assets/Steam.jpg'),
  },
  {
    productName: 'Sugarless Cereals',
    src: require('../assets/Sugarless_Cereals.jpg'),
  },
  {
    productName: 'Soup',
    src: require('../assets/Soup.jpg'),
  },
  {
    productName: 'Tomato Soup',
    src: require('../assets/Tomato_Soup.jpg'),
  },
  {
    productName: 'Vegetable Soup',
    src: require('../assets/Vegetable_Soup.jpg'),
  },
];

export {
  IPADDRESS,
  HTTPS,
  PORT,
  FEEDBACK_SERVER_ENDPOINT,
  BEFORE_PLACING_ORDER,
  PLEASE_WAIT,
  ORDER_PLACED_AND_RECEIVED_BY_THE_MACHINE,
  DISPENSING,
  PLACE_THE_CUP,
  ORDER_DISPENSED,
  SOMETHING_WENT_WRONG,
  TIMEOUT_EXPIRED,
  MACHINE_NOT_READY,
  FOAMER_OFF,
  RINSING,
  MILK_NOT_READY,
  INITIAL_FEEDBACK_INTERVAL,
  ROUTINE_FEEDBACK_INTERVAL,
  INTERVAL_BETWEEN_SENDING_FEEDBACK_DATA,
  HTTP_POLLING_INTERVAL,
  SPLASHSCREEN_VISIBLE_TIME,
  orderStatus,
  productList,
  timeoutForDispense,
  ANDROID,
  IOS,
};
