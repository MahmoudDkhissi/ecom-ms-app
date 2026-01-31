package com.mdk.commonsecurity;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@AutoConfiguration
@EnableMethodSecurity
@Import(FeignClientConfig.class)
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.
                csrf(csrf -> csrf.disable()).
                authorizeHttpRequests(requests -> requests.requestMatchers("/actuator/**").permitAll()).
                authorizeHttpRequests(requests -> requests.requestMatchers("/h2-console/**").permitAll()).
                authorizeHttpRequests(requests -> requests.anyRequest().authenticated()).
        oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }
}
