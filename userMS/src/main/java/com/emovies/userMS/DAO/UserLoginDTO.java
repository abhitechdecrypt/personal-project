package com.emovies.userMS.DAO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDTO {

    private String email;
    private String password;
    private String phoneNumber;
}
