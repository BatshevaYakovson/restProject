const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const Restaurant = require('../models/restaurant');
const { validateRestaurant } = require('../validation/restaurant');
const RestaurantModel = require('../models/restaurant');
const mongoose = require("mongoose");
const { Types: { ObjectId } } = mongoose;
const { extractUserIdFromToken } = require('../helpers/userHelper');
const TableModel = require('../models/table');

router.get('/tables-details/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Retrieve the restaurant by ID
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      console.log("Restaurant not found");
      return res.status(404).json({ msg: 'Restaurant not found' });
    }


    // Retrieve details for each table in the restaurant sequentially
    const tablesDetails = [];
    for (const tableId of restaurant.tables) {
      const table = await TableModel.findById(tableId);

      if (!table) {
        console.log(`Table not found for ID: ${tableId}`);
        return res.status(404).json({ msg: `Table not found for ID: ${tableId}` });
      }

      console.log("Table found:", table);

      tablesDetails.push({
        tableId: table._id,
        tableNumber: table.tableNumber,
        numberOfChairs: table.numberOfChairs,
      });
    }

    console.log("Tables Details:", tablesDetails);

    res.json({ tablesDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

// Apply the middleware to the route
router.get('/my-restaurant', async (req, res) => {
  try {
    let token = req.header("x-api-key");
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const userId = extractUserIdFromToken(token);

    if (!userId) {
      return res.status(401).json({ msg: 'Invalid token, authorization denied' });
    }

    // Retrieve the restaurant owned by the user
    const restaurant = await RestaurantModel.findOne({ owner: userId });

    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found for this user' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});
// GET All Restaurants
router.get('/getall', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});
// GET Single Restaurant by ID
router.get('/:restaurantId', async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    // Retrieve the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

// PUT Edit Restaurant
// UPDATE Restaurant
router.put('/update/:restaurantId', auth, async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    // Retrieve the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    // Check if the user is the owner of the restaurant
    if (!restaurant || restaurant.owner.toString() !== req.tokenData._id) {

      console.log(restaurant.owner.toString());
      console.log(req.tokenData.userId);
      return res.status(403).json({ msg: 'You are not the owner of this restaurant' });
    }

    // Update the restaurant details
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      req.body,
      { new: true } // Return the modified document
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    res.json(updatedRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

// DELETE Restaurant
router.delete('/delete/:restaurantId', auth, async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    // Retrieve the restaurant
    const restaurant = await Restaurant.findById(restaurantId);

    // Check if the user is the owner of the restaurant
    if (!restaurant || restaurant.owner.toString() !== req.tokenData._id) {
      console.log(req.tokenData._id);
      return res.status(403).json({ msg: 'You are not the owner of this restaurant' });
    }

    // Delete the restaurant
    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);

    if (!deletedRestaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    res.json({ msg: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});
// POST Create Restaurant
// router.post('/', async (req, res) => {
//     try {
//       // Create a new restaurant
//       const newRestaurant = await Restaurant.create({
//         name: req.body.name,
//         // Add other restaurant details
//       });

//       res.json(newRestaurant);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ msg: 'Internal Server Error' });
//     }
//   });


// POST endpoint for creating a restaurant
router.post("/", async (req, res) => {
  try {
    // Extract details from the request body
    const {
      name,
      maxSeats,
      imgUrl,
      email,
      address,
      phone,
      openingHours,
      owner,
      tables,
    } = req.body;

    // Convert string values to ObjectId for the "tables" field
    // const tableIds = tables.map(tableId => ObjectId(tableId));

    // Create a new restaurant instance
    const newRestaurant = new RestaurantModel({
      name,
      maxSeats,
      imgUrl,
      email,
      address,
      phone,
      openingHours,
      owner, // Assuming owner is the ID of the restaurant owner
      tables, // Use the converted array of ObjectId values
    });

    // Save the restaurant to the database
    const savedRestaurant = await newRestaurant.save();

    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

module.exports = router;
