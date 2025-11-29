const userName: string = "Юлія";
const age: number = 28;
const isActive: boolean = true;

function printUserInfo(name: string, age: number, active: boolean): void {
  const status = active ? "активна" : "неактивна";
  console.log(`Користувач: ${name}, вік: ${age}, статус: ${status}`);
}

printUserInfo(userName, age, isActive);
