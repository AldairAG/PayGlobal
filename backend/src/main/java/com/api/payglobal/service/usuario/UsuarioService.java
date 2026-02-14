package com.api.payglobal.service.usuario;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;

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

public interface UsuarioService extends UserDetailsService {
        JwtResponse registrar(RegistroResquestDTO registroRequest) throws Exception;

        JwtResponse login(LoginRequest loginRequest) throws Exception;

        Usuario editarPerfilUsuario(EditarPerfilRequest editarPerfilRequest, Long idUsuario) throws Exception;

        void cambiarPasswordUsuario(CambiarPasswordRequest cambiarPasswordRequest, Long idUsuario) throws Exception;

        void verificacionDosPasos(String codigoVerificacion, Long idUsuario) throws Exception;

        List<UsuarioEnRedResponse> obtenerUsuariosEnRed(String username) throws Exception;

        void editarUsuario(Usuario usuario) throws Exception;

        void solicitarCompraLicencia(TipoCrypto tipoCrypto, TipoLicencia tipoLicencia, TipoSolicitud tipoSolicitud,
                        Long idUsuario) throws Exception;

        void solicitarRetiroFondos(Long walletAddressId, BigDecimal monto, TipoSolicitud tipoSolicitud, Long idUsuario)
                        throws Exception;

        void comprarLicenciaDelegada(TipoLicencia tipoLicencia, String destinatario, TipoMetodoPago tipoMetodoPago,
                        Long idUsuario) throws Exception;

        void TransferenciaEntreUsuarios(String usuarioDestinatario, BigDecimal monto, TipoWallets tipoWallet,
                        Long idUsuario) throws Exception;

        void aprobarCompraLicencia(Long idSolicitud) throws Exception;

        void rechazarSolcitud(Long idSolicitud) throws Exception;

        Page<Solicitud> obtenerSolicitudes(Pageable pageable) throws Exception;

        Page<UsuarioExplorerResponseDTO> obtenerTodosLosUsuarios(String filtro, Pageable pageable) throws Exception;

        Usuario obtenerUsuarioPorId(Long idUsuario) throws Exception;
}