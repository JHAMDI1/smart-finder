package com.smartfinder.auth.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/lieux/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/lieux/search").permitAll()
                        .requestMatchers(HttpMethod.POST, "/smart-search/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/criteres/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/avis/**").permitAll()
                        // Avis endpoints (nested under /lieux/{id}/avis)
                        .requestMatchers(HttpMethod.GET, "/lieux/*/avis").permitAll()
                        .requestMatchers(HttpMethod.POST, "/lieux/*/avis").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/lieux/*/avis/*").authenticated()
                        // Authenticated endpoints
                        .requestMatchers(HttpMethod.POST, "/upload/image").authenticated()
                        .requestMatchers(HttpMethod.POST, "/avis/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/lieux").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/lieux/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/lieux/**").authenticated()
                        // Admin only
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/criteres/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/criteres/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/criteres/**").hasRole("ADMIN")
                        // Any other request needs authentication
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
