package com.nubila.nubila.nubijaapi;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;

import java.io.Serializable;

@Data @Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.UpperCamelCaseStrategy.class)
public class NubijaResponse implements Serializable{
    private String result;
    private String regdate;
    private TerminalInfo[] terminalInfo;
    private String regtime;
    private String errmsg;
}
