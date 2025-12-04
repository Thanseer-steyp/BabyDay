"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/config/AxiosInstance";

export default function CartList() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    axiosInstance
      .get("user/cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        setCartItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // const fetchCart = async () => {
  //   try {
  //     const res = await fetch("http://localhost:8000/api/v1/user/cart/", {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     const data = await res.json();
  //     setCartItems(data);
  //   } catch (err) {
  //     console.error("Error fetching cart:", err);
  //   }

  //   setLoading(false);
  // };

  // useEffect(() => {
  //   fetchCart();
  // }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white p-4 rounded-2xl shadow-sm border"
            >
              <img
                src={item.product.image_main}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg border"
              />

              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <p className="text-gray-600">₹ {item.product.price}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
