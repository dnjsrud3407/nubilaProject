package com.nubila.nubila.nubijaapi;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//CORS 이슈를 해결하고자 백엔드를 거쳐서 정보를 받아온다.
@Slf4j
@RestController
@RequestMapping("nubija")
public class NubijaApiController {
    private NubijaService nubijaService;
    public NubijaApiController(NubijaService nubijaService) {
        this.nubijaService = nubijaService;
    }

    @GetMapping
    public NubijaResponse requestNubijaApi() {
        return nubijaService.getNubijaResponse();
    }

}
