import React, { useEffect, useState, useContext } from "react";
import useStyles from "./styles";
import { Button, IconButton, Tab, Tabs } from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import productApi from "../../api/productApi";
import { GlobalState } from "../../GlobalState";

import axios from "axios";
import ProductItem from "../../components/Products/ProductItem/ProductItem";
import Subscibe from "../../components/Subscribe/Subscibe";

function SingleProduct({ match }) {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [recommendPro, setRecommendPro] = useState([]);

  const [product, setProduct] = useState([]);

  const state = useContext(GlobalState);
  const addCart = state.userAPI.addCart;
  const [cart] = state.userAPI.cart;

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await productApi.getSingleProduct(match.params.id);
        setProduct(response.data.product);
        setRecommendPro(response.data.recommendProducts);
      } catch (error) {
        console.log("Failed to load product list", error);
      }
    };

    fetchProductList();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    addCart(product, quantity);
  };

  return (
    <div className={classes.root}>
      <div className={classes.product}>
        <img
          className={classes.image}
          src={product.imageUrl}
          alt={product.name}
        ></img>

        <div className={classes.information}>
          <h1 className={classes.name}>{product.name}</h1>
          <h2>${product.price}</h2>

          <Tabs
            value={selectedTab}
            onChange={handleChangeTab}
            className={classes.tabs}
            indicatorColor="primary"
          >
            <Tab label="Description" />
            <Tab label="Ingredients" />
            <Tab label="Application" />
          </Tabs>

          {selectedTab === 0 && (
            <div className={classes.description}>
              <p style={{ textAlign: "justify" }}>{product.description}</p>
              <h4 style={{ marginTop: "40px" }}>Quantity</h4>

              <div className={classes.buttonGroup}>
                <Button
                  onClick={handleDecrement}
                  className={classes.countButton}
                  style={{
                    maxWidth: "20px",
                    maxHeight: "20px",
                    minWidth: "20px",
                    minHeight: "20px",
                  }}
                >
                  -
                </Button>
                <h4 className={classes.quantity}> {quantity} </h4>
                <Button
                  onClick={handleIncrement}
                  className={classes.countButton}
                  style={{
                    maxWidth: "20px",
                    maxHeight: "20px",
                    minWidth: "20px",
                    minHeight: "20px",
                  }}
                >
                  +
                </Button>
              </div>

              <div>
                <Button
                  className={classes.addToCartButton}
                  color="secondary"
                  variant="contained"
                  onClick={handleAddToCart}
                >
                  Add to cart
                </Button>
                <IconButton>
                  <FavoriteBorderIcon />
                </IconButton>
              </div>
            </div>
          )}
          {selectedTab === 1 && (
            <p style={{ textAlign: "justify" }}>{product.ingredients}</p>
          )}

          {selectedTab === 2 && <p>application</p>}
        </div>
      </div>

      <div className={classes.reSection}>
        <h1>Recommended For You</h1>
      </div>
      <div className={classes.recommendProduct}>
        {recommendPro?.map((item, index) => (
          <ProductItem key={index} item={item} />
        ))}
      </div>

      <Subscibe />
    </div>
  );
}

export default SingleProduct;
