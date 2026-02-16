package com.api.payglobal.service.walletAddresses;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.payglobal.dto.request.CreateWalletAddress;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.entity.WalletAddress;
import com.api.payglobal.repository.UsuarioRepository;
import com.api.payglobal.repository.walletAddressesRepository;

@Service
public class walletAddressesImpl implements walletAddressesService {

    @Autowired
    private walletAddressesRepository walletAddressesRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public WalletAddress createWalletAddress(CreateWalletAddress walletAddress, Long userId) {
        Usuario usuario = usuarioRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        WalletAddress newWalletAddress = WalletAddress.builder()
            .address(walletAddress.getAddress())
            .tipoCrypto(walletAddress.getTipoCrypto())
            .nombre(walletAddress.getNombre())
            .balanceRetirado(BigDecimal.ZERO)
            .usuario(usuario)
            .build();

        return walletAddressesRepository.save(newWalletAddress);
    }

    @Override
    @Transactional(readOnly = true) 
    public WalletAddress getWalletAddressById(Long id) {
        return walletAddressesRepository.findById(id).orElseThrow(() -> new RuntimeException("WalletAddress no encontrado"));
    }

    @Override
    @Transactional
    public WalletAddress updateWalletAddress(Long id, CreateWalletAddress walletAddress) {
        WalletAddress existingWalletAddress = walletAddressesRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("WalletAddress no encontrado"));

        existingWalletAddress.setAddress(walletAddress.getAddress());
        existingWalletAddress.setTipoCrypto(walletAddress.getTipoCrypto());
        existingWalletAddress.setNombre(walletAddress.getNombre());

        return walletAddressesRepository.save(existingWalletAddress);
    }

    @Override
    @Transactional
    public void deleteWalletAddress(Long id) {
        WalletAddress existingWalletAddress = walletAddressesRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("WalletAddress no encontrado"));

        walletAddressesRepository.delete(existingWalletAddress);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WalletAddress> getAllWalletAddressesByUserId(Long userId) {
        Usuario usuario = usuarioRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return walletAddressesRepository.findByUsuario_Id(usuario.getId());
    }

    @Override
    public WalletAddress aumentarTotalRetirado(Long addressId, BigDecimal monto) throws Exception {
        WalletAddress walletAddress = walletAddressesRepository.findById(addressId)
            .orElseThrow(() -> new RuntimeException("WalletAddress no encontrado"));

        walletAddress.setBalanceRetirado(walletAddress.getBalanceRetirado().add(monto));
        walletAddressesRepository.save(walletAddress);
        return walletAddress;
    }
    
}
