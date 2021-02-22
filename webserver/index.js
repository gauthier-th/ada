const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/hotword-model', express.static(path.join(__dirname, '../hotword-model')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', (req, res) => {
	res.render('index');
});

app.use('/spotify', require('./spotify'));


app.listen(process.env.WEB_SERVER_PORT, () => {
	console.log('Web server listening on port ' + process.env.WEB_SERVER_PORT);
});