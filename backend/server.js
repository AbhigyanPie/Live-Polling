import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from "@supabase/supabase-js";
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.set('io', io);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);


app.post('/api/student', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    try {
        const { data, error } = await supabase
            .from('students')
            .insert([{ name }])
            .select();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ student: data[0] });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/response', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
    }
    const { poll_id, student_id, answer } = req.body;
    if (!poll_id || !student_id || !answer) {
        return res.status(400).json({ error: 'All fields required' });
    }
    const { data:existing, error:checkError } = await supabase
        .from('responses')
        .select('*')
        .eq('poll_id', poll_id)
        .eq('student_id', student_id)
        .maybeSingle();

    if(existing){
        return res.status(409).json({error: 'You have already answered this poll.'});
    }

    const { data, error } = await supabase
        .from('responses')
        .insert([{ poll_id, student_id, answer}])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ response: data[0] });
});

app.get('/api/active-polls', async (req, res) => {
    const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ polls: data });
});

app.get('/api/poll-results', async (req, res) => {
    const { poll_id } = req.query;
    const { data, error } = await supabase
        .from('responses')
        .select('answer')
        .eq('poll_id', poll_id);

    if (error) return res.status(500).json({ error: error.message });

    const counts = {};
    data.forEach(r => {
        counts[r.answer] = (counts[r.answer] || 0) + 1;
    });
    const total = data.length;
    const results = Object.entries(counts).map(([answer, count]) => ({ answer, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 }));
    res.status(200).json({ results });
});

app.post('/api/polls', async (req, res) => {
    const { question, options, duration, is_active, correct_options, teacher_id } = req.body;
    if (!question || !options || !duration) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const { data, error } = await supabase
            .from('polls')
            .insert([{
                question,
                options,
                correct_options: correct_options || [],
                duration,
                is_active,
                teacher_id
            }])
            .select();

        if (error) return res.status(500).json({ error: error.message });

        const io = req.app.get('io');
        if(io){
            io.emit('new_poll', data[0]);
        }
        res.status(200).json({ poll: data[0] });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/polls', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('polls')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ polls: data });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/teacher', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and mail are required' });
    }
    try {
        const { data, error } = await supabase
            .from('teachers')
            .insert([{ name, email }])
            .select();
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ teacher: data[0] });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Backend server running on ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('A student connected:', socket.id);
});