const express = require('express');
const app = express();
const connectDB = require('./Config/db')
const router = require('./Routes/user.route')


const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use('/user',router)



app.get('/', (req, res) => {
  res.send('Welcome to Khelzy API');
});



app.listen(PORT, async() => {
  try{  
    await connectDB()
    console.log(`Server is running on port ${PORT}`);
  }catch(error){
    console.error(error.message)
  }
  
});
