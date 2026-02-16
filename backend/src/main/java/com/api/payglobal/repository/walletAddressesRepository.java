package com.api.payglobal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.payglobal.entity.WalletAddress;

public interface walletAddressesRepository extends JpaRepository<WalletAddress, Long> {

    List<WalletAddress> findByUsuario_Id(Long userId);

}
