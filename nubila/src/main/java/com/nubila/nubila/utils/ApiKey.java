package com.nubila.nubila.utils;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix="my.key")
public class ApiKey {
    private String nubijaApiJ;
    private String nubijaApiH;
    private String tmapApiJ;

    public String getNubijaApiJ() {
        return nubijaApiJ;
    }

    public void setNubijaApiJ(String nubijaApiJ) {
        this.nubijaApiJ = nubijaApiJ;
    }

    public String getNubijaApiH() {
        return nubijaApiH;
    }

    public void setNubijaApiH(String nubijaApiH) {
        this.nubijaApiH = nubijaApiH;
    }

    public String getTmapApiJ() {
        return tmapApiJ;
    }

    public void setTmapApiJ(String tmapApiJ) {
        this.tmapApiJ = tmapApiJ;
    }
}
