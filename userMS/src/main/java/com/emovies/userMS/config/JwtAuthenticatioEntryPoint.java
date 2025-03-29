package com.emovies.userMS.config;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.emovies.userMS.exception.CustomeAuthenticationException;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticatioEntryPoint implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		PrintWriter writer = response.getWriter();
		if (authException instanceof BadCredentialsException) {
			// Handle invalid token or credentials here
			writer.println("Invalid token or credentials: " + authException.getMessage());
//			throw new CustomeAuthenticationException(authException.getMessage(), "401");
		} else if (authException.getCause() instanceof ExpiredJwtException) {
			// Handle expired token here
			writer.println("Token has expired: " + authException.getCause().getMessage());
//			throw new CustomeAuthenticationException(authException.getCause().getMessage(), "419");
		} else {
			// Handle other authentication exceptions here
			writer.println("Access denied: " + authException.getMessage());
//			throw new CustomeAuthenticationException(authException.getCause().getMessage(), "419");
		}

	}

}
