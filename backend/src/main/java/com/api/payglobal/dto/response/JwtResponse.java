package com.api.payglobal.dto.response;

import com.api.payglobal.entity.Usuario;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
    
    private String token;
    
    private String type = "Bearer";
    
    private Long id;
    
    private String username;
    
    private String email;

    private Usuario user;

    private Integer usuarioEnRed;

    public JwtResponse(String token, Long id, String username, String email, Usuario user, Integer ususarioEnRed) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.user = user;
        this.usuarioEnRed = ususarioEnRed;
    }
}
