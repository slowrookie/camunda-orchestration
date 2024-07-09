package com.github.slowrookie.co.biz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "biz_form_def")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class FormDef extends AbstractPersistableUuid implements Serializable{

    @Serial
    private static final long serialVersionUID = 1L;

    @Column(nullable = false, unique = true)
    private String key;

    @Version
    @Column(nullable = false)
    private Integer rev;

    @CreatedDate
    @Column(nullable = false)
    private Instant createdDate;

    @CreatedBy
    @Column(nullable = false)
    private String createdBy;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant lastModifiedDate;

    @LastModifiedBy
    @Column(nullable = false)
    private String lastModifiedBy;

}
