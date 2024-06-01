import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '../src/config/db';
import { config } from '../src/config/config';
import authenticateToken, { AuthenticatedRequest } from './utilities';
import UserModel from '../src/models/user.model';
import NoteModel from '../src/models/note.model';
import { config as conf } from 'dotenv';
conf();

const app = express();

connectDB();

const PORT = config.port || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin:config.clinetUri,
}));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'hello backend' });
});

app.post('/register', async (req: Request, res: Response) => {
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

  const isUser = await UserModel.findOne({ email });
  if (isUser) {
    return res.status(400).json({ error: true, message: 'User already exists' });
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new UserModel({
    fullName,
    email,
    password: hashedPassword
  });

  await user.save();

  const accessToken = jwt.sign({ userId: user._id }, config.jwtSecret as string, {
    expiresIn: '36000m',
  });

  return res.json({
    error: false,
    user: { fullName: user.fullName, email: user.email },
    accessToken,
    message: 'Registration Successful'
  });
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: 'Email is required' });
  }

  if (!password) {
    return res.status(400).json({ error: true, message: 'Password is required' });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: true, message: 'User not found' });
  }

  // Compare the password with the hashed password
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const accessToken = jwt.sign({ userId: user._id }, config.jwtSecret as string, {
      expiresIn: '30m',
    });

    return res.json({
      error: false,
      message: 'Login Successful',
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: 'Invalid Credentials',
    });
  }
});


app.get('/getuser', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized'
    });
  }

  try {
    const isUser = await UserModel.findOne({ _id: req.user?.userId });

    if (!isUser) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    return res.json({
      user:{
        fullName:isUser.fullName,
        email:isUser.email,
        _id:isUser._id,
        createdAt:isUser.createdAt,
      },
      message: 'User retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error'
    });
  }
});


app.post('/addnote', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
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
    const note = new NoteModel({
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
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error'
    });
  }
});

app.put('/editnote/:noteId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;

  if (!title && !content && !tags && isPinned === undefined) {
    return res.status(400).json({
      error: true,
      message: 'No changes provided'
    });
  }

  try {
    const note = await NoteModel.findOne({ _id: noteId, userId: req.user?.userId });
    if (!note) {
      return res.status(404).json({
        error: true,
        message: 'Note not found'
      });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: 'Note updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error'
    });
  }
});

app.get("/getallnotes", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
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
      const notes = await NoteModel.find({ userId }).sort({ isPinned: -1 });
  
      return res.json({
        error: false,
        notes,
        message: "All notes retrieved successfully"
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error"
      });
    }
  });

  app.delete("/deletenote/:noteId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const noteId = req.params.noteId;
    const userId = req.user?.userId;
  
    try {
      const note = await NoteModel.findOne({ _id: noteId, userId });
  
      if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }
  
      await NoteModel.deleteOne({ _id: noteId, userId });
  
      return res.json({
        error: false,
        message: "Note deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error"
      });
    }
  });

  app.put('/notepinned/:noteId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
  
    if (typeof isPinned === 'undefined') {
      return res.status(400).json({
        error: true,
        message: 'No changes provided'
      });
    }
  
    try {
      const note = await NoteModel.findOne({ _id: noteId, userId: req.user?.userId });
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
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'Internal Server Error'
      });
    }
  });

  app.get('/searchnotes', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const query = req.query.query as string; // Explicitly cast query to string
        
        if (!query) {
            return res.status(400).json({
                error: true,
                message: "Search query is required"
            });
        }
        
        // Find notes matching the search query for the authenticated user
        const matchingNotes = await NoteModel.find({
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
    } catch (error) {
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

export default app;
