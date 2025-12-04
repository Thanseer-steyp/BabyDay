"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/config/AxiosInstance";
import { mediaBaseURL } from "@/components/config/AxiosInstance";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [extraData, setExtraData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!slug) return;

    axiosInstance
      .get(`public/products/${slug}/`)
      .then((res) => {
        const prod = res.data;
        setProduct(prod);
        setSelectedImage(prod.image_main);
        console.log(prod);

        // Fetch extra info based on category
        if (prod.category === "cloth") {
          axiosInstance
            .get(`public/cloth/${prod.id}/`)
            .then((res2) => {
              setExtraData(res2.data), console.log(res2.data);
            })
            .catch(() => setExtraData(null));
        } else if (prod.category === "jewellery") {
          axiosInstance
            .get(`public/jewellery/${prod.id}/`)
            .then((res2) => setExtraData(res2.data))
            .catch(() => setExtraData(null));
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await axiosInstance.post(
        `user/add-to-cart/${product.id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        alert("Added to cart!");
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        alert("Please login first.");
      } else {
        alert("Failed to add to cart.");
      }
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!product)
    return <p className="text-center mt-10 text-red-500">Product not found.</p>;

  const availableImages = [
    product.image_main,
    product.image_2,
    product.image_3,
    product.image_4,
  ].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div>
          <img
            src={`${mediaBaseURL}${selectedImage}`}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg mb-4"
          />
          {availableImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {availableImages.map((img, idx) => (
                <img
                  key={idx}
                  src={`${mediaBaseURL}${img}`}
                  alt={`${product.name} ${idx + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-full h-20 object-cover rounded cursor-pointer border-2 transition ${
                    selectedImage === img
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <Link href="/cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-shopping-cart-icon lucide-shopping-cart"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </Link>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-4 mb-4">
            <p className="text-3xl text-blue-600 font-bold">${product.price}</p>
            {product.mrp &&
              parseFloat(product.mrp) > parseFloat(product.price) && (
                <p className="text-xl text-gray-400 line-through">
                  ${product.mrp}
                </p>
              )}
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            )}
          </div>

          <p className="text-gray-600 capitalize mb-6">
            Category: <span className="font-medium">{product.category}</span>
          </p>

          <hr className="my-6" />

          {/* Cloth Details */}
          {product.category === "cloth" && extraData && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Product Details</h2>

              <div className="grid grid-cols-2 gap-4">
                {extraData.sizes && extraData.sizes.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Available Sizes</p>
                    <div className="flex gap-2 mt-1">
                      {extraData.sizes.map((size, idx) => (
                        <span
                          key={idx}
                          className="border border-gray-300 px-3 py-1 rounded hover:border-blue-500 cursor-pointer transition"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {extraData.material && (
                  <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="font-medium">{extraData.material}</p>
                  </div>
                )}

                {extraData.style && (
                  <div>
                    <p className="text-sm text-gray-500">Style</p>
                    <p className="font-medium">{extraData.style}</p>
                  </div>
                )}

                {extraData.fit_type && (
                  <div>
                    <p className="text-sm text-gray-500">Fit Type</p>
                    <p className="font-medium">{extraData.fit_type}</p>
                  </div>
                )}

                {extraData.length && (
                  <div>
                    <p className="text-sm text-gray-500">Length</p>
                    <p className="font-medium">{extraData.length}</p>
                  </div>
                )}

                {extraData.sleeves_length && (
                  <div>
                    <p className="text-sm text-gray-500">Sleeve Length</p>
                    <p className="font-medium">{extraData.sleeves_length}</p>
                  </div>
                )}

                {extraData.collar && (
                  <div>
                    <p className="text-sm text-gray-500">Collar</p>
                    <p className="font-medium">{extraData.collar}</p>
                  </div>
                )}

                {extraData.hemline && (
                  <div>
                    <p className="text-sm text-gray-500">Hemline</p>
                    <p className="font-medium">{extraData.hemline}</p>
                  </div>
                )}

                {extraData.material_stretch && (
                  <div>
                    <p className="text-sm text-gray-500">Stretch</p>
                    <p className="font-medium">{extraData.material_stretch}</p>
                  </div>
                )}

                {extraData.pattern_type && (
                  <div>
                    <p className="text-sm text-gray-500">Pattern</p>
                    <p className="font-medium">{extraData.pattern_type}</p>
                  </div>
                )}

                {extraData.transparency && (
                  <div>
                    <p className="text-sm text-gray-500">Transparency</p>
                    <p className="font-medium">{extraData.transparency}</p>
                  </div>
                )}

                {extraData.weight && (
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{extraData.weight} kg</p>
                  </div>
                )}

                {extraData.package && (
                  <div>
                    <p className="text-sm text-gray-500">Package Contents</p>
                    <p className="font-medium">{extraData.package}</p>
                  </div>
                )}

                {extraData.made_in && (
                  <div>
                    <p className="text-sm text-gray-500">Made In</p>
                    <p className="font-medium">{extraData.made_in}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Jewellery Details */}
          {product.category === "jewellery" && extraData && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Product Details</h2>

              <div className="grid grid-cols-2 gap-4">
                {extraData.material && (
                  <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="font-medium">{extraData.material}</p>
                  </div>
                )}

                {extraData.colour && (
                  <div>
                    <p className="text-sm text-gray-500">Colour</p>
                    <p className="font-medium">{extraData.colour}</p>
                  </div>
                )}

                {extraData.sizes && extraData.sizes.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Available Sizes</p>
                    <div className="flex gap-2 mt-1">
                      {extraData.sizes.map((size, idx) => (
                        <span
                          key={idx}
                          className="border border-gray-300 px-3 py-1 rounded hover:border-blue-500 cursor-pointer transition"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {extraData.weight && (
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{extraData.weight} kg</p>
                  </div>
                )}

                {extraData.package && (
                  <div>
                    <p className="text-sm text-gray-500">Package Contents</p>
                    <p className="font-medium">{extraData.package}</p>
                  </div>
                )}

                {extraData.made_in && (
                  <div>
                    <p className="text-sm text-gray-500">Made In</p>
                    <p className="font-medium">{extraData.made_in}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            disabled={product.stock === 0}
            onClick={addToCart}
            className={`mt-8 w-full py-3 px-6 rounded-lg font-semibold transition ${
              product.stock > 0
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
