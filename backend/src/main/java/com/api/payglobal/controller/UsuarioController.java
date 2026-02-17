package com.api.payglobal.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.api.payglobal.dto.request.CambiarPasswordRequest;
import com.api.payglobal.dto.request.EditarPerfilRequest;
import com.api.payglobal.dto.request.LoginRequest;
import com.api.payglobal.dto.request.RegistroResquestDTO;
import com.api.payglobal.dto.response.JwtResponse;
import com.api.payglobal.dto.response.UsuarioEnRedResponse;
import com.api.payglobal.dto.response.UsuarioExplorerResponseDTO;
import com.api.payglobal.entity.Solicitud;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.entity.enums.TipoCrypto;
import com.api.payglobal.entity.enums.TipoLicencia;
import com.api.payglobal.entity.enums.TipoMetodoPago;
import com.api.payglobal.entity.enums.TipoSolicitud;
import com.api.payglobal.entity.enums.TipoWallets;
import com.api.payglobal.helpers.ApiResponseWrapper;
import com.api.payglobal.service.usuario.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Registro de nuevo usuario
     */
    @PostMapping("/registro")
    public ResponseEntity<ApiResponseWrapper<JwtResponse>> registrar(@RequestBody RegistroResquestDTO registroRequest) {
        try {
            JwtResponse response = usuarioService.registrar(registroRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseWrapper<>(true, response, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Login de usuario
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponseWrapper<JwtResponse>> login(@RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse response = usuarioService.login(loginRequest);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, response, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Editar perfil del usuario autenticado
     */
    @PutMapping("/perfil")
    @PreAuthorize("hasRole('USER') and #usuario.id == authentication.principal.id")
    public ResponseEntity<ApiResponseWrapper<Usuario>> editarPerfil(
            @RequestBody EditarPerfilRequest editarPerfilRequest,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            Usuario usuarioActualizado = usuarioService.editarPerfilUsuario(editarPerfilRequest, usuario.getId());
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, usuarioActualizado, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Cambiar contraseña del usuario autenticado
     */
    @PatchMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(
            @RequestBody CambiarPasswordRequest cambiarPasswordRequest,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            usuarioService.cambiarPasswordUsuario(cambiarPasswordRequest, usuario.getId());
            return ResponseEntity.ok("Contraseña actualizada correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Verificación de dos pasos
     */
    @PostMapping("/verificacion-dos-pasos")
    public ResponseEntity<?> verificacionDosPasos(
            @RequestParam String codigoVerificacion,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            usuarioService.verificacionDosPasos(codigoVerificacion, usuario.getId());
            return ResponseEntity.ok("Verificación exitosa");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Obtener usuarios en red
     */
    @GetMapping("/red/{username}")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<List<UsuarioEnRedResponse>>> obtenerUsuariosEnRed(
            @PathVariable String username) {
        try {
            List<UsuarioEnRedResponse> usuariosEnRed = usuarioService.obtenerUsuariosEnRed(username);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, usuariosEnRed, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Editar usuario (Admin)
     */
    @PutMapping("/admin/editar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseWrapper<String>> editarUsuario(@RequestBody Usuario usuario) {
        try {
            usuarioService.editarUsuario(usuario);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Usuario actualizado correctamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Solicitar compra de licencia
     */
    @PostMapping("/solicitar-licencia")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<String>> solicitarCompraLicencia(
            @RequestParam TipoCrypto tipoCrypto,
            @RequestParam TipoLicencia tipoLicencia,
            @RequestParam TipoSolicitud tipoSolicitud,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            usuarioService.solicitarCompraLicencia(tipoCrypto, tipoLicencia, tipoSolicitud, usuario.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponseWrapper<>(true, "Solicitud de licencia creada correctamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Verificar rol del usuario autenticado
     */
    @GetMapping("/verificar-rol")
    public ResponseEntity<ApiResponseWrapper<String>> verificarRol(@AuthenticationPrincipal Usuario usuario) {
        try {
            String rol = usuario.getRol().name();
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, rol, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Solicitar retiro de fondos
     */
    @PostMapping("/solicitar-retiro")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<String>> solicitarRetiroFondos(
            @RequestParam Long walletAddressId,
            @RequestParam BigDecimal monto,
            @RequestParam TipoSolicitud tipoSolicitud,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            usuarioService.solicitarRetiroFondos(walletAddressId, monto, tipoSolicitud, usuario.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponseWrapper<>(true, "Solicitud de retiro creada correctamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Comprar licencia delegada (para otro usuario)
     */
    @PostMapping("/comprar-licencia-delegada")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponseWrapper<String>> comprarLicenciaDelegada(
            @RequestParam TipoLicencia tipoLicencia,
            @RequestParam String destinatario,
            @RequestParam TipoMetodoPago tipoMetodoPago,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            usuarioService.comprarLicenciaDelegada(tipoLicencia, destinatario, tipoMetodoPago, usuario.getId());
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Licencia delegada comprada correctamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Transferencia entre usuarios
     */
    @PostMapping("/transferencia")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponseWrapper<String>> transferenciaEntreUsuarios(
            @RequestParam String usuarioDestinatario,
            @RequestParam BigDecimal monto,
            @RequestParam TipoWallets tipoWallet,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            usuarioService.TransferenciaEntreUsuarios(usuarioDestinatario, monto, tipoWallet, usuario.getId());
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Transferencia realizada correctamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Aprobar compra de licencia (Admin)
     */
    @PutMapping("/admin/aprobar-licencia/{idSolicitud}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponseWrapper<String>> aprobarCompraLicencia(@PathVariable Long idSolicitud) {
        try {
            usuarioService.aprobarCompraLicencia(idSolicitud);
            return ResponseEntity
                    .ok(new ApiResponseWrapper<>(true, "Solicitud de licencia aprobada correctamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Rechazar solicitud (Admin)
     */
    @PutMapping("/admin/rechazar-solicitud/{idSolicitud}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponseWrapper<String>> rechazarSolicitud(@PathVariable Long idSolicitud) {
        try {
            usuarioService.rechazarSolcitud(idSolicitud);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Solicitud rechazada correctamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /*
     * Obtener solicitudes pendientes (Admin)
     */
    @GetMapping("/admin/solicitudes")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponseWrapper<Page<Solicitud>>> obtenerSolicitudes(Pageable pageable) {
        try {
            Page<Solicitud> solicitudesPendientes = usuarioService.obtenerSolicitudes(pageable);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, solicitudesPendientes,
                    "Solicitudes pendientes obtenidas correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Obtener solicitudes filtradas por uno o más tipos (Admin)
     * Permite filtrar solicitudes por COMPRA_LICENCIA, SOLICITUD_RETIRO_WALLET_DIVIDENDOS,
     * SOLICITUD_RETIRO_WALLET_COMISIONES, TRANFERENCIA_USUARIO, PAGO_DELEGADO
     */
    @GetMapping("/admin/solicitudes/por-tipos")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<Page<Solicitud>>> obtenerSolicitudesPorTipos(
            @RequestParam List<TipoSolicitud> tipos,
            Pageable pageable) {
        try {
            Page<Solicitud> solicitudes = usuarioService.obtenerSolicitudesPorTipos(tipos, pageable);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, solicitudes,
                    "Solicitudes obtenidas correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    

    /**
     * Obtener todos los usuarios con filtro de búsqueda (Admin)
     * Permite buscar por username, email, nombre o apellido
     */
    @GetMapping("/admin/usuarios")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponseWrapper<Page<UsuarioExplorerResponseDTO>>> obtenerTodosLosUsuarios(
            @RequestParam(required = false) String filtro,
            Pageable pageable) {
        try {
            Page<UsuarioExplorerResponseDTO> usuarios = usuarioService.obtenerTodosLosUsuarios(filtro, pageable);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, usuarios,
                    "Usuarios obtenidos correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Obtener usuario por ID (Admin)
     */
    @GetMapping("/admin/usuario/{idUsuario}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponseWrapper<Usuario>> obtenerUsuarioPorId(@PathVariable Long idUsuario) {
        try {
            Usuario usuario = usuarioService.obtenerUsuarioPorId(idUsuario);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, usuario, "Usuario obtenido correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

}
