package com.api.payglobal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.payglobal.entity.Wallet;
import com.api.payglobal.entity.enums.TipoWallets;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    List<Wallet> findByUsuario_Username(String username);
    List<Wallet> findByUsuario_UsernameIn(List<String> usernames);
    List<Wallet> findByTipo(String walletType);
    Optional<Wallet> findByUsuarioIdAndTipo(Long usuarioId, TipoWallets tipo);
}
