import { BrowserRouter, Routes, Route } from "react-router-dom";

// Styles

//admin 

import { UserLayout } from "./component/userLayout";

import { FileUploader } from "./user/upload";
import { UserLogin } from "./user/Login";
import { DriveManager } from "./user/DriveManager";







const App = () => {
    return (
                <BrowserRouter>
                    <Routes>


                        <Route element={<UserLayout />}>
                          <Route path="/login" element={<UserLogin />} />
                          <Route path="/storage/*" element={<DriveManager />} />
                          <Route path="/dashboard" element={<div>Admin Dashboard</div>} />
                          <Route path="/upload" element={<FileUploader />} />
                        </Route>

                    </Routes>
                </BrowserRouter>
    );
};

export default App;