package com.github.slowrookie.co.auth.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupUserId implements Serializable {

    private String groupId;

    private String userId;

}
