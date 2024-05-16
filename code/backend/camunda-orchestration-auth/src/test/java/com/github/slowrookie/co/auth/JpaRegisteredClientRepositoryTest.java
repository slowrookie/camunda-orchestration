package com.github.slowrookie.co.auth;

import com.github.slowrookie.co.auth.repository.JpaRegisteredClientRepository;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import static com.github.slowrookie.co.auth.granttype.PasswordGrantAuthenticationConverter.PASSWORD_GRANT_TYPE;

@SpringBootTest
public class JpaRegisteredClientRepositoryTest {

    @Resource
    private JpaRegisteredClientRepository jpaRegisteredClientRepository;
    @Resource
    private PasswordEncoder passwordEncoder;


    // test save
    @Test
    public void save() {
        RegisteredClient registeredClient = RegisteredClient
                .withId(UUID.randomUUID().toString())
                .clientId("test")
                .clientName("test")
                .clientSecret(passwordEncoder.encode("test"))
                .authorizationGrantType(PASSWORD_GRANT_TYPE)
                .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                .clientIdIssuedAt(Instant.now())
                .clientSecretExpiresAt(Instant.now().plus(Duration.ofDays(365)))
                .scope("openid")
                .tokenSettings(
                        TokenSettings.builder()
                                .accessTokenFormat(OAuth2TokenFormat.SELF_CONTAINED)
                                .accessTokenTimeToLive(Duration.ofDays(1))
                                .refreshTokenTimeToLive(Duration.ofDays(5))
                                .reuseRefreshTokens(true)
                                .build()
                )
                .build();
        jpaRegisteredClientRepository.save(registeredClient);
    }

}
