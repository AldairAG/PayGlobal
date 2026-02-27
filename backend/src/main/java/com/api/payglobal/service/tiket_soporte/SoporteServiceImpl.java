package com.api.payglobal.service.tiket_soporte;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.api.payglobal.dto.request.CrearTiketRequest;
import com.api.payglobal.entity.RespuestaTikect;
import com.api.payglobal.entity.TiketSoporte;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.entity.enums.EstadoTiket;
import com.api.payglobal.entity.enums.RolesUsuario;
import com.api.payglobal.entity.enums.TipoAutorTiket;
import com.api.payglobal.repository.TiketRepository;
import com.api.payglobal.repository.UsuarioRepository;

@Service
public class SoporteServiceImpl implements SoporteService {

    @Autowired
    private TiketRepository tiketRepository;

    @Autowired
    private UsuarioRepository userRepository;

    @Override
    public TiketSoporte crearTiket(CrearTiketRequest request, Long usuarioId) {
        Usuario usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        TiketSoporte tiket = TiketSoporte.builder()
                .asunto(request.getAsunto())
                .descripcion(request.getDescripcion())
                .estado(EstadoTiket.ABIERTO)
                .usuario(usuario)
                .fechaCreacion(LocalDateTime.now())
                .build();
        // Aquí podrías agregar lógica para asociar el tiket con un usuario específico
        return tiketRepository.save(tiket);
    }

    @Override
    public TiketSoporte editarEstadoTiketPorId(Long id, EstadoTiket estado) {
        TiketSoporte tiket = tiketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tiket no encontrado"));
        tiket.setEstado(estado);
        return tiketRepository.save(tiket);
    }

    @Override
    public TiketSoporte agregarComentarioTiket(Long id, String comentario, Long usuarioId) {
        Usuario usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        TiketSoporte tiket = tiketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tiket no encontrado"));

                RespuestaTikect respuesta = RespuestaTikect.builder()
                .respuesta(comentario)
                .fechaRespuesta(LocalDateTime.now())
                .autor(usuario.getRol() == RolesUsuario.USUARIO ? TipoAutorTiket.SOLICITANTE : TipoAutorTiket.SOPORTE)
                .tiketSoporte(tiket)
                .build();

        tiket.getRespuestaTikect().add(respuesta);
        return tiketRepository.save(tiket);
    }

    @Override
    public Page<TiketSoporte> listarTiketsPorUsuario(Long usuarioId, int page, int size) {
        Usuario usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaCreacion"));

        return tiketRepository.findByUsuario_id(usuario.getId(), pageable);
    }

    @Override
    public Page<TiketSoporte> listarTodosLosTikets(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaCreacion"));
        return tiketRepository.findAll(pageable);
    }
    
}
