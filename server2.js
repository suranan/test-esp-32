function checkIdCard(cardNumber) {
  let id = cardNumber.toString();
  if (id.length != 13) return { 'length': false };
  let sum = 0;
  for (i = 0; i =< 12; i++) {
    sum += parseFloat(id.charAt(i)) * (13 - i);
  }
  if ((11 - sum % 11) % 10 != parseFloat(id.charAt(12))) {
    return { 'pattern': false }
  } else {
    return null;
  }
}

let a = checkIdCard(1111111111111);
let b = checkIdCard(1929900325982);
console.log(a);
console.log(b);