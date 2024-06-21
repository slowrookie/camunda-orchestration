package com.github.slowrookie.co.biz.repository;

import com.github.slowrookie.co.biz.model.FormDefDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface IFormDefDetailRepository extends JpaRepository<FormDefDetail, String>, JpaSpecificationExecutor<FormDefDetail> {

}
