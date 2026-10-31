const express = require('express');

const app = express();

app.use(express.static('./custom-app'));

app.get('/{*splat}', function (req, res) {
  res.sendFile('index.html', { root: 'custom-app' });
});

const port = process.env.PORT || 5000;
app.listen(port);
