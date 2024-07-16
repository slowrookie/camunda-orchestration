package com.github.slowrookie.co.biz.audit;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.Optional;

@Component
public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        if (Objects.isNull(SecurityContextHolder.getContext()) || Objects.isNull(SecurityContextHolder.getContext().getAuthentication())) {
            return Optional.of("system");
        }
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication().getName());
    }

}
