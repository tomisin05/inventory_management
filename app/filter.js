import { useState, useEffect } from 'react';

const useFilteredInventory = (inventory, searchTerm, minQuantity, maxQuantity) => {
  const [filteredInventory, setFilteredInventory] = useState([]);

  useEffect(() => {
    const filtered = inventory.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    //   const matchesCategory = category === '' || item.category === category;
      const matchesQuantity = item.quantity >= minQuantity && item.quantity <= maxQuantity;
      return matchesSearch  && matchesQuantity;
    });
    setFilteredInventory(filtered);
  }, [inventory, searchTerm, minQuantity, maxQuantity]);

  return filteredInventory;
};

export default useFilteredInventory;
