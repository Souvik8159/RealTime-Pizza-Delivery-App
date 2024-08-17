const express = require('express');
const router = express.Router();
const multer = require('multer');
const Menu = require('../../../models/menu');
const path=require("path");

function addController() {
    return {
        addPizza(req,res){
            res.render("admin/additem")
        },
        addItem(req, res) {

            const { name, price, size } = req.body;
            console.log(req.body);
            console.log(req.file);
            const imagePath = req.file.filename;

            const newMenu = new Menu({
                name: name,
                image: imagePath,
                price: price,
                size: size
            });

            newMenu.save()
                .then(() => {
                    console.log("Menu item added:", newMenu);
                    res.redirect('/');
                })
                .catch(err => console.error("Error adding menu item:", err));
        }
    };
}

module.exports = addController;
