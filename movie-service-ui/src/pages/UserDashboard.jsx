import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Login/AuthProvider"; // Adjust path as needed
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import profilepic from "../assets/images/student-1.png"

const UserDashboard = () => {
    const { user } = useAuth(); // Assume useAuth provides user information
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Retrieve user data from cookies on component mount
        const token = Cookies.get("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("User Data:: ", decoded);
                setUserInfo(decoded?.userData);
            } catch (e) {
                setError(e?.message);
                console.error("Failed to decode token:", e);
            }
        }
    }, [user]);

    if (error) return <div className="p-6 bg-red-100 text-red-800 rounded-md">{`Error: ${error}`}</div>;
    if (!userInfo) return <div className="p-6 bg-gray-100 text-gray-800 rounded-md">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto m-12 bg-slate-200 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h2>
            <div className="flex flex-col md:flex-row md:space-x-8 mb-6">
                <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">User Information</h3>
                    <div className="space-y-2">
                        <p className="text-lg">
                            <span className="font-medium text-gray-600">Name:</span> {userInfo.username}
                        </p>
                        <p className="text-lg">
                            <span className="font-medium text-gray-600">Email:</span> {userInfo.email}
                        </p>
                        <p className="text-lg">
                            <span className="font-medium text-gray-600">Phone:</span> {userInfo.phoneNumber}
                        </p>
                        <p className="text-lg">
                            <span className="font-medium text-gray-600">Address:</span> {userInfo.address}
                        </p>
                        <p className="text-lg">
                            <span className="font-medium text-gray-600">Role:</span> {userInfo.userRole}
                        </p>
                        <p className="text-lg">
                            <span className="font-medium text-gray-600">Status:</span> {userInfo.accountStatus}
                        </p>
                    </div>
                </div>
                <div className="flex-1 mt-6 md:mt-0 flex items-center justify-center">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Profile Picture</h3>
                        {userInfo.profilePicture ? (
                            <img
                                src={profilepic}
                                alt="Profile"
                                className="w-40 h-40 rounded-full mx-auto border-4 border-gray-200 shadow-md"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-40 h-40 bg-gray-200 rounded-full border-4 border-gray-300">
                                <span className="text-gray-500">No profile picture</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
