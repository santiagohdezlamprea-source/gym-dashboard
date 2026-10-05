# Panel de socios · Gimnasio Hierro 72

Panel administrativo para un gimnasio de barrio (ficticio). Lo pensé para la persona
que atiende la recepción y lleva los pagos en un cuaderno o en Excel.

🔗 **Demo:** https://santiagohdezlamprea-source.github.io/gym-dashboard/

## El problema

En muchos gimnasios pequeños nadie sabe bien quién ya se venció hasta que la persona llega
a entrenar. La idea del panel es ver eso de un vistazo y poder cobrar a tiempo.

## Qué hace

- Resumen: socios activos, lo recaudado en el mes, cuántos se vencen esta semana
- Gráfica de horas pico (para saber cuándo poner más entrenadores)
- Tabla de socios con búsqueda y filtro por estado (al día / por vencer / vencido)
- Botón **Registrar pago** que renueva el plan: si estaba vencido arranca desde hoy,
  si no, se suman los días a lo que le quedaba
- Los cambios se guardan en el navegador (`localStorage`), así que no se pierden al recargar

## Tecnologías

HTML, CSS y JavaScript puro. La gráfica está hecha a mano con divs, sin librerías.

## Pendientes

- [ ] Conectarlo a una API en Python (FastAPI) con base de datos real
- [ ] Módulo de clases y horarios
- [ ] Botón para escribirle por WhatsApp a los que están por vencer
