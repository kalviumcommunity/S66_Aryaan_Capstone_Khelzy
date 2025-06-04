const express = require('express');
const app = express();
const cors = require('cors')
const connectDB = require('./Config/db')
const cookieParser = require('cookie-parser');
const {userRouter} = require('./Routes/user.routes')
const {gameRouter} = require('./Routes/game.routes')
const {commentRouter} = require('./Routes/comment.routes')



const PORT = process.env.PORT || 5000;

//MiddleWare
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  preflightContinue: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/user',userRouter)
app.use('/games', gameRouter);
app.use('/comments',commentRouter)


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
