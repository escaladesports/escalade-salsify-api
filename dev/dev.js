let item = {
  'Item Number': 'B3100W',
  'Item Name': 'GS I',
  'AS400 Item Name': 'GLR GS I',
  Brand: 'Goalrilla',
  UPC: '754806105475',
  'Product Type': 'Basketball Goal - In Ground',
  'Product Series': 'Goalrilla GS Series',
  'Product Line': '40 - Basketball',
  Category: '412 - BASKETBLL SYSTEMS-IMP',
  'Product Origin Code': '2 - Purchased',
  'Product Website':
    'http://www.goalrilla.com/basketball-hoops/72in-backboard/gsi',
  'Product Name': 'Goalrilla GS I',
  'Basketball Goals - Backboard Size (in)': '72x42',
  'Basketball Goals - Pole Size (in)': '6x6',
  'Basketball Goals - Backboard Material': 'Tempered Glass',
  'Basketball Goals - Backboard Thickness (in)': '3/8',
  'Basketball Goals - Overhang (ft)': '4',
  'Basketball Goals - Mounting System': 'Anchor Kit - J-Bolt',
  'Basketball Goals - Rim': 'Pro-Style Flex Rim - Heavy Weight',
  'Basketball Goals - Backboard Pad': 'No Backboard Pad',
  'Basketball Goals - Pole Design': 'Straight Pole Design',
  'Basketball Goals - Pole Coating': 'Powder Coating',
  'Basketball Goals - Board Arms': 'H-Frame',
  'Basketball Goals - Height Adjustability (ft)': '7.5 - 10',
  'Main Image':
    'http://images.salsify.com/image/upload/s--RNf7u3P3--/vaza70adnwrqn6c3scke.jpg',
  'Web Images':
    'http://images.salsify.com/image/upload/s--RNf7u3P3--/vaza70adnwrqn6c3scke.jpg',
  'Web Images_1':
    'http://images.salsify.com/image/upload/s--7fWVVpqr--/qrsmegx2l2hmhkpi69u7.jpg',
  'Web Images_2':
    'http://images.salsify.com/image/upload/s--naWYVau2--/iyqclxwn1eka0zfevbgi.jpg',
  'Web Images_3':
    'http://images.salsify.com/image/upload/s--LxmTidug--/vcgwafcrosglvo98vlbe.jpg',
  'Web Images_4':
    'http://images.salsify.com/image/upload/s--xkTQ0clD--/rupfy9hawblrzjdpae09.jpg',
  'Brand Video':
    'http://images.salsify.com/video/upload/s--m4MoRLER--/sggc1woxvetnnwqlroj9.mp4',
  'Brand Images':
    'http://images.salsify.com/image/upload/s--RiWhQcH7--/tejwrllcrpvpdqz5yd53.jpg'
};

const keys = Object.keys(item);
const webImageKeys = keys.filter(key => key.match(/Web Images/g));
let webImages = [];
webImageKeys.forEach(key => {
  webImages.push(item[key]);
  delete item[key];
});
item.webImages = webImages;

console.log(item);
