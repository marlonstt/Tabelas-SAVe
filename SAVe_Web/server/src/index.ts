import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import caseRoutes from './routes/cases';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);

app.get('/', (req, res) => {
    res.send('SAVe API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
