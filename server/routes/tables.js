const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth'); // Import authentication middleware
const Table = require('../models/table'); // Import your Table model
const RestaurantModel = require('../models/restaurant');

// Table Routes
router.get('/getall', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});
router.post('/', auth, async (req, res) => {
  try {
    const { tableNumber, numberOfChairs, owner } = req.body;

    // Create a new table
    const newTable = await Table.create({
      tableNumber,
      numberOfChairs,
      owner
    });

    // Retrieve the restaurant by ID
    const restaurantId = owner; // Assuming owner is the restaurant ID, update accordingly
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    // Update the array of tables in the restaurant
    restaurant.tables.push(newTable._id);
    await restaurant.save();

    res.json(newTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error', error });
  }
});

router.delete('/delete/:tableId',auth, async (req, res) => {
  try {
    const tableId = req.params.tableId;

    // Delete the table
    const deletedTable = await Table.findByIdAndDelete(tableId);

    if (!deletedTable) {
      return res.status(404).json({ msg: 'Table not found' });
    }

    res.json({ msg: 'Table deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.put('/update/:tableId',auth, async (req, res) => {
  try {
    const tableId = req.params.tableId;

    // Update the table details
    const updatedTable = await Table.findByIdAndUpdate(
      tableId,
      req.body,
      { new: true } // Return the modified document
    );

    if (!updatedTable) {
      return res.status(404).json({ msg: 'Table not found' });
    }

    res.json(updatedTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

module.exports = router;
