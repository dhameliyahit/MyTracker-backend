const express = require("express")
const dotenv = require("dotenv").config()
const connectDB = require("./db");
const Trip = require("./TripModel");
const mongoose = require("mongoose");
connectDB();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Expense Tracker");
})

app.post("/trip", async (req, res) => {
  const { title, mobileNumber } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ error: "Trip title is required", success: false });
    }

    const trip = await Trip.create({ title, mobileNumber });
    await trip.save(); // wait for the save to complete

   res.status(201).json({ message: "Trip created successfully", success: true });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ error: "Failed to create trip", success: false });
  }
});

app.get("/:mobileNumber", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const trips = await Trip.find({ mobileNumber });
    res.status(200).json({ trips, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to get all trip", success: false });
  }
});

app.get("/trip/:id", (req, res) => {
  try {
    const tripId = req.params.id;
    Trip.findById(tripId)
      .then((trip) => {
        if (!trip) {
          return res.status(404).json({ error: "Trip not found" });
        }
        res.status(200).json({ trip, success: true });
      })
      .catch((error) => {
        console.error("Error getting trip:", error);
        res.status(500).json({ error: "Failed to get trip", success: false });
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to get trip" });
  }
})

app.post("/trip/:id/expense", async (req, res) => {
  const { title, amount } = req.body;

  try {
    const tripId = req.params.id;
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ error: "Trip not found", success: true });
    }

    // Add new expense to the trip's expenses array
    trip.expenses.push({
      title,
      amount,
      date: new Date(), // optional, as schema already sets default
    });

    // Save the updated trip
    await trip.save();

    res.status(201).json({ message: "Expense added successfully", trip, success: true });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Failed to add expense", success: false });
  }
});

app.delete("/trip/:id", async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = await Trip.findByIdAndDelete(tripId);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.status(200).json({ message: "Trip deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete trip", success: false });
  }
})

app.delete("/trip/:id/expense/:expenseId", async (req, res) => {
  try {
    const tripId = req.params.id;
    const expenseId = req.params.expenseId;

    // Use $pull to remove the expense from the expenses array
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      {
        $pull: { expenses: { _id: expenseId } }
      },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ error: "Trip not found", success: false });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
      updatedTrip,
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});


app.get("/trip/:id/expense", async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = await Trip.findById(tripId); // await is required here

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const expenses = trip.expenses || [];
    res.status(200).json({ expenses, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get trip expense" });
  }
});

app.listen(PORT, () => {
  console.log("App Running Successfully");
})