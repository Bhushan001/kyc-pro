package com.ekyc.authservice.util;

import com.ekyc.authservice.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;

@Component
public class JwtUtil {
  @Value("${jwt.secret:secret}")
  private String secret;
  @Value("${jwt.expiration:86400}")
  private Long expiration;

  private SecretKey getSigningKey() { return Keys.hmacShaKeyFor(secret.getBytes()); }

  public String generateToken(User user) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("userId", user.getId().toString());
    claims.put("email", user.getEmail());
    claims.put("role", user.getRole());
    claims.put("tenantId", user.getTenantId() != null ? user.getTenantId().toString() : null);
    return Jwts.builder().claims(claims).subject(user.getEmail())
      .issuedAt(new Date(System.currentTimeMillis()))
      .expiration(new Date(System.currentTimeMillis() + expiration*1000))
      .signWith(getSigningKey()).compact();
  }

  public boolean validateToken(String token) {
    try { 
      Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token); 
      return true; 
    }
    catch (Exception e) { 
      return false; 
    }
  }

  public String getEmailFromToken(String token) {
    return getAllClaimsFromToken(token).getSubject();
  }
  
  public Claims getAllClaimsFromToken(String token) {
    return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
  }
}
