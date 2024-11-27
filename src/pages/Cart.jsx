import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Cart = ({ cart, setCart }) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State untuk pemberitahuan
  const [quantities, setQuantities] = useState(
    cart.reduce((acc, item) => {
      acc[item.id] = 1;
      return acc;
    }, {})
  );
  const [checkedItems, setCheckedItems] = useState(
    cart.reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {})
  );

  const updateQuantity = (id, delta) => {
    setQuantities((prevQuantities) => {
      const newQuantity = prevQuantities[id] + delta;
      if (newQuantity > 0) {
        return { ...prevQuantities, [id]: newQuantity };
      }
      return prevQuantities;
    });
  };

  const handlePayment = () => {
    if (totalPrice > 0) {
      setPaymentSuccess(true);
      setShowAlert(false); // Hilangkan alert jika valid
      setTimeout(() => {
        setPaymentSuccess(false);
      }, 4000);
    } else {
      setShowAlert(true); // Tampilkan pemberitahuan jika total 0
      setTimeout(() => {
        setShowAlert(false); // Hilangkan pemberitahuan setelah 3 detik
      }, 3000);
    }
  };

  const toggleCheckbox = (id) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [id]: !prevCheckedItems[id],
    }));
  };

  const deleteItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce(
    (total, item) =>
      checkedItems[item.id] ? total + item.price * (quantities[item.id] || 1) : total,
    0
  );

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, [setCart]);

  return (
    <div className="ml-4 mr-4 mb-4 mt-4">
      {cart.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Keranjang Anda kosong</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center justify-between"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={checkedItems[item.id]}
                  onChange={() => toggleCheckbox(item.id)}
                  className="mr-4"
                />
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 rounded mr-6"
                />
                <div className="flex-1">
                  <div className="text-gray-800 font-semibold text-lg">
                    {item.name}
                  </div>
                  <div className="text-red-600 font-bold mt-2">
                    {item.price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <button
                  className="px-4 py-2 border border-gray-300"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </button>
                <span className="px-2">{quantities[item.id]}</span>
                <button
                  className="px-4 py-2 border border-gray-300"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
                <button
                  className="ml-4 text-red-500"
                  onClick={() => deleteItem(item.id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-lg font-semibold text-gray-800">
            Total Harga:{" "}
            {totalPrice.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </div>
          <button
            onClick={handlePayment}
            className="mt-4 md:mt-0 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ml-10"
          >
            Bayar
          </button>
        </div>
      )}

      {paymentSuccess && (
        <div className="mt-4 p-6 bg-green-100 text-green-700 border border-green-500 rounded">
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="ml-2 text-xl font-semibold">Pembayaran Berhasil!</span>
          </div>
        </div>
      )}

      {showAlert && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-500 rounded shadow-md">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m-1-4h4l1 2m1 0v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6a1 1 0 011-1h4z"
              />
            </svg>
            <span className="font-medium">Anda belum memilih item!</span>
          </div>
        </div>
      )}
    </div>
  );
};

Cart.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  setCart: PropTypes.func.isRequired,
};

export default Cart;
