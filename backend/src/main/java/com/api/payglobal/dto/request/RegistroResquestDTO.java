package com.api.payglobal.dto.request;

import lombok.Data;

@Data
public class RegistroResquestDTO {
    private String username;
    private String password;
    private String email;
    private String referenciado;
}
