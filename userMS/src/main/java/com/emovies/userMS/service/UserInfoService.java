package com.emovies.userMS.service;

import com.emovies.userMS.DAO.UserLoginDTO;
import com.emovies.userMS.Entity.UserInfo;

public interface UserInfoService {
    UserInfo registerUser(UserInfo userInfo);

    UserInfo loginUser(UserLoginDTO uSerLoginDTO);
    boolean deleteUser(String userId);

    UserInfo findUser(String userId);

    UserInfo updateUser(UserInfo userInfo, String userId);
}
