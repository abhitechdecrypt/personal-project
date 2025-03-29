package com.emovies.userMS.repository;

import com.emovies.userMS.Entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, String> {
    UserInfo findByEmail(String email);

    UserInfo findByPhoneNumber(String phoneNumber);
}
