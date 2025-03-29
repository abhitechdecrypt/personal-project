import { axiosInstance } from "./AxiosInstance";
import * as api from'./API_CONSTANT';
import { toast } from "react-toastify";


export const login = async (data) => {
    try {
      const response = await axiosInstance.post(api.SUB_URL_USERS+api.USER_LOGIN,data);      
      return response.data;
    } catch (error) {
      throw error.response?.data; 
    }
  };
export const registerUser = async (data) => {
    try {
      const response = await axiosInstance.post(api.SUB_URL_USERS+api.USER_REGISTER,data);      
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  };

  export const getCinemaList = async () => {
    try {
      const response = await axiosInstance.get(api.SUB_URL_MOVIES+api.LIST_CINEMA);
      return response?.data;
    } catch (error) {
      console.error('Get cinema list error:', error.response?.data || error.message);
      throw error.response?.data; 
    }
  }
  export const createNewCinema = async (data) => {
    try {
      const response = await axiosInstance.post(api.SUB_URL_MOVIES+api.LIST_CINEMA,data);
      return response?.data;
    } catch (error) {
      console.error('Get cinema list error:', error.response?.data || error.message);
      throw error.response?.data; 
    }
  }

  export const addMovies = async (data) => {
    try {
      const response = await axiosInstance.post(api.SUB_URL_MOVIES+api.ADD_MOVIES,data);
      return response.data;
    } catch (error) {
      console.error('Add movies error:', error.response?.data || error.message);
      throw error.response?.data; 
    }
  }

  export const getMoviesData = async () => {
    try {
      const response = await axiosInstance.get(api.SUB_URL_MOVIES+api.ADD_MOVIES);
      return response.data;
    } catch (error) {
      console.error('Add movies error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  }
  export const getMoviesById = async (id) => {
    try {
      const response = await axiosInstance.get(api.SUB_URL_MOVIES+api.ADD_MOVIES+"/"+id);
      return response.data;
    } catch (error) {
      console.error('Add movies error:', error.response?.data || error.message);
      throw error.response?.data;
    }
  }
  export const getCinemaById = async (id) => {
    try {
      const response = await axiosInstance.get(api.SUB_URL_MOVIES+api.LIST_CINEMA+"/"+id);
      return response.data;
    } catch (error) {
      console.error('Add movies error:', error.response?.data || error.message);
      throw error.response?.data;
    }
  }
  export const bookMovies = async (data) => {
    try {
      const response = await axiosInstance.post(api.SUB_URL_MOVIES+api.BOOK_MOVIES,data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.statusCode;
    }
  }
  export const cancelBooking = async (bookingId, cancel) => {
    try {
      const response = await axiosInstance.put(api.SUB_URL_MOVIES+api.BOOK_MOVIES+"/"+bookingId+"?cancel="+cancel);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data || error.message);
      console.error('Add movies error:', error.response?.data || error.message);
      throw error.response?.data;
    }
  }
  export const findBookingById = async (id) => {
    try {
      const response = await axiosInstance.get(api.SUB_URL_MOVIES+api.BOOK_MOVIES+"?email="+id);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data || error.message);
      console.error('Add movies error:', error.response?.data || error.message);
      throw error.response?.data;
    }
  }
  export const blockUnblockCinema = async (id) => {
    try {
      const response = await axiosInstance.put(api.SUB_URL_MOVIES+api.BLOCK_UNBLOCK_CINEMA+"/"+id);
      return response.data;
    } catch (error) {
      console.error('Add movies error:', error.response?.data || error.message);
      throw error.response?.data; 
    }
  }