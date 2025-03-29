package com.emovies.userMS.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.emovies.userMS.DAO.UserLoginDTO;
import com.emovies.userMS.Entity.JWTResponse;
import com.emovies.userMS.Entity.UserInfo;
import com.emovies.userMS.config.JWTHelper;
import com.emovies.userMS.exception.UserAlreadyExistException;
import com.emovies.userMS.repository.UserInfoRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserInfoServiceImpl implements UserInfoService {

	private final UserInfoRepository userInfoRepository;
	private final PasswordEncoder passwordEncoder;

	@Autowired
	private JWTHelper jwtHelper;

	public UserInfoServiceImpl(UserInfoRepository userInfoRepository, PasswordEncoder passwordEncoder) {
		this.userInfoRepository = userInfoRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public UserInfo registerUser(UserInfo userInfo) {
		Random random = new Random();

		UserInfo existingUserByEmail = userInfoRepository.findByEmail(userInfo.getEmail());
		UserInfo existingUserByPhoneNumber = userInfoRepository.findByPhoneNumber(userInfo.getPhoneNumber());

		if (existingUserByEmail != null || existingUserByPhoneNumber != null) {
			throw new UserAlreadyExistException("Email Id or Phone number already registered with us",
					String.valueOf(HttpStatus.CONFLICT.value()));
		}

		long userIdNumber = 1000000000L + (long) (random.nextDouble() * 9000000000L);
		String userPrefix = "USER" + userIdNumber;
		userInfo.setUserID(userPrefix);

		userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));

		return userInfoRepository.save(userInfo);
	}

	@Override
	public UserInfo loginUser(UserLoginDTO userLoginDTO) {
		UserInfo userInfo = null;

		try {
			if (userLoginDTO.getEmail() != null) {
				userInfo = userInfoRepository.findByEmail(userLoginDTO.getEmail());
			} else if (userLoginDTO.getPhoneNumber() != null) {
				userInfo = userInfoRepository.findByPhoneNumber(userLoginDTO.getPhoneNumber());
			}

			if (userInfo != null && passwordEncoder.matches(userLoginDTO.getPassword(), userInfo.getPassword())) {
				return userInfo;
			} else {
				log.warn("Failed login attempt for user: " + userLoginDTO.getEmail() + " or phone number: "
						+ userLoginDTO.getPhoneNumber());
			}
		} catch (Exception e) {
			// Log exception details
			log.error("Error during login attempt", e);
			throw new RuntimeException("Login failed due to a system error");
		}

		return null;
	}

	public JWTResponse userLogin(UserDetails userDetails, String email) {
		UserInfo userData = userInfoRepository.findByEmail(email);
		String token = this.jwtHelper.generateToken(userDetails, userData);
		System.out.println("UserName ::" + userDetails.getUsername());
		JWTResponse response = JWTResponse.builder().token(token).isValid(true).time(LocalDateTime.now()).build();

		return response;
	}


	@Override
	public boolean deleteUser(String userId) {
		return false;
	}

	@Override
	public UserInfo findUser(String userId) {
		return null;
	}

	@Override
	public UserInfo updateUser(UserInfo userInfo, String userId) {
		return null;
	}

}
