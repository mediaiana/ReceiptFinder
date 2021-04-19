const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { connect } = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const mainRouter = require('./routes/mai.router');
const userRouter = require('./routes/user.router');
const profileRouter = require('./routes/profile.router');

const app = express();
const port = process.env.PORT ?? 3000;

app.set('view engine', 'hbs');

app.use(express.static(path.join(process.env.PWD, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

const sessionConfig = {
  store: new FileStore(),
  key: 'sid',
  secret: 'trololo',
  resave: true,
  saveUninitialized: false,
  cookie: { expires: 60000000000000 },
};

app.use(session(sessionConfig));

//locals
app.use((req, res, next) => {
  res.locals.user = req.session?.user;

  next();
});

app.use('/', mainRouter);
app.use('/', userRouter);
app.use('/', profileRouter);



app.listen(port, () => {
  console.log(`Сервер успешно запущен на порту ${port}.`);

  const connectionAddress = process.env.DATABASE_CONNECTION_ADDRESS ?? 'mongodb://localhost:27017/asolo';

  connect(connectionAddress, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }, () => {
    console.log('Подлючение к базе данных успешно.');
  });
});
