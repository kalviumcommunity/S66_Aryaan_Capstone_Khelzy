const express = require('express');
const app = express();
const router = require('./Routes/user.route')

const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use('/api',router)



app.get('/', (req, res) => {
  res.send('Welcome to Khelzy API');
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
