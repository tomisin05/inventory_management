'use client'
import Image from "next/image";
import { useRef, useState, useEffect} from "react";
import {firestore} from '@/firebase';
import {Box,  Modal,  Stack,  TextField,  Typography, Button } from "@mui/material";
import { collection, query } from "firebase/firestore";
import { getDocs } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { setDoc, getDoc } from 'firebase/firestore';
import useFilteredInventory from "./filter";
import { Camera } from 'react-camera-pro';



export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState('');
  const [minQuantity, setMinQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(Infinity);
  const [camera, setCamera] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);

  


  const filteredInventory = useFilteredInventory(inventory, searchTerm, minQuantity, maxQuantity);

  
  const identifyItemsFromServer = async (imageBlob) => {
    try {
      const response = await fetch('/api/identify-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageBlob })
      });

      if (!response.ok) {
        throw new Error('Failed to identify items');
      }

      const items = await response.json();
      console.log('Items identified:', items);
      return items;
    } catch (error) {
      console.error('Error identifying items:', error);
      return [];
    }
  };
// const identifyItemsFromServer = async (imageBlob) => {
//     try {
//       const response = await fetch('/identify-items', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ imageBlob })
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to identify items');
//       }
  
//       const items = await response.json();
//       console.log('Items identified:', items);
//       return items;
//     } catch (error) {
//       console.error('Error identifying items:', error);
//       return [];
//     }
//   };
  



  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })

    })
    setInventory(inventoryList)
  }
  
    // const addItem = async (item) => {
    //     const docRef = doc(firestore, 'inventory', item);
    //     const docSnap = await getDoc(docRef);

    //     // When adding a new item
    //     const imageFile = './path/to/image.jpg';
    //     const items = await identifyItems(imageFile);

    //     if (docSnap.exists()) {
    //         const { quantity } = docSnap.data();
    //         await setDoc(docRef, {
    //         quantity: quantity + 1,
    //         name: item,
    //         category: items[0].category, // Assuming only one item per image
    //         });
    //     } else {
    //         await setDoc(docRef, {
    //         quantity: 1,
    //         name: item,
    //         category: items[0].category, // Assuming only one item per image
    //         });
    //     }

    //     await updateInventory();
    //     };


    // const addItem = async (item) => {
    //     const docRef = doc(firestore, 'inventory', item);
    //     const docSnap = await getDoc(docRef);
    
    //     // When adding a new item
    //     const imageFile = "C:\Users\tomis\OneDrive\Pictures\Screenshots\Screenshot 2023-09-29 152902.png"
    //     const items = await identifyItems(imageFile);
    
    //     if (docSnap.exists()) {
    //     const { quantity } = docSnap.data();
    //     await setDoc(docRef, {
    //         quantity: quantity + 1,
    //         name: item,
    //         category: items[0].category, // Assuming only one item per image
    //     });
    //     } else {
    //     await setDoc(docRef, {
    //         quantity: 1,
    //         name: item,
    //         category: items[0].category, // Assuming only one item per image
    //     });
    //     }
    
    //     await updateInventory();
    // };

    const addItem = async (item) => {
      const docRef = doc(firestore, 'inventory', item);
      const docSnap = await getDoc(docRef);
    
      // When adding a new item
      const items = await identifyItemsFromServer(capturedImage);
      console.log('Identified items:', items);
    
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, {
          quantity: quantity + 1,
          name: item,
          category: items[0].category, // Assuming only one item per image
        });
      } else {
        await setDoc(docRef, {
          quantity: 1,
          name: item,
          category: items[0].category, // Assuming only one item per image
        });
      }
    
      await updateInventory();
    };
    
    
  


  const removeItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()

      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {
          quantity: quantity - 1
        })
      }
      await updateInventory()
  }
  }
  

  


  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    if (cameraRef.current) {
      setCamera(cameraRef.current);
    }
  }, []);

const handleOpen = () => {
  setOpen(true)
}

const handleClose = () => {
  setOpen(false)
}
    

  return (
    <div>
  <Box 
  width = "100vw" 
  height = "100vh"
  display = {"flex"}
  flexDirection={'column'}
  justifyContent = {"center"}
  alignItems = {"center"}
  gap = {2}
  >
    <Modal
    open={open}
    onClose={handleClose}
    >
      <Box
      position = "absolute"
      top="50%"
      left="50%"
      width={400}
      height = "200px"
      bgcolor="white"
      border="2px solid #000"
      boxShadow={24}
      p={4}
      display="flex"
      flexDirection="column"
      gap={3}
      sx={{
        transform: "translate(-50%, -50%)",
      }}
      >
        <Typography variant='h6'>Add Item</Typography>
        <Stack width = "100" direction="row" spacing = {2}> 
          <TextField 
          id="outlined-basic"
          variant="outlined"
          label="Item"
          fullWidth
          value={itemName}
          onChange={(e) => {
            setItemName(e.target.value)
          }}
          />

         

          <Button
          variant = "outlined"
          onClick = {() => {
            addItem(itemName)
            setItemName("")
            handleClose()
          }}
          > Add </Button>
        </Stack>
      </Box>  
    </Modal> 

    <Box display="flex" gap={2} alignItems="center">
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        /> 
        <TextField
          label="Min Quantity"
          type="number"
          value={minQuantity}
          onChange={(e) => setMinQuantity(e.target.value)}
        />
        <TextField
          label="Max Quantity"
          type="number"
          value={maxQuantity}
          onChange={(e) => setMaxQuantity(e.target.value)}
        />
        
      </Box>
 
    <Button
    variant="contained"
    onClick = {() => {
      handleOpen()
    }}    
    > Add New Item
    </Button>       
    <Box border= "1px solid #333">
      <Box
      width="800px"
      height= "100px"
      bgcolor= "#ADD8E6"
      display='flex'
      alignItems="center"
      justifyContent="center"
      >
        <Typography
        variant="h2"
        color= "#333"
        textAlign="center"
        >Inventory Items
        </Typography>
      </Box>
    
      <Stack
      width="800px"
      height="300px"
      spacing={2}
      overflow="auto"
      >
      {
      filteredInventory.map(({name, quantity})=> (
        <Box
        key = {name}
        width="100%"
        height=" 150px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor='#f0f0f0'
        padding={5}
        >
          <Typography
          variant="h3"
          color="#333"
          textAlign="center"          
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Typography>

          <Typography
          variant="h3"
          color="#333"
          textAlign="center"          
          >
            {quantity}
          </Typography>
          <Stack direction = 'row' spacing={2}>
          <Button
          variant = "contained"
          onClick= {() => {
            removeItem(name)
          }}
          > Remove</Button>

          <Button
          variant = "contained"
          onClick= {() => {
            addItem(name)
          }}
          > Add </Button>
        </Stack>
        </Box>

      
      ))}

      
      </Stack>
    </Box>

   
<Stack direction="column" 
      spacing={2} 
      width="800px"
      height="800px"
    <Box display="flex" gap={2} alignItems="center">
      <Camera
  ref={cameraRef}
  aspectRatio={1}
  errorMessages={{
    noCameraAccessible: 'No camera accessible. Please allow camera access.',
    permissionDenied: 'Permission denied. Please allow camera access.',
  }}
/>
<Button
  variant="contained"
  onClick={async () => {
    if (camera) {
      console.log('Camera instance:', camera);
      const photo = await camera.capture();
      setCapturedImage(photo.blob);
    }
  }}
>
  Capture Photo
</Button>

        </Box>

      
      </Stack> 
    
  </Box> 
  </div>
  )
}



