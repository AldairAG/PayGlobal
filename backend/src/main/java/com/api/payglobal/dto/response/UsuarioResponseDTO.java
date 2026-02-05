package com.api.payglobal.dto.response;

import java.util.Date;
import java.util.List;

import com.api.payglobal.entity.Bono;
import com.api.payglobal.entity.Licencia;
import com.api.payglobal.entity.Wallet;

import lombok.Data;

@Data
public class UsuarioResponseDTO {
    private Long id;

    private String username;
    private String correo;
    private Date fechaRegistro;
    private boolean activo;
    private Integer rango;
    private String walletAddress;

    private String nombre;
    private String apellido;
    private String telefono;
    private String pais;

    private String referenciado;

    private List<Bono> bonos;

    private List<Wallet> wallets;

    private Licencia licencia;
}
