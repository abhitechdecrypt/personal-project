import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { registerUser } from "../services/service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
   const navigate = useNavigate();
   const initialValues = {
      userName: "",
      password: "",
      email: "",
      phoneNumber: "",
      address: "",
      userRole: "USER", // Default role
      accountStatus: "ACTIVE",
   };

   const validationSchema = Yup.object({
      userName: Yup.string().required("User Name is required"),
      password: Yup.string().required("Password is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phoneNumber: Yup.string()
         .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits")
         .required("Phone Number is required"),
      address: Yup.string().required("Address is required"),
      userRole: Yup.string().oneOf(["USER", "ADMIN"], "Invalid Role").required("Role is required"),
   });

   const handleSubmit = async (values) => {
      console.log("Form Data Submitted:", values);
      try {
         await registerUser(values);
         toast.success("User Registered successfully", {
            onClose: () => {
               navigate("/user-login");
            },
         });
      } catch (error) {
         toast.error(error?.message);
      }
   };

   return (
      <div className="p-4 m-10 bg-slate-100 rounded-lg shadow-md">
         <h2 className="text-2xl font-bold mb-4">Register</h2>
         <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
         >
            {({ errors, touched }) => (
               <Form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <label
                           htmlFor="userName"
                           className="block text-sm font-medium text-gray-700"
                        >
                           User Name
                        </label>
                        <Field
                           type="text"
                           id="userName"
                           name="userName"
                           className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                              errors.userName && touched.userName
                                 ? "border-red-500"
                                 : "focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                           } sm:text-sm`}
                        />
                        {errors.userName && touched.userName && (
                           <div className="text-red-500 text-sm">{errors.userName}</div>
                        )}
                     </div>
                     <div>
                        <label
                           htmlFor="password"
                           className="block text-sm font-medium text-gray-700"
                        >
                           Password
                        </label>
                        <Field
                           type="password"
                           id="password"
                           name="password"
                           className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                              errors.password && touched.password
                                 ? "border-red-500"
                                 : "focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                           } sm:text-sm`}
                        />
                        {errors.password && touched.password && (
                           <div className="text-red-500 text-sm">{errors.password}</div>
                        )}
                     </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                           Email
                        </label>
                        <Field
                           type="email"
                           id="email"
                           name="email"
                           className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                              errors.email && touched.email
                                 ? "border-red-500"
                                 : "focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                           } sm:text-sm`}
                        />
                        {errors.email && touched.email && (
                           <div className="text-red-500 text-sm">{errors.email}</div>
                        )}
                     </div>
                     <div>
                        <label
                           htmlFor="phoneNumber"
                           className="block text-sm font-medium text-gray-700"
                        >
                           Phone Number
                        </label>
                        <Field
                           type="text"
                           id="phoneNumber"
                           name="phoneNumber"
                           className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                              errors.phoneNumber && touched.phoneNumber
                                 ? "border-red-500"
                                 : "focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                           } sm:text-sm`}
                        />
                        {errors.phoneNumber && touched.phoneNumber && (
                           <div className="text-red-500 text-sm">{errors.phoneNumber}</div>
                        )}
                     </div>
                     <div>
                        <label
                           htmlFor="address"
                           className="block text-sm font-medium text-gray-700"
                        >
                           Address
                        </label>
                        <Field
                           type="text"
                           id="address"
                           name="address"
                           className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                              errors.address && touched.address
                                 ? "border-red-500"
                                 : "focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                           } sm:text-sm`}
                        />
                        {errors.address && touched.address && (
                           <div className="text-red-500 text-sm">{errors.address}</div>
                        )}
                     </div>
                     <div>
                        <label
                           htmlFor="userRole"
                           className="block text-sm font-medium text-gray-700"
                        >
                           Role
                        </label>
                        <Field
                           as="select"
                           id="userRole"
                           name="userRole"
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                           <option value="USER">User</option>
                           <option value="ADMIN">Admin</option>
                        </Field>
                     </div>
                  </div>
                  <button
                     type="submit"
                     className="w-[29rem] bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                     Register
                  </button>
               </Form>
            )}
         </Formik>
      </div>
   );
};

export default RegisterPage;
