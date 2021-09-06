package com.nubila.nubila.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Common {
    private String status;
    private Timestamp createDate;
    private Timestamp modifyDate;
}
