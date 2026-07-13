import { BrowserRouter, Routes, Route } from "react-router-dom";

// Styles

//admin 

import { UserLayout } from "./component/userLayout";







const App = () => {
    return (
                <BrowserRouter>
                    <Routes>


                        <Route element={<UserLayout />}>
                          <Route path="/" element={<div>Dashboard</div>} />
                          <Route path="/dashboard" element={<div>Admin Dashboard</div>} />
                        </Route>

                    </Routes>
                </BrowserRouter>
    );
};

export default App;