package com.movies.moviesservice.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MovieAlreadyExistException extends  RuntimeException{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String message;
    private String errorCode;

    public MovieAlreadyExistException(){
        super();
    }
}
