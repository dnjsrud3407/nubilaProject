package com.nubila.nubila.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@ConfigurationProperties(prefix="my.key")
public class ApiKey {
    private String nubijaApiJ;
    private String nubijaApiH;
    private String tmapApiJ;
    private int randFlag = 0;

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

    public String getRandNubijaApiKey() {
        log.info("====== randFlag : {}", randFlag);
        if (randFlag == 0) {
            randFlag = 1;
            return getNubijaApiH();
        } else {
            randFlag = 0;
            return getNubijaApiJ();
        }
    }
}
