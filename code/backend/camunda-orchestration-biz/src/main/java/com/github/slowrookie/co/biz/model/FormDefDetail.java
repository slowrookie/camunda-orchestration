package com.github.slowrookie.co.biz.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "biz_form_def_detail")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class FormDefDetail extends AbstractPersistableUuid implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Column(nullable = false)
    private String formDefId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String key;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String schemas;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean enable;

    @Column(nullable = false)
    private Integer version;

    @CreatedDate
    @Column(nullable = false)
    private Instant createdDate;

    @CreatedBy
    @Column(nullable = false)
    private String createdBy;

}
