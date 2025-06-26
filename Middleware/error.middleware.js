const errorMiddleware = (err, req, res, next)=>{
    try {
       let error = { ...err} // Create a shallow copy of the error object
         error.message = err.message;  // returns the error message
       console.error(err);

       // Mongoose bad ObjectId error
         if (err.name === 'CastError') { // This error occurs when an invalid ObjectId is used
              const message = `Resource not found. Invalid: ${err.path}`;
              error = new Error(message);
              error.statusCode = 404;
         }

         // Mongoose duplicate key error
            if (err.code === 11000) {
                const message = `Duplicate field value entered`;
                error = new Error(message);
                error.statusCode = 400;
            }
            // Mongoose validation error
            if (err.name === 'ValidationError') {
                const message = Object.values(err.errors).map(val => val.message);
                error = new Error(message);
                error.statusCode = 400;
            }
            //intercepting the error and sending a response
         res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error',
         });
    }catch (error) {
        next (error);
    }
}

export default errorMiddleware;