package com.nubila.nubila.utils;

import lombok.extern.slf4j.Slf4j;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

@Slf4j
public class KeyGen {
    public static void getJasyptEncryptProperties() {
        try {
            StandardPBEStringEncryptor pbeEnc = new StandardPBEStringEncryptor();
            pbeEnc.setPassword("testfordevelop"); // 개발용 pw
            pbeEnc.setAlgorithm("PBEWithMD5AndDES");

            // 암호화, 복호화
            String encrypt = pbeEnc.encrypt("암호화할비밀번호");
            String decrypt = pbeEnc.decrypt(encrypt);
            if (log.isInfoEnabled()) {
                log.info("encrypt: {}, decrypt: {}", encrypt, decrypt);
            }
        } catch (Exception e) {
            if (log.isErrorEnabled()) {
                log.error("getJasyptEncryptProperties ERROR {}", e.getMessage());
            }
        }
    }

    // 암호화 된 api 키를 생성한다.
    public static void main(String[] args) {
        getJasyptEncryptProperties();
    }
}
