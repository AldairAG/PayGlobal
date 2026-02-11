package com.api.payglobal.service.usuario;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.payglobal.dto.request.CambiarPasswordRequest;
import com.api.payglobal.dto.request.EditarPerfilRequest;
import com.api.payglobal.dto.request.LoginRequest;
import com.api.payglobal.dto.request.RegistroResquestDTO;
import com.api.payglobal.dto.response.JwtResponse;
import com.api.payglobal.dto.response.UsuarioEnRedResponse;
import com.api.payglobal.entity.Licencia;
import com.api.payglobal.entity.Solicitud;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.entity.Wallet;
import com.api.payglobal.entity.WalletAddress;
import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.entity.enums.RolesUsuario;
import com.api.payglobal.entity.enums.TipoConceptos;
import com.api.payglobal.entity.enums.TipoCrypto;
import com.api.payglobal.entity.enums.TipoLicencia;
import com.api.payglobal.entity.enums.TipoMetodoPago;
import com.api.payglobal.entity.enums.TipoRango;
import com.api.payglobal.entity.enums.TipoSolicitud;
import com.api.payglobal.entity.enums.TipoWallets;
import com.api.payglobal.helpers.JwtHelper;
import com.api.payglobal.helpers.UninivelHelper;
import com.api.payglobal.repository.SolicitudRepository;
import com.api.payglobal.repository.UsuarioRepository;
import com.api.payglobal.service.bono.BonoService;
import com.api.payglobal.service.transaccion.TransaccionService;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private UninivelHelper uninivelHelper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Lazy
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BonoService bonoService;

    @Autowired
    private TransaccionService transaccionService;

    @Transactional
    public JwtResponse registrar(RegistroResquestDTO registroRequest) {

        if (usuarioRepository.existsByUsername(registroRequest.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }

        if (usuarioRepository.existsByEmail(registroRequest.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        Usuario usuario = RegistroResquestDTOToUsuario(registroRequest);
        Usuario nuevoUsuario = usuarioRepository.save(usuario);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(nuevoUsuario.getUsername());
        loginRequest.setPassword(registroRequest.getPassword());

        return login(loginRequest);

    }

    @Transactional
    public JwtResponse login(LoginRequest loginRequest) {
        try {
            usuarioRepository.findByUsernameOrEmailForLogin(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con username o email: " + loginRequest.getUsername()));

            // Autenticar usuario
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            // Obtener usuario autenticado
            Usuario usuario = (Usuario) authentication.getPrincipal();

            // Generar token JWT
            String token = jwtHelper.generateToken(usuario);

            // Crear respuesta
            return new JwtResponse(
                    token,
                    usuario.getId(),
                    usuario.getUsername(),
                    usuario.getEmail(),
                    usuario);

        } catch (AuthenticationException e) {
            throw new RuntimeException("Ocurrió un error durante la autenticación: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByUsernameOrEmailForLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }

    private Usuario RegistroResquestDTOToUsuario(RegistroResquestDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setUsername(dto.getUsername());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setEmail(dto.getEmail());
        usuario.setReferenciado(dto.getReferenciado());
        usuario.setFechaRegistro(new Date());
        usuario.setActivo(true);
        usuario.setRol(RolesUsuario.USUARIO);
        usuario.setRango(TipoRango.RANGO_0);
        return usuario;
    }

    @Override
    @Transactional
    public Usuario editarPerfilUsuario(EditarPerfilRequest editarPerfilRequest, Long idUsuario) throws Exception {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new Exception("Usuario no encontrado con id: " + idUsuario));

        usuario.setNombre(editarPerfilRequest.getNombre());
        usuario.setApellido(editarPerfilRequest.getApellido());
        usuario.setTelefono(editarPerfilRequest.getTelefono());
        usuario.setPais(editarPerfilRequest.getPais());
        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void cambiarPasswordUsuario(CambiarPasswordRequest cambiarPasswordRequest, Long idUsuario) throws Exception {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new Exception("Usuario no encontrado con id: " + idUsuario));

    }

    @Override
    public void verificacionDosPasos(String codigoVerificacion, Long idUsuario) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'verificacionDosPasos'");
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioEnRedResponse> obtenerUsuariosEnRed(String username) throws Exception {
        return uninivelHelper.mapearAUsuarioEnRedResponse(
                uninivelHelper.obtenerRedDeUsuario(username));
    }

    /**
     * Metodo creado para editar usuario desde el admin
     */
    @Override
    @Transactional
    public void editarUsuario(Usuario usuario) throws Exception {
        Usuario usuarioExistente = usuarioRepository.findById(usuario.getId())
                .orElseThrow(() -> new Exception("Usuario no encontrado con id: " + usuario.getId()));

        // Actualizar campos básicos
        if (usuario.getUsername() != null) {
            usuarioExistente.setUsername(usuario.getUsername());
        }
        if (usuario.getEmail() != null) {
            usuarioExistente.setEmail(usuario.getEmail());
        }
        if (usuario.getNombre() != null) {
            usuarioExistente.setNombre(usuario.getNombre());
        }
        if (usuario.getApellido() != null) {
            usuarioExistente.setApellido(usuario.getApellido());
        }
        if (usuario.getTelefono() != null) {
            usuarioExistente.setTelefono(usuario.getTelefono());
        }
        if (usuario.getPais() != null) {
            usuarioExistente.setPais(usuario.getPais());
        }

        // Actualizar password solo si se proporciona uno nuevo
        if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
            usuarioExistente.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }

        // Actualizar rol
        if (usuario.getRol() != null) {
            usuarioExistente.setRol(usuario.getRol());
        }

        // Actualizar estado activo
        usuarioExistente.setActivo(usuario.isActivo());

        // Actualizar referenciado
        if (usuario.getReferenciado() != null) {
            usuarioExistente.setReferenciado(usuario.getReferenciado());
        }

        usuarioRepository.save(usuarioExistente);
    }

    @Override
    @Transactional
    public void solicitarCompraLicencia(TipoCrypto tipoCrypto, TipoLicencia tipoLicencia, TipoSolicitud tipoSolicitud,
            Long idUsuario) throws Exception {

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new Exception("Usuario no encontrado con id: " + idUsuario));

        Solicitud solicitud = Solicitud.builder()
                .tipoSolicitud(tipoSolicitud)
                .monto(new BigDecimal(tipoLicencia.getValor()))
                .usuario(usuario)
                .fecha(LocalDateTime.now())
                .tipoCrypto(tipoCrypto)
                .build();

        usuario.addSolicitud(solicitud);

        usuarioRepository.save(usuario);
    }

    @Override
    public void solicitarRetiroFondos(Long walletAddressId, BigDecimal monto, TipoSolicitud tipoSolicitud,
            Long idUsuario) throws Exception {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new Exception("Usuario no encontrado con id: " + idUsuario));

        WalletAddress walletAddress = usuario.getWalletAddresses().stream()
                .filter(wa -> wa.getId().equals(walletAddressId))
                .findFirst()
                .orElseThrow(() -> new Exception("Wallet Address no encontrado con id: " + walletAddressId));

        if (tipoSolicitud == TipoSolicitud.SOLICITUD_RETIRO_WALLET_DIVIDENDOS) {
            Wallet walletDividendo = usuario.getWallets().stream()
                    .filter(w -> w.getTipo().equals(TipoWallets.WALLET_DIVIDENDOS))
                    .findFirst()
                    .orElseThrow(() -> new Exception(
                            "Wallet de dividendos no encontrada para el usuario con id: " + idUsuario));
            if (walletDividendo.getSaldo().compareTo(monto) < 0) {
                throw new Exception("Fondos insuficientes en la wallet de dividendos");
            }
        }

        if (tipoSolicitud == TipoSolicitud.SOLICITUD_RETIRO_WALLET_COMISIONES) {
            Wallet walletComisiones = usuario.getWallets().stream()
                    .filter(w -> w.getTipo().equals(TipoWallets.WALLET_COMISIONES))
                    .findFirst()
                    .orElseThrow(() -> new Exception(
                            "Wallet de comisiones no encontrada para el usuario con id: " + idUsuario));
            if (walletComisiones.getSaldo().compareTo(monto) < 0) {
                throw new Exception("Fondos insuficientes en la wallet de comisiones");
            }

        }

        Solicitud solicitud = Solicitud.builder()
                .tipoSolicitud(tipoSolicitud)
                .monto(monto)
                .usuario(usuario)
                .fecha(LocalDateTime.now())
                .walletAddress(walletAddress.getAddress())
                .build();

        usuario.addSolicitud(solicitud);

        usuarioRepository.save(usuario);
    }

    @Override
    public void comprarLicenciaDelegada(TipoLicencia tipoLicencia, String destinatario, TipoMetodoPago tipoMetodoPago,
            Long idUsuario) throws Exception {

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new Exception("Usuario no encontrado con id: " + idUsuario));

        Usuario usuarioDestinatario = usuarioRepository.findByUsername(destinatario)
                .orElseThrow(() -> new Exception("Usuario destinatario no encontrado con username: " + destinatario));

        if (tipoMetodoPago == TipoMetodoPago.WALLET_COMISIONES) {
            Wallet walletComisiones = usuario.getWallets().stream()
                    .filter(w -> w.getTipo().equals(TipoWallets.WALLET_COMISIONES))
                    .findFirst()
                    .orElseThrow(() -> new Exception(
                            "Wallet de comisiones no encontrada para el usuario con id: " + idUsuario));
            if (walletComisiones.getSaldo().compareTo(new BigDecimal(tipoLicencia.getValor())) < 0) {
                throw new Exception("Fondos insuficientes en la wallet de comisiones");
            }
        }

        if (tipoMetodoPago == TipoMetodoPago.WALLET_DIVIDENDOS) {
            Wallet walletDividendo = usuario.getWallets().stream()
                    .filter(w -> w.getTipo().equals(TipoWallets.WALLET_DIVIDENDOS))
                    .findFirst()
                    .orElseThrow(() -> new Exception(
                            "Wallet de dividendos no encontrada para el usuario con id: " + idUsuario));
            if (walletDividendo.getSaldo().compareTo(new BigDecimal(tipoLicencia.getValor())) < 0) {
                throw new Exception("Fondos insuficientes en la wallet de dividendos");
            }
        }

        Licencia licencia = crearOActualizarLicencia(usuarioDestinatario, tipoLicencia);
        usuarioDestinatario.setLicencia(licencia);
        usuarioRepository.save(usuarioDestinatario);

        transaccionService.procesarTransaccion(
                usuario.getId(),
                new BigDecimal(tipoLicencia.getValor()).doubleValue(),
                TipoConceptos.COMPRA_LICENCIA_DELEGADA,
                tipoMetodoPago,
                EstadoOperacion.APROBADA,
                null,
                destinatario);
    }

    /**
     * Determina el tipo de licencia correspondiente según el precio total acumulado
     */
    private TipoLicencia determinarTipoLicenciaPorPrecio(int precioTotal) {
        // Recorrer las licencias de mayor a menor para encontrar la que corresponde
        if (precioTotal >= TipoLicencia.LICENCIA10.getValor()) {
            return TipoLicencia.LICENCIA10;
        } else if (precioTotal >= TipoLicencia.LICENCIA9.getValor()) {
            return TipoLicencia.LICENCIA9;
        } else if (precioTotal >= TipoLicencia.LICENCIA8.getValor()) {
            return TipoLicencia.LICENCIA8;
        } else if (precioTotal >= TipoLicencia.LICENCIA7.getValor()) {
            return TipoLicencia.LICENCIA7;
        } else if (precioTotal >= TipoLicencia.LICENCIA6.getValor()) {
            return TipoLicencia.LICENCIA6;
        } else if (precioTotal >= TipoLicencia.LICENCIA5.getValor()) {
            return TipoLicencia.LICENCIA5;
        } else if (precioTotal >= TipoLicencia.LICENCIA4.getValor()) {
            return TipoLicencia.LICENCIA4;
        } else if (precioTotal >= TipoLicencia.LICENCIA3.getValor()) {
            return TipoLicencia.LICENCIA3;
        } else if (precioTotal >= TipoLicencia.LICENCIA2.getValor()) {
            return TipoLicencia.LICENCIA2;
        } else {
            return TipoLicencia.LICENCIA1;
        }
    }

    /**
     * Crea una nueva licencia o actualiza una existente para un usuario
     * Si el usuario no tiene licencia, crea una nueva con el tipo especificado
     * Si ya tiene una, suma el valor y actualiza al tipo correspondiente según el
     * precio total
     */
    @Transactional
    private Licencia crearOActualizarLicencia(Usuario usuario, TipoLicencia tipoLicencia) {
        Licencia licencia = usuario.getLicencia();

        if (licencia == null) {
            // Crear nueva licencia
            licencia = Licencia.builder()
                    .nombre(tipoLicencia.name())
                    .fechaCompra(LocalDate.now())
                    .precio(tipoLicencia.getValor())
                    .limite(tipoLicencia.getValor() * 2)
                    .activo(true)
                    .saldoAcumulado(0)
                    .usuario(usuario)
                    .build();
        } else {
            // Actualizar licencia existente
            // Obtener el tipo de licencia actual
            TipoLicencia licenciaActual = determinarTipoLicenciaPorPrecio(licencia.getPrecio());

            // Validar que la nueva licencia sea igual o superior a la actual
            if (tipoLicencia.getValor() < licenciaActual.getValor()) {
                throw new RuntimeException(
                        "Para renovar la licencia, debe adquirir un paquete igual o superior al actual. " +
                                "Licencia actual: " + licenciaActual.name() + " ($" + licenciaActual.getValor() + "), "
                                +
                                "Licencia nueva: " + tipoLicencia.name() + " ($" + tipoLicencia.getValor() + ")");
            }

            // Sumar el nuevo valor al precio existente
            int precioTotal = licencia.getPrecio() + tipoLicencia.getValor();

            // Determinar la licencia correspondiente según el precio total
            TipoLicencia licenciaCorrespondiente = determinarTipoLicenciaPorPrecio(precioTotal);

            // Procesar bono de renovación si la licencia estaba inactiva
            if (licencia.getActivo() == null || !licencia.getActivo()) {
                try {
                    bonoService.bonoRenovacion(tipoLicencia, usuario.getReferenciado());
                } catch (Exception e) {
                    throw new RuntimeException("Error al procesar bono de renovación: " + e.getMessage(), e);
                }
            }

            licencia.setNombre(licenciaCorrespondiente.name());
            licencia.setFechaCompra(LocalDate.now());
            licencia.setPrecio(precioTotal);
            licencia.setLimite(licenciaCorrespondiente.getValor() * 2);
            licencia.setActivo(true);
            // Resetear el saldo acumulado al renovar/actualizar
            licencia.setSaldoAcumulado(0);
        }

        try {
            bonoService.bonoInscripcion(tipoLicencia, usuario.getReferenciado());
        } catch (Exception e) {
            throw new RuntimeException("Error al procesar bono de inscripción: " + e.getMessage(), e);
        }

        return licencia;
    }

    @Override
    public void TransferenciaEntreUsuarios(String usuarioDestinatario, BigDecimal monto, TipoWallets tipoWallet,
            Long idUsuario)
            throws Exception {
        Usuario usuarioOrigen = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new Exception("Usuario no encontrado con id: " + idUsuario));

        Usuario usuarioDestino = usuarioRepository.findByUsername(usuarioDestinatario)
                .orElseThrow(
                        () -> new Exception("Usuario destinatario no encontrado con username: " + usuarioDestinatario));

        if (usuarioOrigen.getWallets().get(0).getSaldo().compareTo(monto) < 0) {
            throw new Exception("Fondos insuficientes para la transferencia");
        }

        usuarioOrigen.getWallets().stream()
                .filter(w -> w.getTipo().equals(tipoWallet))
                .findFirst()
                .orElseThrow(() -> new Exception(
                        "Wallet de comisiones no encontrada para el usuario con id: " + idUsuario))
                .setSaldo(usuarioOrigen.getWallets().get(0).getSaldo().subtract(monto));

        usuarioDestino.getWallets().stream()
                .filter(w -> w.getTipo().equals(TipoWallets.WALLET_DIVIDENDOS))
                .findFirst()
                .orElseThrow(() -> new Exception(
                        "Wallet de comisiones no encontrada para el usuario con id: " + usuarioDestino.getId()))
                .setSaldo(usuarioDestino.getWallets().get(0).getSaldo().add(monto));

        usuarioRepository.save(usuarioOrigen);
        usuarioRepository.save(usuarioDestino);

        transaccionService.procesarTransaccion(
                usuarioOrigen.getId(),
                monto.doubleValue(),
                TipoConceptos.TRANSFERENCIA_ENTRE_USUARIOS,
                null,
                EstadoOperacion.APROBADA,
                null,
                usuarioDestinatario);
    }

    /*
     * private UsuarioResponseDTO usuarioToUsuarioResponseDTO(Usuario usuario) {
     * UsuarioResponseDTO dto = new UsuarioResponseDTO();
     * dto.setId(usuario.getId());
     * dto.setUsername(usuario.getUsername());
     * dto.setCorreo(usuario.getEmail());
     * dto.setFechaRegistro(usuario.getFechaRegistro());
     * dto.setActivo(usuario.isActivo());
     * dto.setRango(usuario.getRango());
     * dto.setWalletAddress(usuario.getWalletAddress());
     * dto.setNombre(usuario.getNombre());
     * dto.setApellido(usuario.getApellido());
     * dto.setTelefono(usuario.getTelefono());
     * dto.setPais(usuario.getPais());
     * dto.setReferenciado(usuario.getReferenciado());
     * dto.setBonos(usuario.getBonos());
     * dto.setWallets(usuario.getWallets());
     * dto.setPaquete(usuario.getPaquete());
     * return dto;
     * }
     */

    @Override
    @Transactional
    public void aprobarCompraLicencia(Long idSolicitud) throws Exception {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new Exception("Solicitud no encontrada con id: " + idSolicitud));

        // Lógica para aprobar la solicitud de compra de licencia
        solicitud.setEstado(EstadoOperacion.APROBADA);
        solicitudRepository.save(solicitud);

        Licencia licencia = crearOActualizarLicencia(solicitud.getUsuario(),
                determinarTipoLicenciaPorPrecio(solicitud.getMonto().intValue()));

        solicitud.getUsuario().setLicencia(licencia);

        usuarioRepository.save(solicitud.getUsuario());
        transaccionService.procesarTransaccion(
                solicitud.getUsuario().getId(),
                solicitud.getMonto().doubleValue(),
                TipoConceptos.COMPRA_LICENCIA,
                null,
                EstadoOperacion.APROBADA,
                solicitud.getTipoCrypto(),
                null);
    }

    @Override
    @Transactional
    public void rechazarSolcitud(Long idSolicitud) throws Exception {
        Solicitud solicitud = solicitudRepository.findById(idSolicitud)
                .orElseThrow(() -> new Exception("Solicitud no encontrada con id: " + idSolicitud));

        // Lógica para rechazar la solicitud
        solicitud.setEstado(EstadoOperacion.RECHAZADA);
        solicitudRepository.save(solicitud);

        transaccionService.procesarTransaccion(
                solicitud.getUsuario().getId(),
                solicitud.getMonto().doubleValue(),
                TipoConceptos.COMPRA_LICENCIA,
                null,
                EstadoOperacion.RECHAZADA,
                solicitud.getTipoCrypto(),
                null);
    }
}
