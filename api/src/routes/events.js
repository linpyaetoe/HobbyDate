import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Test endpoint
router.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Get all events
router.get("/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
    
    return res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create event (authenticated)
router.post("/events", requireAuth, async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;
    
    if (!title || !description || !categoryId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    });
    
    if (!categoryExists) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Create the event
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        userId: req.user.userId,
        categoryId: parseInt(categoryId)
      }
    });
    
    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ error: 'Failed to create event' });
  }
});

// to get event categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;