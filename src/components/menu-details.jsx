// src/pages/components/MenuDetails.jsx
import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function MenuDetails({
  filteredMenuItems,
  selectedCategory,
  setSelectedCategory,
  categories,
  addItemToCart,
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Categories Sidebar */}
      <div className="col-span-2 bg-white p-4 rounded-xl shadow hidden sm:block">
        <Typography variant="h6" className="mb-3 font-bold">
          Categories
        </Typography>

        <ul className="space-y-2">
          <div
            onClick={() => setSelectedCategory("All")}
            className={`border-b py-2 cursor-pointer ${
              selectedCategory === "All" ? "font-bold text-orange-600" : ""
            }`}
          >
            All
          </div>

          {categories.map((c) => (
            <div
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`border-b py-2 cursor-pointer ${
                selectedCategory === c ? "font-bold text-orange-600" : ""
              }`}
            >
              {c}
            </div>
          ))}
        </ul>
      </div>

      {/* Menu Items */}
      <div className="col-span-12 sm:col-span-10">
        <div className="grid gap-4">
          {filteredMenuItems.length === 0 ? (
            <Card className="p-10 text-center shadow-sm border">
              <Typography variant="h6" className="font-semibold text-gray-700">
                No items found
              </Typography>
              <Typography variant="body2" className="text-gray-500 mt-1">
                Try selecting a different category.
              </Typography>
            </Card>
          ) : (
            filteredMenuItems.map((item) => (
              <Card key={item._id} className="shadow-sm border">
                <CardContent className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <Typography className="font-semibold text-base">
                      {item.name}
                    </Typography>
                    <Typography className="text-sm text-gray-600 leading-tight">
                      {item.description?.slice(0, 120)}...
                    </Typography>
                  </div>

                  <div className="flex flex-col items-end">
                    <Typography className="font-semibold text-lg">
                      {item.price} AED
                    </Typography>

                    <Button
                      onClick={() => addItemToCart(item)}
                      variant="contained"
                      sx={{
                        minWidth: "32px",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        padding: 0,
                        marginTop: "6px",
                        backgroundColor: "rgb(245,89,5)",
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
