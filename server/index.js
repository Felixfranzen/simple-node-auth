const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('app listening to port: ' + process.env.PORT);
})