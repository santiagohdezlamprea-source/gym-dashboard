// Datos de ejemplo. En un gym real esto vendria de una base de datos / API
// (la idea es conectarlo despues con el backend en Python)

const PLANS = {
  mensual:    { name: "Mensual",    price: 90000,  days: 30 },
  trimestral: { name: "Trimestral", price: 240000, days: 90 },
  estudiante: { name: "Estudiante", price: 70000,  days: 30 },
};

// daysLeft = dias que le quedan al socio (negativo = ya se vencio)
const SAMPLE_MEMBERS = [
  { name: "Andrés Felipe Gómez", plan: "mensual",    daysLeft: 12 },
  { name: "Valentina Ríos",       plan: "estudiante", daysLeft: 3 },
  { name: "Juan Camilo Torres",   plan: "trimestral", daysLeft: 58 },
  { name: "Laura Daniela Castro", plan: "mensual",    daysLeft: -4 },
  { name: "Sebastián Moreno",     plan: "mensual",    daysLeft: 21 },
  { name: "Paula Andrea Vargas",  plan: "trimestral", daysLeft: 6 },
  { name: "Diego Alejandro Ruiz", plan: "estudiante", daysLeft: 15 },
  { name: "Natalia Herrera",      plan: "mensual",    daysLeft: -12 },
  { name: "Cristian Peña",        plan: "mensual",    daysLeft: 1 },
  { name: "María José Salazar",   plan: "estudiante", daysLeft: 27 },
  { name: "Jhon Fredy Ortiz",     plan: "trimestral", daysLeft: 33 },
  { name: "Daniela Rojas",        plan: "mensual",    daysLeft: 9 },
  { name: "Kevin Santiago Díaz",  plan: "estudiante", daysLeft: -1 },
  { name: "Carolina Mejía",       plan: "mensual",    daysLeft: 18 },
  { name: "Óscar Iván León",      plan: "mensual",    daysLeft: 5 },
  { name: "Luisa Fernanda Parra", plan: "trimestral", daysLeft: 74 },
  { name: "Brayan Stiven Cruz",   plan: "estudiante", daysLeft: 11 },
  { name: "Angie Lorena Muñoz",   plan: "mensual",    daysLeft: -20 },
  { name: "Julián David Pardo",   plan: "mensual",    daysLeft: 24 },
  { name: "Sara Lucía Quintero",  plan: "estudiante", daysLeft: 2 },
];

// promedio de entradas por hora (5am a 10pm). Sacado "a ojo" de como se ve un gym de barrio
const HOURLY = [
  ["5", 18], ["6", 34], ["7", 29], ["8", 14], ["9", 9], ["10", 7],
  ["11", 6], ["12", 11], ["13", 10], ["14", 6], ["15", 8], ["16", 13],
  ["17", 27], ["18", 41], ["19", 38], ["20", 22], ["21", 9],
];
