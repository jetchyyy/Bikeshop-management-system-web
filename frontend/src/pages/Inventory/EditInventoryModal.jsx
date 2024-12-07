import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase/firebase";

function EditInventoryModal({
  isOpen,
  toggleModal,
  currentItem,
  handleUpdate,
}) {
  const [categoryList, setCategoryList] = useState([]);

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    price: "",
    stockQuantity: "",
  });

  const [errors, setErrors] = useState({
    itemName: false,
    category: false,
    price: false,
    stockQuantity: false,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentItem) {
      setFormData({
        itemName: currentItem.itemName || "",
        category: currentItem.category || "",
        price: currentItem.price || "",
        stockQuantity: currentItem.stockQuantity || "",
      });
    }
  }, [currentItem]);

  //fetch the data of category for dropdown
  useEffect(() => {
    const categoryRef = ref(database, "category");

    const unsubscribe = onValue(categoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setCategoryList(formattedData);
      } else {
        setCategoryList([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Reset errors
    setErrors({
      itemName: false,
      category: false,
      price: false,
      stockQuantity: false,
    });
    let hasError = false;

    if (!formData.itemName) {
      setErrors((prev) => ({ ...prev, itemName: true }));
      hasError(true);
    }

    if (!formData.category) {
      setErrors((prev) => ({ ...prev, category: true }));
      hasError(true);
    }

    if (!formData.price) {
      setErrors((prev) => ({ ...prev, price: true }));
      hasError(true);
    }

    if (!formData.stockQuantity) {
      setErrors((prev) => ({ ...prev, stockQuantity: true }));
      hasError(true);
    }

    if (hasError) return;

    setSubmitting(true); // Disable submit button

    handleUpdate({
      ...formData,
    });

    setSubmitting(false); // Re-enable the button after updating
  };

  if (!isOpen || !currentItem) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 max-h-full overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Edit Inventory
          </h2>

          <div className="mb-4">
            <label htmlFor="itemName" className="block text-gray-700 mb-2">
              Item Name
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={formData.itemName || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                errors.itemName ? "border-red-500" : "border-gray-300"
              }`}
              disabled={submitting}
            />
            {errors.itemName && (
              <p className="text-red-500 mt-1">Item Name is required</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 mb-2">
              Category
            </label>
            <select
              type="text"
              id="category"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
              disabled={submitting}
            >
              <option value="" disabled>
                {" "}
                Select Category
              </option>
              {categoryList.map((item) => (
                <option key={item.id} value={item.category}>
                  {item.category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 mt-1">Category is required</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 mb-2">
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              disabled={submitting}
            />
            {errors.price && (
              <p className="text-red-500 mt-1">Price is required</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="stockQuantity" className="block text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="text"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
                errors.stockQuantity ? "border-red-500" : "border-gray-300"
              }`}
              disabled={submitting}
            />
            {errors.stockQuantity && (
              <p className="text-red-500 mt-1">Stock Quantity is required</p>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mr-2 " onClick={handleSubmit}>Save</button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600" onClick={toggleModal}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInventoryModal;
