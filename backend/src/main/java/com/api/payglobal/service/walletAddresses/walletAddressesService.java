package com.api.payglobal.service.walletAddresses;

import java.math.BigDecimal;
import java.util.List;

import com.api.payglobal.dto.request.CreateWalletAddress;
import com.api.payglobal.entity.WalletAddress;

public interface walletAddressesService {
    WalletAddress createWalletAddress(CreateWalletAddress walletAddress, Long userId) throws Exception;
    WalletAddress getWalletAddressById(Long id) throws Exception;
    WalletAddress updateWalletAddress(Long id, CreateWalletAddress walletAddress) throws Exception;
    void deleteWalletAddress(Long id) throws Exception;
    List<WalletAddress> getAllWalletAddressesByUserId(Long userId) throws Exception;
    WalletAddress aumentarTotalRetirado(Long addressId, BigDecimal monto) throws Exception;
}
