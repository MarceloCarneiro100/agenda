const mongoose = require('mongoose');
const app = require('./app');
const porta = 3000;

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
      app.emit('pronto');
    })
    .catch(e => console.log(e));
}

app.on('pronto', () => {
  app.listen(porta, () => {
    console.log(`Acessar http://localhost:${porta}/login/index`);
    console.log(`Aplicação rodando na porta ${porta}`);
  });
});