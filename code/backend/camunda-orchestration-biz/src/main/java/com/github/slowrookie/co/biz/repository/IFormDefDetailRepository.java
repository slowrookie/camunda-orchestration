package com.github.slowrookie.co.biz.repository;

import com.github.slowrookie.co.biz.model.FormDefDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IFormDefDetailRepository extends JpaRepository<FormDefDetail, String>, JpaSpecificationExecutor<FormDefDetail> {

    @Query("select fdd from FormDef fd left join FormDefDetail fdd on fdd.formDefId = fd.id and fdd.version = fd.rev order by fdd.createdDate desc")
    List<FormDefDetail> findLatestVersion();

}
