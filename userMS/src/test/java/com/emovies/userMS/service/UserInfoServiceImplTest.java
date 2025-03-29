package com.emovies.userMS.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.emovies.userMS.DAO.UserLoginDTO;
import com.emovies.userMS.Entity.JWTResponse;
import com.emovies.userMS.Entity.UserInfo;
import com.emovies.userMS.config.JWTHelper;
import com.emovies.userMS.exception.UserAlreadyExistException;
import com.emovies.userMS.repository.UserInfoRepository;

class UserInfoServiceImplTest {

    @Mock
    private UserInfoRepository userInfoRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JWTHelper jwtHelper;

    @InjectMocks
    private UserInfoServiceImpl userInfoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(userInfoService, "jwtHelper", jwtHelper);
    }

    @Test
    void testRegisterUser_Success() {
        // Arrange
        UserInfo userInfo = new UserInfo();
        userInfo.setEmail("test@example.com");
        userInfo.setPhoneNumber("1234567890");
        userInfo.setPassword("password");

        when(userInfoRepository.findByEmail("test@example.com")).thenReturn(null);
        when(userInfoRepository.findByPhoneNumber("1234567890")).thenReturn(null);
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userInfoRepository.save(any(UserInfo.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        UserInfo registeredUser = userInfoService.registerUser(userInfo);

        // Assert
        assertNotNull(registeredUser);
        assertEquals("encodedPassword", registeredUser.getPassword());
        verify(userInfoRepository, times(1)).save(userInfo);
    }

    @Test
    void testRegisterUser_EmailOrPhoneAlreadyExists() {
        // Arrange
        UserInfo userInfo = new UserInfo();
        userInfo.setEmail("test@example.com");
        userInfo.setPhoneNumber("1234567890");

        when(userInfoRepository.findByEmail("test@example.com")).thenReturn(new UserInfo());

        // Act & Assert
        assertThrows(UserAlreadyExistException.class, () -> userInfoService.registerUser(userInfo));
        verify(userInfoRepository, never()).save(any(UserInfo.class));
    }

    @Test
    void testLoginUser_Success() {
        // Arrange
        UserLoginDTO userLoginDTO = new UserLoginDTO();
        userLoginDTO.setEmail("test@example.com");
        userLoginDTO.setPassword("password");

        UserInfo userInfo = new UserInfo();
        userInfo.setPassword("encodedPassword");

        when(userInfoRepository.findByEmail("test@example.com")).thenReturn(userInfo);
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);

        // Act
        UserInfo loggedInUser = userInfoService.loginUser(userLoginDTO);

        // Assert
        assertNotNull(loggedInUser);
        verify(userInfoRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testLoginUser_Failure() {
        // Arrange
        UserLoginDTO userLoginDTO = new UserLoginDTO();
        userLoginDTO.setEmail("test@example.com");
        userLoginDTO.setPassword("wrongPassword");

        UserInfo userInfo = new UserInfo();
        userInfo.setPassword("encodedPassword");

        when(userInfoRepository.findByEmail("test@example.com")).thenReturn(userInfo);
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        // Act
        UserInfo loggedInUser = userInfoService.loginUser(userLoginDTO);

        // Assert
        assertNull(loggedInUser);
        verify(userInfoRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testUserLogin_Success() {
        // Arrange
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("testUser");

        UserInfo userInfo = new UserInfo();
        userInfo.setEmail("test@example.com");

        when(userInfoRepository.findByEmail("test@example.com")).thenReturn(userInfo);
        when(jwtHelper.generateToken(userDetails, userInfo)).thenReturn("jwtToken");

        // Act
        JWTResponse jwtResponse = userInfoService.userLogin(userDetails, "test@example.com");

        // Assert
        assertNotNull(jwtResponse);
        assertEquals("jwtToken", jwtResponse.getToken());
        assertTrue(jwtResponse.isValid());
        verify(userInfoRepository, times(1)).findByEmail("test@example.com");
    }


}
