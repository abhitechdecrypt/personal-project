package com.movies.moviesservice.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MovieAlreadyExistException.class)
    public ResponseEntity<GlobalErrorResponse> handleBookingAlreadyExistException(MovieAlreadyExistException ex) {
    	GlobalErrorResponse errorResponse = new GlobalErrorResponse(ex.getMessage(), ex.getErrorCode());
    	return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MovieErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        MovieErrorResponse errorResponse = new MovieErrorResponse();
        errorResponse.setTimestamp(LocalDateTime.now());
        errorResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        errorResponse.setError("Bad Request");
        errorResponse.setMessage(ex.getMessage());
        errorResponse.setPath(request.getDescription(false).substring(4));

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MovieErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        MovieErrorResponse errorResponse = new MovieErrorResponse();
        errorResponse.setTimestamp(LocalDateTime.now());
        errorResponse.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorResponse.setError("Internal Server Error");
        errorResponse.setMessage(ex.getMessage());
        errorResponse.setPath(request.getDescription(false).substring(4));

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MovieNotAvailableException.class)
    public ResponseEntity<GlobalErrorResponse> handleNotAvailableException(MovieNotAvailableException ex){
        GlobalErrorResponse globalErrorResponse = new GlobalErrorResponse(ex.getMessage(), ex.getErrorCode());
        return new ResponseEntity<>(globalErrorResponse, HttpStatus.NOT_FOUND);
    }
}
