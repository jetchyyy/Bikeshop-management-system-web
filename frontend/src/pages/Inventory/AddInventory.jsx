import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ref, push, set, onValue } from "firebase/database";
import { database } from "../../firebase/firebase";

function generateRandomKey(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function AddInventory({ isOpen, toggleModal }) {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [itemNameError, setItemNameError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [supplierError, setSupplierError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [stockQuantityError, setStockQuantityError] = useState(false);

  const handleSubmit = async () => {
    setItemNameError(!itemName);
    setCategoryError(!category);
    setSupplierError(!supplier);
    setPriceError(!price);
    setStockQuantityError(!stockQuantity);

    if (!itemName || !category || !supplier || !price || !stockQuantity) {
      return;
    }

    const inventoryRef = ref(database, "inventory");
    const newInventoryRef = push(inventoryRef);

    const qrKey = generateRandomKey(20);

    try {
      setLoading(true);
      const qrCodeDataUrl = await QRCode.toDataURL(qrKey, { width: 100 });

      const inventoryData = {
        itemName,
        price,
        category,
        supplier,
        stockQuantity,
        qrCode: qrCodeDataUrl,
      };

      await set(newInventoryRef, inventoryData);
      alert("Inventory has been added successfully!");
      setItemName("");
      setCategory("");
      setSupplier("");
      setPrice("");
      setStockQuantity("");
      toggleModal();
    } catch (error) {
      alert("Error adding inventory: " + error.message);
    } finally {
      setLoading(false);
    }
  };

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

  //fetch the data of supplier for dropdown
  useEffect(() => {
    const supplierRef = ref(database, "supplier");

    const unsubscribe = onValue(supplierRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setSupplierList(formattedData);
      } else {
        setSupplierList([]);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Inventory</h2>

        <div>
          <label htmlFor="itemName">Item Name</label>
          <input
            type="text"
            id="itemName"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
              itemNameError ? "border-red-500" : "border-gray-300"
            }`}
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            disabled={loading}
          />
          {itemNameError && <p className="text-red-500 mt-1">Required</p>}
        </div>

        <div>
          <label htmlFor="supplier">Supplier Name</label>
          <select
            id="supplier"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
              supplierError ? "border-red-500" : "border-gray-300"
            }`}
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            disabled={loading}
          >
            <option value="" disabled>
              Select Supplier
            </option>
            {supplierList.map((item) => (
              <option key={item.id} value={item.supplier}>
                {item.supplier}
              </option>
            ))}
          </select>
          {supplierError && <p className="text-red-500 mt-1">Required</p>}
        </div>


        <div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
              categoryError ? "border-red-500" : "border-gray-300"
            }`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          >
            <option value="" disabled>
              Select Category
            </option>
            {categoryList.map((item) => (
              <option key={item.id} value={item.category}>
                {item.category}
              </option>
            ))}
          </select>
          {categoryError && <p className="text-red-500 mt-1">Required</p>}
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
              priceError ? "border-red-500" : "border-gray-300"
            }`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={loading}
          />
          {priceError && <p className="text-red-500 mt-1">Required</p>}
        </div>

        <div>
          <label htmlFor="stockQuantity">Stock Quantity</label>
          <input
            type="number"
            id="stockQuantity"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring ${
              stockQuantityError ? "border-red-500" : "border-gray-300"
            }`}
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            disabled={loading}
          />
          {stockQuantityError && <p className="text-red-500 mt-1">Required</p>}
        </div>

        <div className="flex justify-start mt-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mr-2" 
          onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          onClick={toggleModal} disabled={loading}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddInventory;
