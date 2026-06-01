import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard   from "./pages/Dashboard";
import Products    from "./pages/Products";
import AddProduct  from "./pages/AddProduct";
import Orders      from "./pages/Orders";
import Users       from "./pages/Users";
import Analytics   from "./pages/Analytics";
import Reviews     from "./pages/Reviews";
import Settings    from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"            element={<Dashboard />}  />
          <Route path="/products"    element={<Products />}   />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/orders"      element={<Orders />}     />
          <Route path="/users"       element={<Users />}      />
          <Route path="/analytics"   element={<Analytics />}  />
          <Route path="/reviews"     element={<Reviews />}    />
          <Route path="/settings"    element={<Settings />}   />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;