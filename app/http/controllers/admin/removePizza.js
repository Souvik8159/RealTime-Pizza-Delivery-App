const express = require('express');
const router = express.Router();
const Menu = require('../../../models/menu');

function removeController() {
    return {
        async removePizza(req, res) {
            const { pizzaId } = req.body;

            try {
                // Find the pizza item by ID and remove it from the database
                const deletedPizza = await Menu.findOneAndDelete({ _id: pizzaId });
                if (!deletedPizza) {
                    return res.status(404).json({ error: "Pizza not found" });
                }
                console.log("Deleted pizza:", deletedPizza);
                res.redirect('/'); // Redirect to the home page after successful removal
            } catch (error) {
                console.error("Error removing pizza:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    };
}

module.exports = removeController;
