import { createSlice } from "@reduxjs/toolkit";

let savedBasket = null;
try {
  savedBasket = JSON.parse(localStorage.getItem("basket") || "null");
} catch (e) {
  savedBasket = null;
}

const initialState = savedBasket || {
  items: [], //for {dish, quantity}
  itemCount: 0,
  totalQuantity: 0,
  totalPrice: 0,
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket(state, action) {
      const payload = action.payload || {};
      state.items = payload.items || [];
      state.itemCount = payload.itemCount || state.items.length;
      state.totalQuantity =
        payload.totalQuantity ||
        state.items.reduce((s, it) => s + it.quantity, 0);
      state.totalPrice =
        payload.totalPrice ||
        state.items.reduce(
          (s, it) => s + (parseFloat(it.dish.price) || 0) * it.quantity,
          0
        );
    },
    addDish(state, action) {
      const { dish, quantity = 1 } = action.payload;
      const id = dish._id || dish.id || dish.name;
      const existing = state.items.find((it) => {
        const existingId = it.dish._id || it.dish.id || it.dish.name;
        return existingId === id;
      });

      if (existing) {
        const maxStock =
          typeof dish.quantity === "number" ? dish.quantity : Infinity;
        existing.quantity = Math.min(existing.quantity + quantity, maxStock);
      } else {
        state.items.push({ dish, quantity });
      }

      state.itemCount = state.items.length;
      state.totalQuantity = state.items.reduce((s, it) => s + it.quantity, 0);
      state.totalPrice = state.items.reduce(
        (s, it) => s + (parseFloat(it.dish.price) || 0) * it.quantity,
        0
      );

      try {
        localStorage.setItem("basket", JSON.stringify(state));
      } catch (e) {}
    },
    removeDish(state, action) {
      const id = action.payload;
      state.items = state.items.filter((it) => {
        const existingId = it.dish._id || it.dish.id || it.dish.name;
        return existingId !== id;
      });
      state.itemCount = state.items.length;
      state.totalQuantity = state.items.reduce((s, it) => s + it.quantity, 0);
      state.totalPrice = state.items.reduce(
        (s, it) => s + (parseFloat(it.dish.price) || 0) * it.quantity,
        0
      );
      try {
        localStorage.setItem("basket", JSON.stringify(state));
      } catch (e) {}
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((it) => {
        const existingId = it.dish._id || it.dish.id || it.dish.name;
        return existingId === id;
      });
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((it) => {
            const existingId = it.dish._id || it.dish.id || it.dish.name;
            return existingId !== id;
          });
        } else {
          const maxStock =
            typeof item.dish.quantity === "number"
              ? item.dish.quantity
              : Infinity;
          item.quantity = Math.min(quantity, maxStock);
        }
      }
      state.itemCount = state.items.length;
      state.totalQuantity = state.items.reduce((s, it) => s + it.quantity, 0);
      state.totalPrice = state.items.reduce(
        (s, it) => s + (parseFloat(it.dish.price) || 0) * it.quantity,
        0
      );
      try {
        localStorage.setItem("basket", JSON.stringify(state));
      } catch (e) {}
    },
    clearBasket(state) {
      state.items = [];
      state.itemCount = 0;
      state.totalQuantity = 0;
      state.totalPrice = 0;
      try {
        localStorage.removeItem("basket");
      } catch (e) {}
    },
  },
});

export const { addDish, removeDish, updateQuantity, clearBasket } =
  basketSlice.actions;
export const { setBasket } = basketSlice.actions;

export default basketSlice.reducer;

export const sendToBasket = (dish, quantity = 1) => addDish({ dish, quantity });
