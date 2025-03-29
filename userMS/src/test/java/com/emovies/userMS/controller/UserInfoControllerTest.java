package com.emovies.userMS.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.emovies.userMS.DAO.ResponseDTO;
import com.emovies.userMS.DAO.UserLoginDTO;
import com.emovies.userMS.Entity.JWTResponse;
import com.emovies.userMS.Entity.UserInfo;
import com.emovies.userMS.service.UserInfoServiceImpl;
import com.emovies.userMS.service.UserLoginService;

class UserInfoControllerTest {

    @InjectMocks
    private UserInfoController userInfoController;

    @Mock
    private UserInfoServiceImpl userInfoService;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private UserLoginService loginService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser_Success() {
        // Arrange
        UserInfo userInfo = new UserInfo();
        when(userInfoService.registerUser(any(UserInfo.class))).thenReturn(userInfo);

        // Act
        ResponseEntity<ResponseDTO<UserInfo>> responseEntity = userInfoController.registerUser(userInfo);

        // Assert
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        assertEquals("User Registered Successfully!", responseEntity.getBody().getMessage());
    }

    @Test
    void testRegisterUser_Failure() {
        // Arrange
        UserInfo userInfo = new UserInfo();
        doThrow(new RuntimeException("Database error")).when(userInfoService).registerUser(any(UserInfo.class));

        // Act
        ResponseEntity<ResponseDTO<UserInfo>> responseEntity = userInfoController.registerUser(userInfo);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, responseEntity.getStatusCode());
        assertEquals("An error occurred: Database error", responseEntity.getBody().getMessage());
    }

    @Test
    void testLogin_Success() {
        // Arrange
        UserLoginDTO loginDTO = new UserLoginDTO("test@example.com", "password", "1234567890");
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("test@example.com")
                .password("password")
                .roles("USER")
                .build();
        JWTResponse jwtResponse = JWTResponse.builder().token("jwt-token").isValid(true).build();

        when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(userDetails);
        when(userInfoService.userLogin(userDetails, "test@example.com")).thenReturn(jwtResponse);

        // Act
        ResponseEntity<JWTResponse> responseEntity = userInfoController.login(loginDTO);

        // Assert
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("jwt-token", responseEntity.getBody().getToken());
        assertEquals(true, responseEntity.getBody().isValid());
    }

    @Test
    void testLogin_Failure() {
        // Arrange
        UserLoginDTO loginDTO = new UserLoginDTO("test@example.com", "wrongpassword", "1234567890");

        doThrow(new RuntimeException("Authentication failed")).when(loginService).doAuthenticate("test@example.com", "wrongpassword");

        // Act
        ResponseEntity<JWTResponse> responseEntity = null;
        try {
            responseEntity = userInfoController.login(loginDTO);
        } catch (RuntimeException e) {
            // Assert
            assertEquals("Authentication failed", e.getMessage());
        }
    }
}
