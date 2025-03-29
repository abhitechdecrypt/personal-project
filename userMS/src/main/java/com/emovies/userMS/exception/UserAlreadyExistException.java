package com.emovies.userMS.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserAlreadyExistException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String message;
    private String statusCode;
    
    public UserAlreadyExistException(String message) {
    	super(message);
    }
}
