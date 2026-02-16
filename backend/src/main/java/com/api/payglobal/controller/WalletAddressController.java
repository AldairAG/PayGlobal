package com.api.payglobal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.payglobal.dto.request.CreateWalletAddress;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.entity.WalletAddress;
import com.api.payglobal.helpers.ApiResponseWrapper;
import com.api.payglobal.service.walletAddresses.walletAddressesService;

@RestController
@RequestMapping("/api/wallet-addresses")
public class WalletAddressController {
    
    @Autowired
    private walletAddressesService walletAddressesService;

    /**
     * Crear una nueva dirección de wallet
     */
    @PostMapping
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<WalletAddress>> createWalletAddress(
            @RequestBody CreateWalletAddress walletAddress,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            WalletAddress createdWallet = walletAddressesService.createWalletAddress(walletAddress, usuario.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponseWrapper<>(true, createdWallet, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Obtener una dirección de wallet por ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<WalletAddress>> getWalletAddressById(@PathVariable Long id) {
        try {
            WalletAddress walletAddress = walletAddressesService.getWalletAddressById(id);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, walletAddress, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Actualizar una dirección de wallet
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<WalletAddress>> updateWalletAddress(
            @PathVariable Long id,
            @RequestBody CreateWalletAddress walletAddress) {
        try {
            WalletAddress updatedWallet = walletAddressesService.updateWalletAddress(id, walletAddress);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, updatedWallet, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Eliminar una dirección de wallet
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<Void>> deleteWalletAddress(@PathVariable Long id) {
        try {
            walletAddressesService.deleteWalletAddress(id);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, null, "Wallet address eliminada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Obtener todas las direcciones de wallet del usuario autenticado
     */
    @GetMapping("/mis-wallets")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<List<WalletAddress>>> getMyWalletAddresses(
            @AuthenticationPrincipal Usuario usuario) {
        try {
            List<WalletAddress> walletAddresses = walletAddressesService.getAllWalletAddressesByUserId(usuario.getId());
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, walletAddresses, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Obtener todas las direcciones de wallet de un usuario específico (USUARIO)
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<List<WalletAddress>>> getWalletAddressesByUserId(
            @PathVariable Long userId) {
        try {
            List<WalletAddress> walletAddresses = walletAddressesService.getAllWalletAddressesByUserId(userId);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, walletAddresses, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

}
