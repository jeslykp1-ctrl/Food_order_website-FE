import React, { createContext, useContext, useReducer, useEffect } from "react";
import client from "../api/client";

// Initial state
const initialState = {
  cartItems: [],
};

// Actions
const ADD_ITEM = "ADD_ITEM";
const REMOVE_ITEM = "REMOVE_ITEM";
const UPDATE_ITEM = "UPDATE_ITEM";
const SET_CART = "SET_CART";
const CLEAR_CART = "CLEAR_CART";

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_ITEM: {
      const item = action.payload;
      const exist = state.cartItems.find((i) => i._id === item._id);
      if (exist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...item, quantity: 1 }],
        };
      }
    }

    case REMOVE_ITEM: {
      const id = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i._id !== id),
      };
    }
    case CLEAR_CART:
      return { ...state, cartItems: [] };

    case UPDATE_ITEM: {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cartItems: state.cartItems.filter((i) => i._id !== id),
        };
      }

      return {
        ...state,
        cartItems: state.cartItems.map((i) =>
          i._id === id ? { ...i, quantity } : i
        ),
      };
    }

    case SET_CART:
      return { ...state, cartItems: action.payload };

    default:
      return state;
  }
};

// Context
const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fetch cart on load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await client.get("/api/cart"); // Adjust API endpoint
        dispatch({ type: SET_CART, payload: res.data.items || [] });
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
    fetchCart();
  }, []);

  // Add item to cart
  const addItemToCart = async (item) => {
    try {
      await client.post("/api/cart/add-to-cart", {
        menuItemId: item._id,
        quantity: 1,
      });
      dispatch({ type: ADD_ITEM, payload: item });
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  // Remove item from cart
  const removeItemFromCart = async (id) => {
    try {
      await client.post("/api/cart/remove", { menuItemId: id });
      dispatch({ type: REMOVE_ITEM, payload: id });
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Update item quantity
  const updateItemQuantity = async (id, quantity) => {
    try {
      await client.post("/api/cart/update-cart", { menuItemId: id, quantity });
      dispatch({ type: UPDATE_ITEM, payload: { id, quantity } });
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const clearCart = async () => {
    try {
      await client.delete("api/cart/clear-cart/");
      dispatch({ type: CLEAR_CART });
    } catch (error) {
      console.error("Failed to clear quantity:", error);
    }
  };

  const cartCount = state.cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        cartCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = () => useContext(CartContext);
