package com.nubila.nubila.nubijaapi;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter @Setter
@RequiredArgsConstructor
@JsonNaming(PropertyNamingStrategies.UpperCamelCaseStrategy.class)
public class TerminalInfo implements Serializable{
    private String emptycnt;
    private String parkcnt;
    private String tmname;
    private String rackcnt;
    private String latitude;
    private String longitude;
    private String vno;

}