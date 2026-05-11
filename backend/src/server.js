import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express'; 
import authRoute from './routes/auth.route.js';
import messageRoute from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';
import { app,server } from './lib/socket.js';
import groupRoutes from './routes/group.route.js';
import aiRoute from './routes/ai.route.js';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';


const PORT = process.env.PORT || 3000;


app.set("trust proxy", 1);
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json({limit : '10mb'}));
app.use(cors({origin: [process.env.CLIENT_URL], credentials: true}));
app.use(cookieParser());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoute)
app.use('/api/messages', messageRoute)
app.use("/api/groups", groupRoutes);
app.use("/api/ai", aiRoute);

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)

    connectDB()
})