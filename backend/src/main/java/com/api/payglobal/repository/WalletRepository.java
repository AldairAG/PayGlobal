package com.api.payglobal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.payglobal.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    List<Wallet> findByUsuario_Username(String username);
    List<Wallet> findByUsuario_UsernameIn(List<String> usernames);
    List<Wallet> findByTipo(String walletType);
}
