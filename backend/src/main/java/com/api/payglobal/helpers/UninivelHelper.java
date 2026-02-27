package com.api.payglobal.helpers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.api.payglobal.dto.response.UsuarioEnRedResponse;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.entity.enums.TipoRango;
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

    public List<UsuarioEnRedResponse> mapearAUsuarioEnRedResponse(List<Usuario> usuarios, String usernameRaiz) {
        List<UsuarioEnRedResponse> respuestas = new java.util.ArrayList<>();
        for (Usuario usuario : usuarios) {
            UsuarioEnRedResponse respuesta = UsuarioEnRedResponse.builder()
                .username(usuario.getUsername())
                .licencia(usuario.getLicencia())
                .nivel(calcularNivelUsuario(usuario.getUsername(), usernameRaiz))
                .referido(usuario.getReferenciado())
                .build();
            respuestas.add(respuesta);
        }
        return respuestas;
    }
    public void asignarNivelesAUsuarios(List<UsuarioEnRedResponse> usuarios, String usernameRaiz) {
        usuarios.forEach(u -> u.setNivel(calcularNivelUsuario(u.getUsername(), usernameRaiz)));
    }

    private Integer calcularNivelUsuario(String username, String usernameRaiz) {
        Usuario usuario = usuarioRepository.findByUsername(username).orElse(null);
        if (usuario == null || username.equals(usernameRaiz)) {
            return 0;
        }
        
        int nivel = 0;
        String referenciador = usuario.getReferenciado();
        
        while (referenciador != null && !referenciador.equals(usernameRaiz)) {
            Usuario referenciadorUsuario = usuarioRepository.findByUsername(referenciador).orElse(null);
            if (referenciadorUsuario == null) break;
            referenciador = referenciadorUsuario.getReferenciado();
            nivel++;
        }
        
        return referenciador != null ? nivel + 1 : 0;
    }

    public List<UsuarioEnRedResponse> obtenerRedDeUsuariosInversaRecursiva(String usernameReferenciador,Integer nivelActual, Integer nivelMaximo) {
        List<UsuarioEnRedResponse> redInversa = new ArrayList<>();
        
        Usuario usuario = usuarioRepository.findByUsername(usernameReferenciador)
            .orElse(null);

        if (usuario == null) {
            return redInversa;
        }

        UsuarioEnRedResponse usuarioResponse = UsuarioEnRedResponse.builder()
            .username(usuario.getUsername())
            .licencia(usuario.getLicencia())
            .nivel(nivelActual+1)
            .build();

        redInversa.add(usuarioResponse);

        if (nivelActual < nivelMaximo) {
            redInversa.addAll(obtenerRedDeUsuariosInversaRecursiva(usuario.getReferenciado(), nivelActual + 1, nivelMaximo));
        }

        return redInversa;
    }

    public List<Usuario> obtenerRedDeUsuariosPorRango(String usernameReferenciador, TipoRango tipoRango) {
        Usuario usuario = usuarioRepository.findByUsername(usernameReferenciador)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Usuario> redPorRango = new ArrayList<>();
        obtenerReferidosRecursivo(usuario.getUsername(), redPorRango, 0, tipoRango.getNumero());
        return redPorRango;
    }
}
