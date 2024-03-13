const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");

const saveOrdersController = async (req, res) => {
    try {
        const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }
        // create an array ofproduct objects from the cart Items
        const products = cartItems.map((item) => ({
            name: item?.title,
            quantity: item?.quantity,
            price: item?.price,
            image: item?.image
        }))
        //create a new Order
        const order = new orderModel({
            user: userId,
            products: products,
            totalPrice: totalPrice,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
        })

        await order.save();
        res.status(200).send({
            success: true,
            message: 'Order created successfully.',
            order,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in save orders api",
            error,
        })
    }
}

const userOrdersController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await orderModel.find({ user: userId }).populate("user");
        if (!orders || orders.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No orders found for this user',
            })
        }
        res.status(200).send({
            success: true,
            message: 'Success in fetching order',
            orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in user orders api',
            error,
        });
    }
}

module.exports = { saveOrdersController, userOrdersController };