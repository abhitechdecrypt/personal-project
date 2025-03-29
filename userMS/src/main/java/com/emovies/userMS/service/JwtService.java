package com.emovies.userMS.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;


@Component
public class JwtService {

	public static final String SECRET_KEY = "Q41VGXMTCWU4FLU0NVHOJBX3SVHVCJJAS9R12ZWD93LHGQV9TYTSKJMFZASXREOJTIORAVWBG3Q58TUFCEW";

	public void validateToken(final String token) {
		Jwts.parserBuilder().setSigningKey(getSignedkey()).build().parseClaimsJws(token);
	}

	public String generateToken(String username) {
		HashMap<String, Object> claims = new HashMap<>();
		return createToken(claims, username);
	}

	public String createToken(Map<String, Object> claims, String userName) {
		return Jwts.builder()
				.setClaims(claims)
				.setSubject(userName)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
				.signWith(getSignedkey(), SignatureAlgorithm.HS512).compact();

	}

	public Key getSignedkey() {
		byte[] decode = Decoders.BASE64.decode(SECRET_KEY);
		return Keys.hmacShaKeyFor(decode);
	}

}
