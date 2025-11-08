import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

 
export default function VIPModel({ open, onClose, onJoin }) {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    tier: "gold",
    payment: "card",
    agree: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const tiers = [
    { id: "silver", label: "Silver", price: "$149.99/mo" },
    { id: "gold", label: "Gold", price: "$299.99/mo" },
    { id: "platinum", label: "Platinum", price: "$399.99/mo" },
  ];

  const handleChange = (key) => (e) => {
    const value =
      e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((s) => ({ ...s, [key]: null }));
  };

  const validate = () => {
    const err = {};
    if (!form.fullname || form.fullname.trim().length < 2)
      err.fullname = "Please enter your full name.";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter a valid email.";
    if (!form.phone || form.phone.replace(/\D/g, "").length < 7)
      err.phone = "Enter a valid phone number.";
    if (!form.agree) err.agree = "You must agree to the terms.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { ...form };
       if (onJoin) await onJoin(payload);
      onClose?.();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTier = tiers.find((t) => t.id === form.tier) || tiers[1];

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "#0f1724", color: "#ffd07a" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              background: "transparent",
              width: "fit-content",
              height: "fit-content",
              borderRadius: "none",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/2189/2189538.png"
              alt="VIP"
              style={{ width: 56, height: 56 }}
            />
          </Avatar>
          <Box>
            <Typography variant="h6">Join VIP Membership</Typography>
            <Typography variant="caption" sx={{ color: "#cfd8dc" }}>
              Exclusive benefits, priority delivery and offers
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Chip label={selectedTier.price} color="warning" />
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "#07101a" }}>
        <Box sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full name"
                value={form.fullname}
                onChange={handleChange("fullname")}
                fullWidth
                error={!!errors.fullname}
                helperText={errors.fullname}
                variant="filled"
                sx={{ backgroundColor: "#b1d4f1ff" }}
                InputProps={{ disableUnderline: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                value={form.email}
                onChange={handleChange("email")}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
                variant="filled"
                sx={{ backgroundColor: "#b1d4f1ff" }}
                InputProps={{ disableUnderline: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                value={form.phone}
                onChange={handleChange("phone")}
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone}
                variant="filled"
                sx={{ backgroundColor: "#b1d4f1ff" }}
                InputProps={{ disableUnderline: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="filled">
                <InputLabel id="vip-tier-label">Tier</InputLabel>
                <Select
                  labelId="vip-tier-label"
                  value={form.tier}
                  label="Tier"
                  onChange={handleChange("tier")}
                  sx={{
                    backgroundColor: "#b1d4f1ff",
                    ":hover": { backgroundColor: "#d0e4f9ff" },
                    ":focus": { backgroundColor: "#d0e4f9ff" },
                  }}
                >
                  {tiers.map((t) => (
                    <MenuItem
                      key={t.id}
                      value={t.id}
                      sx={{ backgroundColor: "#b1d4f1ff" }}
                    >{`${t.label} — ${t.price}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel id="vip-payment-label">
                  Preferred payment
                </InputLabel>
                <Select
                  labelId="vip-payment-label"
                  value={form.payment}
                  sx={{
                    backgroundColor: "#b1d4f1ff",
                    ":hover": { backgroundColor: "#d0e4f9ff" },
                    ":focus": { backgroundColor: "#d0e4f9ff" },
                  }}
                  onChange={handleChange("payment")}
                >
                  <MenuItem value="card">Credit / Debit Card</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="cash">Cash on Delivery</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.agree}
                    onChange={handleChange("agree")}
                    style={{ color: "#cfd8dc" }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: "#cfd8dc" }}>
                    I agree to the VIP <strong>terms & benefits</strong>.
                  </Typography>
                }
              />
              {errors.agree && (
                <Typography variant="caption" color="error">
                  {errors.agree}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ bgcolor: "#07101a", px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={submitting}
          sx={{ color: "#cfd8dc" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{ bgcolor: "#ffd07a", color: "#111", fontWeight: 700 }}
        >
          {submitting ? "Joining..." : `Join ${selectedTier.label}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
