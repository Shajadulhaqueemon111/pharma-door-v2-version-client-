// import { useEffect, useState } from "react";
// import axios from "axios";

// const SearchAllData = () => {
//   const [allData, setAllData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [res1, res2, res3] = await Promise.all([
//           axios.get("/napamedicine.json"),
//           axios.get("/seclomedicines.json"),
//           axios.get("/alloticemedicine.json"),
//         ]);

//         const combined = [
//           ...res1.data.map(item => ({ ...item, type: "medicine" })),
//           ...res2.data.map(item => ({ ...item, type: "supplement" })),
//           ...res3.data.map(item => ({ ...item, type: "equipment" })),
//         ];

//         setAllData(combined);
//       } catch (error) {
//         console.error("Data fetch error", error);
//       }
//     };

//     fetchAll();
//   }, []);
// }

// export default SearchAllData
