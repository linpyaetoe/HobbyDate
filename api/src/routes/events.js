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
    const { title, description, categoryId, location, startTime, endTime } = req.body;
    
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
    
    // Process dates
    let startTimeDate = startTime ? new Date(startTime) : null;
    let endTimeDate = endTime ? new Date(endTime) : null;
    
    // Create the event
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        location,
        startTime: startTimeDate,
        endTime: endTimeDate,
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

// Add simple RSVP endpoint
router.post('/:id/rsvp', requireAuth, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.userId;
    
    console.log(`RSVP request received: User ${userId} for Event ${eventId}`);

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      console.log(`Event ${eventId} not found`);
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is the event creator
    if (event.userId === userId) {
      console.log(`User ${userId} is the creator of event ${eventId}, cannot RSVP`);
      return res.status(400).json({ error: 'You cannot RSVP to your own event' });
    }

    // Check if the user already has an RSVP for this event
    const existingRsvp = await prisma.eventRsvp.findFirst({
      where: {
        userId: userId,
        eventId: eventId
      }
    });
    
    if (existingRsvp) {
      console.log(`User ${userId} already RSVP'd to event ${eventId}`);
      return res.json({ 
        message: 'RSVP already exists', 
        id: existingRsvp.id,
        userId,
        eventId 
      });
    } else {
      // Create a new RSVP
      console.log(`Creating new RSVP for user ${userId} to event ${eventId}`);
      
      const newRsvp = await prisma.eventRsvp.create({
        data: {
          userId: userId,
          eventId: eventId
        }
      });
      
      console.log('New RSVP created:', newRsvp);
      return res.json({
        message: 'RSVP created',
        id: newRsvp.id,
        userId,
        eventId
      });
    }
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({ error: 'Failed to process RSVP: ' + error.message });
  }
});

// Check if user has RSVP'd to event
router.get('/:id/rsvp', requireAuth, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.userId;

    console.log(`Checking RSVP status for User ${userId} on Event ${eventId}`);

    // Find if the user is already RSVP'd to this event
    const existingRsvp = await prisma.eventRsvp.findFirst({
      where: {
        userId: userId,
        eventId: eventId
      }
    });
    
    const isRsvpd = !!existingRsvp;
    console.log(`RSVP status for User ${userId} on Event ${eventId}: ${isRsvpd ? 'RSVP exists' : 'No RSVP'}`);
    return res.json({ isRsvpd });
  } catch (error) {
    console.error('Check RSVP error:', error);
    res.status(500).json({ error: 'Failed to check RSVP status: ' + error.message });
  }
});

// Delete RSVP
router.delete('/:id/rsvp', requireAuth, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;
    
    console.log(`User ${userId} attempting to delete RSVP for event ${eventId}`);

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      console.log(`Event ${eventId} not found when deleting RSVP`);
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if RSVP exists
    const existingRsvp = await prisma.eventRsvp.findFirst({
      where: {
        eventId: eventId,
        userId: userId
      }
    });

    if (!existingRsvp) {
      console.log(`No RSVP found for user ${userId} on event ${eventId}`);
      return res.status(404).json({ message: 'RSVP not found' });
    }

    // Delete the RSVP
    await prisma.eventRsvp.delete({
      where: {
        id: existingRsvp.id
      }
    });

    console.log(`RSVP successfully deleted for user ${userId} on event ${eventId}`);
    return res.status(200).json({ message: 'RSVP deleted successfully' });
  } catch (error) {
    console.error('Delete RSVP error:', error);
    res.status(500).json({ error: 'Failed to delete RSVP: ' + error.message });
  }
});

// Get all RSVPs for an event
router.get('/:id/rsvps', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    console.log(`Fetching RSVPs for event ${eventId}`);

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      console.log(`Event ${eventId} not found when fetching RSVPs`);
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get RSVPs with user details
    const rsvps = await prisma.eventRsvp.findMany({
      where: {
        eventId: eventId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    
    // Format the response
    const formattedRsvps = rsvps.map(rsvp => ({
      id: rsvp.id,
      userId: rsvp.userId,
      username: rsvp.user.username
    }));
    
    console.log(`Found ${formattedRsvps.length} RSVPs for event ${eventId}`);
    return res.json(formattedRsvps);
  } catch (error) {
    console.error('Get RSVPs error:', error);
    res.status(500).json({ error: 'Failed to get RSVPs: ' + error.message });
  }
});

export default router;