const SkeletonLoader = () => {
   return (
      <div className="relative bg-white p-4 rounded-lg shadow-lg animate-pulse">
         <div className="w-full h-64 bg-gray-300 rounded-md"></div>
         <div className="mt-4 h-6 bg-gray-300 rounded w-3/4"></div>
         <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
         <div className="mt-2 h-4 bg-gray-300 rounded w-2/3"></div>
         <div className="mt-2 h-4 bg-gray-300 rounded w-1/4"></div>
         <div className="mt-2 h-4 bg-gray-300 rounded w-1/3"></div>
         <div className="mt-2 h-4 bg-gray-300 rounded w-1/5"></div>
      </div>
   );
};

export default SkeletonLoader;
