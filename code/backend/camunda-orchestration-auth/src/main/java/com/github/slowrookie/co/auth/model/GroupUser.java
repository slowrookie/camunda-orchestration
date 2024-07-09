package com.github.slowrookie.co.auth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "auth_group_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupUser implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @EmbeddedId
    private GroupUserId id;

    @MapsId("groupId")
    @ManyToOne
    @JoinColumn(name = "group_id", referencedColumnName = "id")
    private Group group;

    @MapsId("userId")
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    public GroupUser(String groupId, String userId) {
        this.group = group;
        this.user = user;
        this.id = new GroupUserId(groupId, userId);
    }

}
