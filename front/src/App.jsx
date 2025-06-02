import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./user/Login";
import Join from "./user/Join";
import Pw from "./user/Pw";
import Id from "./user/Id";
import Main from "./main/Main";
import ProductPage from "./product/ProductPage";
import SearchResultPage from "./main/SearchResultPage";
import Layout from "./main/LayOut";
import Admin from "./Admin/Admin";
import User_List from "./Admin/User_List";
import Product_List from "./Admin/Product_List";
import Orders_List from "./Admin/Orders_List";
import Sales_Overview from "./Admin/Sales_Overview";
import {useEffect, useState} from 'react';
import SubCategoryPage from './menu_category/SubCategoryPage';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [setIsAdmin] = useState(false);
    useEffect(() => {
    const userId = sessionStorage.getItem("user_id");
    const isAdmin = sessionStorage.getItem("is_admin") === "1";

    if (isAdmin) {
        setIsAdmin(true);
    } else if (userId) {
        setIsLoggedIn(true);
    }
    }, []);

    return (
        <Router>
            <Routes>
                {/* 공통 레이아웃 Route */}
                <Route path="/" element={<Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}>
                    <Route index element={<Main />} /> {/* / 경로에 Main 보여줌 */}
                    <Route path="Login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
                    <Route path="Join" element={<Join />} />
                    <Route path="/subcategory/:subId" element={<SubCategoryPage />} />
                    <Route path="item/:productId" element={<ProductPage />} />
                    <Route path="/item/search" element={<SearchResultPage />} />
                    <Route path="Id" element={<Id />} />
                    <Route path="Pw" element={<Pw />} />
                    <Route path="/Admin" element={<Admin/>}/>
                    <Route path="/User_List" element={<User_List/>}/>
                    <Route path='/Product_List' element={<Product_List/>}/>
                    <Route path='/Orders_List' element={<Orders_List/>}/>
                    <Route path='Sales_Overview' element={<Sales_Overview/>}/>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
