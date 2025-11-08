import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerName: "",
  customerEmail: "",
  customerAddress: "",
  customerPhone: "",
  guests: 0,
  tableNo: "",
  orderStatus: "pending",
  orderTotal: 0,
  orderItems: [],
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      const { name, phone, guests } = action.payload;
      state.customerName = name;
      state.customerPhone = phone;
      state.guests = guests;
    },
    removeCustomer: (state) => {
      state.customerName = "";
      state.customerEmail = "";
      state.customerAddress = "";
      state.customerPhone = "";
      state.guests = 0;
      state.tableNo = "";
    },
    updateTableNo: (state, action) => {
      state.tableNo = action.payload;
    },
    sendOrder: (state, action) => {
      const { orderItems, orderTotal } = action.payload;
      state.orderItems = orderItems;
      state.orderTotal = orderTotal;
      state.orderStatus = "sent";
    },
    emailConfirmation: (state, action) => {
      const { email, address } = action.payload;
      state.customerEmail = email;
      state.customerAddress = address;
    },
  },
});

export const {
  setCustomer,
  removeCustomer,
  updateTableNo,
  sendOrder,
  emailConfirmation,
} = customerSlice.actions;

export default customerSlice.reducer;
 