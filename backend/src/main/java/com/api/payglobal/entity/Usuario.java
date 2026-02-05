package com.api.payglobal.entity;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.api.payglobal.entity.enums.RolesUsuario;
import com.api.payglobal.entity.enums.TipoRango;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data 
@Table(name = "usuarios", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_referenciado", columnList = "referenciado")
})
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, name = "username")
    private String username;
    @Column(nullable = false)
    private String password;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private Date fechaRegistro;
    private boolean activo;
    private TipoRango rango;

    private RolesUsuario rol;
    private Boolean verificado;

    private String nombre;
    private String apellido;
    private String telefono;
    private String pais;

    private String referenciado;

    @OneToMany(mappedBy = "usuario")
    @JsonManagedReference
    private List<Bono> bonos;

    @OneToMany(mappedBy = "usuario")
    @JsonManagedReference
    private List<Transaccion> transacciones;

    @OneToMany(mappedBy = "usuario")
    @JsonManagedReference
    private List<Wallet> wallets;

    @OneToOne(mappedBy = "usuario")
    @JsonManagedReference
    private Licencia licencia;
    
    @OneToMany(mappedBy = "usuario")
    @JsonManagedReference
    private List<TiketSoporte> tiketsSoporte;

    @OneToMany(mappedBy = "usuario")
    @JsonManagedReference
    private List<WalletAddress> walletAddresses;

    @OneToMany(mappedBy = "usuario")
    @JsonManagedReference
    private List<Solicitud> solicitudes;


    public void addSolicitud(Solicitud solicitud) {
        this.solicitudes.add(solicitud);
    }


    // UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return username;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return activo;
    }


}
