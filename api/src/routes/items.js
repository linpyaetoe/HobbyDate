import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Test endpoint
router.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Get all items
router.get("/items", async (req, res) => {
  try {
    const items = await prisma.item.findMany({
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
    
    return res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Create item (authenticated)
router.post("/items", requireAuth, async (req, res) => {
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
    
    // Create the item
    const newItem = await prisma.item.create({
      data: {
        title,
        description,
        userId: req.user.userId,
        categoryId: parseInt(categoryId)
      }
    });
    
    return res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    return res.status(500).json({ error: 'Failed to create item' });
  }
});

export default router;