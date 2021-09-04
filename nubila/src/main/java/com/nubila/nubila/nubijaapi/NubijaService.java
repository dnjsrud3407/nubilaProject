package com.nubila.nubila.nubijaapi;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nubila.nubila.utils.ApiKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ClientCodecConfigurer;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.http.codec.json.Jackson2JsonEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeType;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;

import static org.springframework.http.MediaType.TEXT_HTML;

@Slf4j
@Service
public class NubijaService {
    private final String NUBIJA_URL = "http://api.nubija.com:1577/ubike/nubijaInfoApi.do";
    private final ApiKey apikey;
    private final WebClient webClient;

    public NubijaService(WebClient.Builder webClientBuilder, ApiKey apiKey) {
        this.webClient = webClientBuilder
                .baseUrl(NUBIJA_URL)
                .exchangeStrategies(ExchangeStrategies.builder().codecs(this::acceptedCodecs).build())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE) //, MediaType.APPLICATION_XML_VALUE
                .build();
        this.apikey = apiKey;
    }

    private void acceptedCodecs(ClientCodecConfigurer clientCodecConfigurer) {
        clientCodecConfigurer.customCodecs().registerWithDefaultConfig(new Jackson2JsonEncoder(new ObjectMapper(), TEXT_HTML));
        clientCodecConfigurer.customCodecs().registerWithDefaultConfig(new Jackson2JsonDecoder(new ObjectMapper(), TEXT_HTML));
    }

    //@Cacheable(value="NUBIJA", unless = "#result == null", cacheManager = "cacheManager")
    public NubijaResponse getNubijaResponse() {
        //TODO 1d*24h*60min > 1000회이므로 키를 번갈아 이용하도록 수정 필요
        String randKey = apikey.getNubijaApiH();

        log.info("===== 캐싱된 데이터 없음, NUBIJA 데이터 새로 요청 =====");
        return webClient.get().uri(uriBuilder -> uriBuilder
                                .queryParam("apikey", randKey)
                                .build())
                .acceptCharset(StandardCharsets.UTF_8)
                .retrieve()
                .bodyToMono(NubijaResponse.class)
                .block();
//                .flux()
//                .toStream()
//                .findFirst()
//                .orElse(NubijaResponse.builder().Result(6).build());
    }
}
