// src/pages/components/InfoSection.jsx
import React from "react";
import { Card, Typography } from "@mui/material";

export default function InfoSection({ restaurant }) {
  return (
    <Card className="p-6 shadow">
      <Typography variant="h6" className="font-bold mb-2">
        Restaurant Info
      </Typography>

      <Typography color="text.secondary" className="mb-2">
        {restaurant.description}
      </Typography>

      <Typography>
        📍 {restaurant.address}
        <br />
        📞 {restaurant.phone}
      </Typography>
    </Card>
  );
}
