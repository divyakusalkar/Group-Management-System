package com.capstone.groupmanagement.service;

import com.capstone.groupmanagement.dto.GroupDTO;
import com.capstone.groupmanagement.dto.GroupResponseDTO;

import java.util.List;

public interface GroupService {

    GroupResponseDTO createGroup(GroupDTO groupDTO);

    List<GroupResponseDTO> getAllGroups();

    GroupResponseDTO getGroupById(Long groupId);

    GroupResponseDTO updateGroup(Long groupId, GroupDTO groupDTO);

    void deleteGroup(Long groupId);

    GroupResponseDTO toggleGroupStatus(Long groupId);
}
