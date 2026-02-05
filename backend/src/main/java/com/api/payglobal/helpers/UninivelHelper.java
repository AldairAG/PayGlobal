package com.api.payglobal.helpers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.payglobal.dto.response.UsuarioEnRedResponse;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.repository.UsuarioRepository;

@Service
public class UninivelHelper {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> obtenerRedDeUsuario(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Usuario> redDeUsuario = new java.util.ArrayList<>();
        obtenerReferidosRecursivo(usuario.getUsername(), redDeUsuario, 0, 7);
        
        return redDeUsuario;
    }

    private void obtenerReferidosRecursivo(String username, List<Usuario> redDeUsuario, int nivelActual, int nivelMaximo) {
        if (nivelActual >= nivelMaximo) {
            return;
        }

        List<Usuario> referidos = usuarioRepository.findByReferenciado(username);
        redDeUsuario.addAll(referidos);

        for (Usuario referido : referidos) {
            obtenerReferidosRecursivo(referido.getUsername(), redDeUsuario, nivelActual + 1, nivelMaximo);
        }
    }

    public List<UsuarioEnRedResponse> mapearAUsuarioEnRedResponse(List<Usuario> usuarios) {
        List<UsuarioEnRedResponse> respuestas = new java.util.ArrayList<>();
        for (Usuario usuario : usuarios) {
            UsuarioEnRedResponse respuesta = UsuarioEnRedResponse.builder()
                .username(usuario.getUsername())
                .licencia(usuario.getLicencia())
                .build();
            respuestas.add(respuesta);
        }
        return respuestas;
    }

    public List<UsuarioEnRedResponse> obtenerRedDeUsuariosInversaRecursiva(String usernameReferenciador,Integer nivelActual, Integer nivelMaximo) {
        List<UsuarioEnRedResponse> redInversa = new ArrayList<>();
        
        Usuario usuario = usuarioRepository.findByUsername(usernameReferenciador)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UsuarioEnRedResponse usuarioResponse = UsuarioEnRedResponse.builder()
            .username(usuario.getUsername())
            .licencia(usuario.getLicencia())
            .nivel(nivelActual)
            .build();

        redInversa.add(usuarioResponse);

        if (nivelActual < nivelMaximo) {
            redInversa.addAll(obtenerRedDeUsuariosInversaRecursiva(usuario.getReferenciado(), nivelActual + 1, nivelMaximo));
        }

        return redInversa;
    }
}
