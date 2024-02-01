const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const Order = require('../models/order');
const { validateOrder } = require('../validation/order');
const RestaurantModel = require('../models/restaurant');
const OrderModel = require('../models/order');
const TableModel = require('../models/table');

// Order Routes
router.get('/getall', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});
// Retrieve orders by restaurant ID
// router.get('/by-restaurant/:restaurantId', async (req, res) => {
//   try {
//     const { restaurantId } = req.params;

//     // Retrieve the restaurant and its tables
//     const restaurant = await RestaurantModel.findById(restaurantId).populate('tables');
//     console.log(restaurant);
    
//     if (!restaurant) {
//       return res.status(404).json({ msg: 'Restaurant not found' });
//     }
    
//     const ordersPromises = restaurant.tables.map(async (table) => {
//       const ordersForTable = await OrderModel.find({ tableNumber: table._id });
//       return ordersForTable;
//     });
    
//     const orders = await Promise.all(ordersPromises);
    
//     // Flatten the array of arrays to a single array of orders
//     const flattenedOrders = [].concat(...orders);
    
//     console.log("orders", flattenedOrders);
    
    
//     res.json(orders);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: 'Internal Server Error' });
//   }
// });
router.get('/by-restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Retrieve the restaurant and its tables
    const restaurant = await RestaurantModel.findById(restaurantId).populate('tables');
    console.log(restaurant);
    
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    
    // Retrieve orders for each table and concatenate them directly
    let flattenedOrders = [];
    for (const table of restaurant.tables) {
      const ordersForTable = await OrderModel.find({ tableNumber: table._id });
      flattenedOrders = flattenedOrders.concat(ordersForTable);
    }

    console.log("orders", flattenedOrders);
    
    res.json(flattenedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


const isTableAvailable = async (tableNumber, date, startTime) => {
  console.log(tableNumber, date, startTime);
  const combinedDateTimeString = `${date}T${startTime}:00.000Z`;

  console.log(combinedDateTimeString);
  try {
    const isAvailable = await OrderModel.findOne({ tableNumber, date, startTime: combinedDateTimeString }).exec();
    console.log("isAvailable", isAvailable);
    if (isAvailable) {
      return false;
    }
    return true;
  } catch (err) {
    throw Error(err);
  }
};
const getTablesByNumChairs = async (restaurantId, numberOfGuests) => {
  console.log(restaurantId, numberOfGuests);
  try {
    const tables = await TableModel.find({ owner: restaurantId, numberOfChairs: { $gte: numberOfGuests } });
    return tables;
  } catch (err) {
    throw Error(err);
  }
};
router.get('/find-tables/:restaurantId/:numberOfGuests/:date/:startTime', async (req, res) => {
  try {
    const { restaurantId, numberOfGuests, date, startTime } = req.params;

    const restaurant = await RestaurantModel.findById(restaurantId).populate('tables');

    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    // Find all tables in the restaurant
    const tables = await getTablesByNumChairs(restaurantId, numberOfGuests);
    console.log("tables", tables);
    const availableTables = [];
    for (const t of tables) {
      console.log(await isTableAvailable(t._id, date, startTime));
      if (await isTableAvailable(t._id, date, startTime)) {
        availableTables.push(t);
      }
    }

    availableTables.sort((t1, t2) => t1.numberOfGuests - t2.numberOfGuests);
    // If there are no suitable tables, return a message
    if (availableTables.length === 0) {
      return res.status(400).json({ msg: 'No suitable tables available for the requested number of guests and time' });
    }


    // Return the table with the least number of seats
    const selectedTable = availableTables[0];

    console.log("selected table", selectedTable);
    res.status(200).json(selectedTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});



router.post('/:restaurantId/:tableNumber', async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findOne({ _id: req.params.restaurantId });
    const tableNumber = req.params.tableNumber;
    console.log(req.params.restaurantId);
    console.log(req.params.tableNumber);
    const { name, phone, date, startTime, numberOfGuests } = req.body;
    // const startTimeDate = new Date(`2000-01-01T${startTime}`);

    // Check if the restaurant is open on the specified day
    // const reservationDate = new Date(date);
    // const dayOfWeek = reservationDate.getDay();
    // const openingHours = restaurant.openingHours;

    // Ensure that the openingHours object has a property for the day of the week
    // if (!(dayOfWeek in openingHours)) {
    //   return res.status(400).json({ msg: 'Restaurant is closed on the selected day' });
    // }

    // Check if the requested time falls within valid opening hours
    // const requestedTime = new Date(startTime);
    // const openingTime = new Date(date);
    // openingTime.setHours(Number(openingHours.startTime.split(':')[0]), Number(openingHours.startTime.split(':')[1]));
    // const closingTime = new Date(date);
    // closingTime.setHours(Number(openingHours.endTime.split(':')[0]), Number(openingHours.endTime.split(':')[1]));

    // if (requestedTime < openingTime || requestedTime > closingTime) {
    //   return res.status(400).json({ msg: 'Invalid reservation time for the selected day' });
    // }

    // Assuming a reservation needs to be made at least two hours before closing
    // const minimumReservationTime = new Date(closingTime);
    // minimumReservationTime.setHours(closingTime.getHours() - 2);

    // if (requestedTime > minimumReservationTime) {
    //   return res.status(400).json({ msg: 'Reservation must be made at least two hours before closing' });
    // }
    console.log(restaurant.maxSeats);
    const validOrder = {
      name,
      phone,
      tableNumber: tableNumber,
      date,
      startTime,
      numberOfGuests
      // Add other order details
    };
    const validationResult = validateOrder(validOrder, restaurant.maxSeats);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error.details);
    }
    // Create a new order
    const newOrder = await OrderModel.create({
      name,
      phone,
      tableNumber: tableNumber,
      date,
      startTime,
      numberOfGuests
      // Add other order details
    });

    res.json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.delete('/delete/:orderId', auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Delete the order
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    res.json({ msg: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.put('/update/:orderId', auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Update the order details
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      req.body,
      { new: true } // Return the modified document
    );

    if (!updatedOrder) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

module.exports = router;


// router.post('/', auth, async (req, res) => {
//   try {
//     const { tableNumber, date, startTime, numberOfGuests } = req.body;
//     const restaurant = await RestaurantModel.findOne({ owner: req.tokenData._id });

//     // Check if the restaurant is open on the specified day
//     const openingHours = restaurant.openingHours[date.getDay()];
//     if (!openingHours) {
//       return res.status(400).json({ msg: 'Restaurant is closed on the selected day' });
//     }

//     // Check if the requested time falls within valid opening hours
//     const requestedTime = new Date(startTime);
//     const openingTime = new Date(date);
//     openingTime.setHours(Number(openingHours.startTime.split(':')[0]), Number(openingHours.startTime.split(':')[1]));
//     const closingTime = new Date(date);
//     closingTime.setHours(Number(openingHours.endTime.split(':')[0]), Number(openingHours.endTime.split(':')[1]));

//     if (requestedTime < openingTime || requestedTime > closingTime) {
//       return res.status(400).json({ msg: 'Invalid reservation time for the selected day' });
//     }

//     // Assuming a reservation needs to be made at least two hours before closing
//     const minimumReservationTime = new Date(closingTime);
//     minimumReservationTime.setHours(closingTime.getHours() - 2);

//     if (requestedTime > minimumReservationTime) {
//       return res.status(400).json({ msg: 'Reservation must be made at least two hours before closing' });
//     }

//     // Additional validation for max seats, etc.
//     const validationResult = validateOrder(req.body, restaurant.MaxSeats);
//     if (validationResult.error) {
//       return res.status(400).json(validationResult.error.details);
//     }

//     // Create a new order
//     const newOrder = await Order.create({
//       tableNumber,
//       date,
//       startTime,
//       numberOfGuests,
//       // Add other order details
//     });

//     res.json(newOrder);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: 'Internal Server Error' });
//   }
// });
