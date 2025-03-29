package com.emovies.userMS.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(UserAlreadyExistException.class)
	public ResponseEntity<ErrorResponse> userAlreadyExistExceptionResponseEntity(UserAlreadyExistException e) {
		ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), e.getStatusCode());
		return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
	}

	@ExceptionHandler(CustomeAuthenticationException.class)
	public ResponseEntity<ErrorResponse> AuthenticationExceptionHandler(CustomeAuthenticationException e) {
		ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), e.getCode());
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
	}
}
