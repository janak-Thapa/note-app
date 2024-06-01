"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../src/config/db"));
const config_1 = require("../src/config/config");
const utilities_1 = __importDefault(require("../utilities"));
const user_model_1 = __importDefault(require("../src/models/user.model"));
const note_model_1 = __importDefault(require("../src/models/note.model"));
const app = (0, express_1.default)();
(0, db_1.default)();
const PORT = config_1.config.port || 3000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: config_1.config.clinetUri,
}));
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'hello backend' });
});
app.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName) {
        return res.status(400).json({ error: true, message: 'Full name is required' });
    }
    if (!email) {
        return res.status(400).json({ error: true, message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: 'Password is required' });
    }
    const isUser = await user_model_1.default.findOne({ email });
    if (isUser) {
        return res.status(400).json({ error: true, message: 'User already exists' });
    }
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
    const user = new user_model_1.default({
        fullName,
        email,
        password: hashedPassword
    });
    await user.save();
    const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.config.jwtSecret, {
        expiresIn: '36000m',
    });
    return res.json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: 'Registration Successful'
    });
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ error: true, message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: 'Password is required' });
    }
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: true, message: 'User not found' });
    }
    // Compare the password with the hashed password
    const match = await bcrypt_1.default.compare(password, user.password);
    if (match) {
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.config.jwtSecret, {
            expiresIn: '30m',
        });
        return res.json({
            error: false,
            message: 'Login Successful',
            email,
            accessToken,
        });
    }
    else {
        return res.status(400).json({
            error: true,
            message: 'Invalid Credentials',
        });
    }
});
app.get('/getuser', utilities_1.default, async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized'
        });
    }
    try {
        const isUser = await user_model_1.default.findOne({ _id: req.user?.userId });
        if (!isUser) {
            return res.status(404).json({
                error: true,
                message: 'User not found'
            });
        }
        return res.json({
            user: {
                fullName: isUser.fullName,
                email: isUser.email,
                _id: isUser._id,
                createdAt: isUser.createdAt,
            },
            message: 'User retrieved successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error'
        });
    }
});
app.post('/addnote', utilities_1.default, async (req, res) => {
    const { title, content, tags } = req.body;
    if (!title) {
        return res.status(400).json({ error: true, message: 'Title is required' });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: 'Content is required' });
    }
    if (!tags) {
        return res.status(400).json({ error: true, message: 'Tags are required' });
    }
    try {
        const note = new note_model_1.default({
            title,
            content,
            tags: tags || [],
            userId: req.user?.userId,
        });
        await note.save();
        return res.json({
            error: false,
            note,
            message: 'Note added successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error'
        });
    }
});
app.put('/editnote/:noteId', utilities_1.default, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    if (!title && !content && !tags && isPinned === undefined) {
        return res.status(400).json({
            error: true,
            message: 'No changes provided'
        });
    }
    try {
        const note = await note_model_1.default.findOne({ _id: noteId, userId: req.user?.userId });
        if (!note) {
            return res.status(404).json({
                error: true,
                message: 'Note not found'
            });
        }
        if (title)
            note.title = title;
        if (content)
            note.content = content;
        if (tags)
            note.tags = tags;
        if (isPinned !== undefined)
            note.isPinned = isPinned;
        await note.save();
        return res.json({
            error: false,
            note,
            message: 'Note updated successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error'
        });
    }
});
app.get("/getallnotes", utilities_1.default, async (req, res) => {
    try {
        // Extract userId from authenticated request
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({
                error: true,
                message: "User ID not found in request"
            });
        }
        // Fetch notes for the user and sort them by isPinned (pinned notes first)
        const notes = await note_model_1.default.find({ userId }).sort({ isPinned: -1 });
        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});
app.delete("/deletenote/:noteId", utilities_1.default, async (req, res) => {
    const noteId = req.params.noteId;
    const userId = req.user?.userId;
    try {
        const note = await note_model_1.default.findOne({ _id: noteId, userId });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }
        await note_model_1.default.deleteOne({ _id: noteId, userId });
        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});
app.put('/notepinned/:noteId', utilities_1.default, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    if (typeof isPinned === 'undefined') {
        return res.status(400).json({
            error: true,
            message: 'No changes provided'
        });
    }
    try {
        const note = await note_model_1.default.findOne({ _id: noteId, userId: req.user?.userId });
        if (!note) {
            return res.status(404).json({
                error: true,
                message: 'Note not found'
            });
        }
        note.isPinned = isPinned;
        await note.save();
        return res.json({
            error: false,
            note,
            message: 'Note updated successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error'
        });
    }
});
app.get('/searchnotes', utilities_1.default, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const query = req.query.query; // Explicitly cast query to string
        if (!query) {
            return res.status(400).json({
                error: true,
                message: "Search query is required"
            });
        }
        // Find notes matching the search query for the authenticated user
        const matchingNotes = await note_model_1.default.find({
            userId,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } }
            ]
        });
        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
});
exports.default = app;
