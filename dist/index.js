const userName = "Юлія";
const age = 28;
const isActive = true;

function printUserInfo(name, age, active) {
  const status = active ? "активна" : "неактивна";
  console.log(`Користувач: ${name}, вік: ${age}, статус: ${status}`);
}

printUserInfo(userName, age, isActive);
