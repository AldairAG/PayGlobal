package com.api.payglobal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.payglobal.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    List<Wallet> findByUserUsername(String username);
    List<Wallet> findByUserUsernameIn(List<String> usernames);
    List<Wallet> findByWalletType(String walletType);
}
