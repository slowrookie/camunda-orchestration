package com.github.slowrookie.co.biz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author jiaxing.liu
 * @date 2024/5/31
 **/
@Entity
@Table(name = "biz_form_def")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormDef implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String key;

    @Version
    @Column(nullable = false)
    private Integer version;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String schemas;

}
