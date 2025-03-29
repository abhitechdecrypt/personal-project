package com.emovies.userMS.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.emovies.userMS.Entity.UserInfo;
import com.emovies.userMS.repository.UserInfoRepository;

@Service
public class CustomUserDetailsServices implements UserDetailsService {

	@Autowired
	private UserInfoRepository repository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserInfo userDetails = repository.findByEmail(username);
		return userDetails;
	}

}
