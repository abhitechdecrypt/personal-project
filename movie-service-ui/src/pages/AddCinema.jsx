import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createNewCinema } from "../services/service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CinemaForm = () => {
   const navigate = useNavigate();
   const initialValues = {
      name: "",
      address: "",
      totalScreens: "",
      totalSeats: "",
      facilities: "",
      blocked: false,
   };
   const validationSchema = Yup.object({
      name: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      totalScreens: Yup.number()
         .required("Required")
         .min(1, "Must be at least 1")
         .typeError("Must be a number"),
      totalSeats: Yup.number()
         .required("Required")
         .min(1, "Must be at least 1")
         .typeError("Must be a number"),
      facilities: Yup.string().required("Required"),
      blocked: Yup.boolean(),
   });
   const handleSubmit = async (values) => {
      try {
         await createNewCinema(values);
         toast.success("Cinema added successfully", {
            onClose: () => {
                navigate("/add-cinema");
            },
        });
      } catch (e) {
         toast.error(e.message);
      }
      console.log("Form Data Submitted:", values);
   };

   return (
      <Formik
         initialValues={initialValues}
         validationSchema={validationSchema}
         onSubmit={handleSubmit}
      >
         <Form className="space-y-4 p-6 bg-slate-300 rounded-lg text-black shadow-lg m-10">
            <h1 className="flex justify-center text-blue-950 text-2xl font-bold">Add Cinema</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label htmlFor="name" className="block text-sm font-medium">
                     Name
                  </label>
                  <Field
                     name="name"
                     type="text"
                     className="mt-1 text-black block w-full p-2 border border-gray-700 rounded-md"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
               </div>

               <div>
                  <label htmlFor="address" className="block text-sm font-medium">
                     Address
                  </label>
                  <Field
                     name="address"
                     type="text"
                     className="mt-1 text-black block w-full p-2 border border-gray-700 rounded-md"
                  />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
               </div>

               <div>
                  <label htmlFor="totalScreens" className="block text-sm font-medium">
                     Total Screens
                  </label>
                  <Field
                     name="totalScreens"
                     type="number"
                     className="mt-1 text-black block w-full p-2 border border-gray-700 rounded-md"
                  />
                  <ErrorMessage
                     name="totalScreens"
                     component="div"
                     className="text-red-500 text-sm"
                  />
               </div>

               <div>
                  <label htmlFor="totalSeats" className="block text-sm font-medium">
                     Total Seats
                  </label>
                  <Field
                     name="totalSeats"
                     type="number"
                     className="mt-1 text-black block w-full p-2 border border-gray-700 rounded-md"
                  />
                  <ErrorMessage
                     name="totalSeats"
                     component="div"
                     className="text-red-500 text-sm"
                  />
               </div>

               <div className="col-span-1 md:col-span-2">
                  <label htmlFor="facilities" className="block text-sm font-medium">
                     Facilities
                  </label>
                  <Field
                     name="facilities"
                     type="text"
                     className="mt-1 text-black block w-full p-2 border border-gray-700 rounded-md"
                  />
                  <ErrorMessage
                     name="facilities"
                     component="div"
                     className="text-red-500 text-sm"
                  />
               </div>

               <div className="col-span-1 md:col-span-2">
                  <label className="inline-flex items-center">
                     <Field type="checkbox" name="blocked" className="form-checkbox" />
                     <span className="ml-2">Blocked</span>
                  </label>
               </div>
            </div>

            <button
               type="submit"
               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
               Submit
            </button>
         </Form>
      </Formik>
   );
};

export default CinemaForm;
